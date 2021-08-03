import { Injectable, EventEmitter } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { HttpErrorResponse } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { retry, delay } from 'rxjs/operators';
import * as moment from 'moment';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { PacketInfo, Packet, ClientInfo, Campaign, DownstreamInfo, DirEntry } from './app.model';
import { ApiService } from './api.service';
import { ConfigService } from './config.service';

interface WebsocketData {
  PacketInfo: PacketInfo,
}

@Injectable({
  providedIn: 'root'
})
export class AdminWebsocketService {
  public packetInfosEvent: EventEmitter<any> = new EventEmitter();
  public clientsEvent: EventEmitter<any> = new EventEmitter();
  public downstreamsEvent: EventEmitter<any> = new EventEmitter();
  public downstreamSelection: BehaviorSubject<string> = new BehaviorSubject<string>("client");
  public clientFilesUpdates: BehaviorSubject<string> = new BehaviorSubject<string>("client");
  
  public websocketStatus = "";
  public restStatus = "";

  private socket$!: WebSocketSubject<any>;
  private subscription!: Subscription;

  private packetInfos: PacketInfo[] = [];
  private clients: ClientInfo[] = [];
  private downstreams: { [id: string]: DownstreamInfo[] } = {};

  private uploads: DirEntry[] = [];
  private statics: DirEntry[] = [];

  constructor(		
    private apiService: ApiService,
    private configService: ConfigService,
  ) { 
    // Client refresh function. Runs forever
    this.refreshClients();
    const source = interval(10000);
    this.subscription = source.subscribe(val => this.refreshClients());

    this.connect();
  }

  private connect() {
    // Get initial data. Updates are handled via websocket
    // If server is available, also start websocket
    this.apiService.getPackets()
      .pipe(
        retry(30), 
        delay(1000) 
      )
      .subscribe(
        (data: PacketInfo[]) => {
          for (const packetInfo of data) {
            // Check if its channel list update
            this.updateDownstreams(packetInfo)
          }
          
          this.packetInfos = data;
          this.packetInfosEvent.emit(undefined); // undefined is broadcast all
          this.connectWs();
        },
        (err: HttpErrorResponse) => {
          this.restStatus = "error";
        },
    );
  }

  private connectWs() {
    console.log("Connect to websocket");

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

    // Function to listen for updates from WS
    this.socket$.subscribe((data: WebsocketData) => {
      var x: PacketInfo = this.packetInfos.find(packetInfo => packetInfo.Packet.packetid == data.PacketInfo.Packet.packetid ) as PacketInfo
      if (x == undefined) {
        // Add Packet
        this.packetInfos.push(data.PacketInfo);
      } else {
        // Update Packet 
        var index = this.packetInfos.indexOf(x);
        Object.assign(this.packetInfos[index], data.PacketInfo);
      }

      // Check if its channel list update
      this.updateDownstreams(data.PacketInfo)

      // Notify
      this.packetInfosEvent.emit(data.PacketInfo);
     });
  }


  private updateDownstreams(packetInfo: PacketInfo) {
    if (packetInfo.Packet.packetType != "downstreams") {
      return;
    }

    this.downstreams[packetInfo.Packet.computerid] = this.downstreamPacketResponseToData(packetInfo);
    this.downstreamsEvent.emit("");
  }

  private downstreamPacketResponseToData(packetInfo: PacketInfo): DownstreamInfo[] {
    var ret: DownstreamInfo[] = [];

    var n = 0;
    while (true) {
      var e1 = "name" + n;
      var e2 = "info" + n;

      if (e1 in packetInfo.Packet.response && e2 in packetInfo.Packet.response) {
        var d: DownstreamInfo = {
          Name: packetInfo.Packet.response[e1],
          Info: packetInfo.Packet.response[e2],
        };
        ret.push(d);
      } else {
        break;
      }
      if (n > 10) {
        break;
      }
      n += 1;
    }

    return ret;
  }

  public getDownstreamListFor(computerId: string): DownstreamInfo[] {
    var data = this.downstreams[computerId]

    // If no downstream packet has yet been received, just return fake default one
    if (data == undefined || data.length == 0) {
      data = [];
      data.push({
        Name: "client",
        Info: "client.exe",
      })
    }

    return data;
  }

  public getUploads(): DirEntry[] {
    return this.uploads;
  }
  public getStatics(): DirEntry[] {
    return this.statics;
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
    this.apiService.getClients().subscribe(
      (data: ClientInfo[]) => { 
          this.clients = data;
          this.clientsEvent.emit(data);
          this.restStatus = "ok";
        },
      (err: HttpErrorResponse) => {
        console.log("HTTP Error: " + err);
      },
    );

    this.apiService.getUploads().subscribe(
      (data: DirEntry[]) => { 
          this.uploads = data;
          this.clientFilesUpdates.next("nothing");
        },
      (err: HttpErrorResponse) => {
        console.log("HTTP Error: " + err);
      },
    );
    this.apiService.getStatics().subscribe(
      (data: DirEntry[]) => { 
          this.statics = data;
          this.clientFilesUpdates.next("nothing");
        },
      (err: HttpErrorResponse) => {
        console.log("HTTP Error: " + err);
      },
    );
  }


  disconnect() {
    this.socket$.complete();
  }

  
	// Util functions here for now...
	public getClientRelativeLastSeen(clientInfo: ClientInfo) {
		var dNow: moment.Moment = moment();
		var dLast: moment.Moment = moment(clientInfo.LastSeen);
		var diff = dNow.diff(dLast);
		return moment.duration(diff).humanize();
	}




}