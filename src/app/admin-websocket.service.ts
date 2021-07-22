import { Injectable, EventEmitter } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { HttpErrorResponse } from '@angular/common/http';

import { SrvCmdBase, ClientBase } from './app.model';
import { ApiService } from './api.service';


interface GuiData {
  Reason: string
  ComputerId: string
}


@Injectable({
  providedIn: 'root'
})
export class AdminWebsocketService {
  private socket$!: WebSocketSubject<any>;
  private interval: any

  private srvCmds: SrvCmdBase[] = [];
  private clients: ClientBase[] = [];

  public srvCmdsEvent: EventEmitter<any> = new EventEmitter();
  public clientsEvent: EventEmitter<any> = new EventEmitter();

  constructor(		
    private apiService: ApiService,
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
        this.srvCmdsEvent.emit(data);  
      },
      (err: HttpErrorResponse) => {
        console.log("HTTP Error: " + err);
      },
    );

    this.refreshClients();
    if(this.interval){
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
        this.refreshClients();
    }, 3000);

    // Make WS, connect
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket("ws://localhost:4444/admin/ws");
    }

    // Function to listen for updates from WS
    this.socket$.subscribe((data: GuiData) => {
      // Also check for new clients, for now
      this.apiService.refreshCommands().subscribe(
        (data: SrvCmdBase[]) => { 
            this.srvCmds = data;
            this.srvCmdsEvent.emit(data);  
          },
          (err: HttpErrorResponse) => {
            console.log("HTTP Error: " + err);
          },
      );
     });
  }

  disconnect() {
    this.socket$.complete();
  }

}