import { Injectable, EventEmitter } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { HttpErrorResponse } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

import { SrvCmdBase, ClientBase, Command } from './app.model';
import { ApiService } from './api.service';
import { ConfigService } from './config.service';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

interface WebsocketData {
  SrvCmd: SrvCmdBase,
}

@Injectable({
  providedIn: 'root'
})
export class AdminWebsocketService {
  private socket$!: WebSocketSubject<any>;
  private subscription!: Subscription;

  public websocketStatus = "";
  public restStatus = "";

  private srvCmds: SrvCmdBase[] = [];
  private clients: ClientBase[] = [];

  public srvCmdsEvent: EventEmitter<any> = new EventEmitter();
  public clientsEvent: EventEmitter<any> = new EventEmitter();

  constructor(		
    private apiService: ApiService,
    private configService: ConfigService,
  ) { 
    this.connect();
  }

  public getSrvCmds(): SrvCmdBase[] {
    return this.srvCmds;
  }

  public getClients(): ClientBase[] {
    return this.clients;
  }

  public getClientBy(computerId: string): ClientBase {
    return this.getClients().find(c => c.ComputerId == computerId)!;
  }

  private refreshClients() {
    this.apiService.refreshClients().subscribe(
      (data: ClientBase[]) => { 
          this.clients = data;
          this.clientsEvent.emit(data);
          this.restStatus = "ok";
        },
      (err: HttpErrorResponse) => {
        console.log("HTTP Error: " + err);
      },
    );
  }

  private connect() {
    // Get initial data
    this.apiService.refreshCommands().subscribe(
      (data: SrvCmdBase[]) => { 
        this.srvCmds = data;
        this.srvCmdsEvent.emit(undefined); // undefined is broadcast all
      },
      (err: HttpErrorResponse) => {
        console.log("HTTP Error: " + err);
        this.restStatus = "error";
      },
    );

    this.refreshClients();
    const source = interval(10000);
    this.subscription = source.subscribe(val => this.refreshClients());

    // Make WS, connect
    if (!this.socket$ || this.socket$.closed) {
      var newUrl = this.configService.getServerIp().replace('http', 'ws') + "/ws";
      this.socket$ = webSocket({
        url: newUrl,
        openObserver: {
          next: () => {
            this.websocketStatus = "Open";
          },
        },
        closeObserver: {
          next: () => {
            this.websocketStatus = "Closed";
            console.log('[WebSocket]: connection closed, retrying');
            timer(0)
            .pipe(take(1))
            .subscribe(() => {
              this.connect();
            });
            
          }
        },
      });

      // Send our authentication token
      this.socket$.next(this.configService.getAdminApiKey());
    }

    // Function to listen for updates from WS
    this.socket$.subscribe((data: WebsocketData) => {
      var x: SrvCmdBase = this.srvCmds.find(srvCmd => srvCmd.Command.packetid == data.SrvCmd.Command.packetid ) as SrvCmdBase
      if (x == undefined) {
        // Add command
        this.srvCmds.push(data.SrvCmd);
      } else {
        // Update command (by removing the previous one)
        var index = this.srvCmds.indexOf(x);
        Object.assign(this.srvCmds[index], data.SrvCmd);
      }

      // Notify
      this.srvCmdsEvent.emit(data.SrvCmd);
     });
  }

  disconnect() {
    this.socket$.complete();
  }

}