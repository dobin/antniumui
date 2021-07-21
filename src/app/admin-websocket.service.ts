import { Injectable, EventEmitter } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { HttpErrorResponse } from '@angular/common/http';

import { SrvCmdBase } from './app.model';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class AdminWebsocketService {
  private socket$!: WebSocketSubject<any>;
  private srvCmds: SrvCmdBase[] = [];
  public apiEvent: EventEmitter<any> = new EventEmitter();

  constructor(		
    private apiService: ApiService,
  ) { 
    this.connect();
  }

  public getSrvCmds(): SrvCmdBase[] {
    return this.srvCmds;
  }


  private connect() {
    // Get initial data
    this.apiService.refreshCommands().subscribe(
      (data: SrvCmdBase[]) => { 
        this.srvCmds = data;
        this.apiEvent.emit(data);  
      },
      (err: HttpErrorResponse) => {
        console.log("HTTP Error: " + err);
      },
    );

    // Make WS, connect
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket("ws://localhost:4444/admin/ws");
    }

    // Function to listen for updates
    this.socket$.subscribe((data: SrvCmdBase) => {
      // Add to our local DB
      this.srvCmds.push(data);

      // Notify
      this.apiEvent.emit(data);  
     });
  }


/*
  public dataUpdates$() {
    return this.connect().asObservable();
  }
  */

  disconnect() {
    this.socket$.complete();
  }

}