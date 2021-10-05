import { Injectable, EventEmitter } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, tap, switchAll } from 'rxjs/operators';
import { EMPTY, Observable, Subject } from 'rxjs';

import { PacketInfo } from './app.model';
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
  private messagesSubject$: Subject<PacketInfo> = new Subject();
  public messages$: Observable<PacketInfo> = this.messagesSubject$.pipe();

  constructor(		
    private configService: ConfigService,
  ) {
    this.connectWs();
  }

  public connectWs() {
    console.log("[WebSocket]: Try connect WS");
    var newUrl = this.configService.getServerIp().replace('http', 'ws') + "/adminws";
    this.socket$ = webSocket({
      url: newUrl,
      openObserver: {
        next: () => {
          console.log("[WebSocket]: Websocket open");
          this.websocketStatus = "Open";
        },
      },
      closeObserver: {
        next: () => {
          this.websocketStatus = "Closed";
          console.log('[WebSocket]: connection closed');
        }
      },
    });
    // Send our authentication token
    this.socket$.next(this.configService.getAdminApiKey());

    // Function to listen for updates from WS
    this.socket$.subscribe((data: WebsocketData) => {
      console.log("<- WS", data.PacketInfo);
      this.messagesSubject$.next(data.PacketInfo);
     });
  }

  disconnect() {
    this.socket$.complete();
  }
}