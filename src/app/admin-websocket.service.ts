import { Injectable, EventEmitter } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { HttpErrorResponse } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

import { PacketInfo, Packet, ClientInfo, Campaign } from './app.model';
import { ApiService } from './api.service';
import { ConfigService } from './config.service';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

interface WebsocketData {
  PacketInfo: PacketInfo,
}

@Injectable({
  providedIn: 'root'
})
export class AdminWebsocketService {
  private socket$!: WebSocketSubject<any>;
  private subscription!: Subscription;

  public websocketStatus = "";
  public restStatus = "";

  private packetInfos: PacketInfo[] = [];
  private clients: ClientInfo[] = [];

  public packetInfosEvent: EventEmitter<any> = new EventEmitter();
  public clientsEvent: EventEmitter<any> = new EventEmitter();

  constructor(		
    private apiService: ApiService,
    private configService: ConfigService,
  ) { 
    this.connect();
  }

  public getPacketInfos(): PacketInfo[] {
    return this.packetInfos;
  }

  public getClients(): ClientInfo[] {
    return this.clients;
  }

  public getClientBy(computerId: string): ClientInfo {
    return this.getClients().find(c => c.ComputerId == computerId)!;
  }

  private refreshClients() {
    this.apiService.refreshClients().subscribe(
      (data: ClientInfo[]) => { 
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
    this.apiService.refreshPackets().subscribe(
      (data: PacketInfo[]) => { 
        this.packetInfos = data;
        this.packetInfosEvent.emit(undefined); // undefined is broadcast all
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
      var x: PacketInfo = this.packetInfos.find(packetInfo => packetInfo.Packet.packetid == data.PacketInfo.Packet.packetid ) as PacketInfo
      if (x == undefined) {
        // Add Packet

        this.packetInfos.push(data.PacketInfo);
      } else {
        // Update Packet (by removing the previous one)
        var index = this.packetInfos.indexOf(x);
        Object.assign(this.packetInfos[index], data.PacketInfo);
      }

      // Notify
      this.packetInfosEvent.emit(data.PacketInfo);
     });
  }

  disconnect() {
    this.socket$.complete();
  }

}