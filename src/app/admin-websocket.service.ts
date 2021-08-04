import { Injectable, EventEmitter } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { interval, Subscription } from 'rxjs';

import { PacketInfo } from './app.model';
import { DataService } from './data.service';
import { ConfigService } from './config.service';

interface WebsocketData {
  PacketInfo: PacketInfo,
}

@Injectable({
  providedIn: 'root'
})
export class AdminWebsocketService {

  public websocketStatus = "";
  public restStatus = "";

  private socket$!: WebSocketSubject<any>;
  private subscription!: Subscription;

  constructor(		
    private configService: ConfigService,
    private dataService: DataService,
  ) {
    console.log("AdminWebsocket: Constructor")
    this.setupRefresher();
    this.connectWs();
  }

  private setupRefresher() {
    const source = interval(10000); // 10s
    this.subscription = source.subscribe(val => this.dataService.periodicRefresh());
  }

  private connectWs() {
    var newUrl = this.configService.getServerIp().replace('http', 'ws') + "/ws";
    this.socket$ = webSocket({
      url: newUrl,
      openObserver: {
        next: () => {
          console.log("Websocket open");
          this.websocketStatus = "Open";
        },
      },
      closeObserver: {
        next: () => {
          this.websocketStatus = "Closed";
          console.log('[WebSocket]: connection closed, retrying');
          /*timer(0)
          .pipe(take(1))
          .subscribe(() => {
            this.connect();
          });*/
        }
      },
    });
    // Send our authentication token
    this.socket$.next(this.configService.getAdminApiKey());

    // Function to listen for updates from WS
    this.socket$.subscribe((data: WebsocketData) => {
      this.dataService.addUpdatePacket(data.PacketInfo);
     });
  }

  disconnect() {
    this.socket$.complete();
  }
}