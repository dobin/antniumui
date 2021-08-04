import { Injectable, EventEmitter } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';

import { PacketInfo, Packet, ClientInfo, Campaign, DownstreamInfo, DirEntry } from './app.model';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  /* Notifiers */
  // When: New packet arrived via websocket
  public packetInfosEvent: EventEmitter<any> = new EventEmitter();

  // When: updated (periodically)
  public clientsEvent: EventEmitter<any> = new EventEmitter();
  public downstreamsEvent: EventEmitter<any> = new EventEmitter();
  public clientFilesUpdates: BehaviorSubject<string> = new BehaviorSubject<string>("client");

  // When: user selects a downstream in the UI
  public downstreamSelection: BehaviorSubject<string> = new BehaviorSubject<string>("client");
  

  /* Data */

  // Loaded: once on start, then updated via websocket messages
  public packetInfos: PacketInfo[] = [];

  // Loaded: Periodically
  public clients: ClientInfo[] = [];
  public downstreams: { [id: string]: DownstreamInfo[] } = {};
  public uploads: DirEntry[] = [];
  public statics: DirEntry[] = [];
 
  // Loaded: Once (no notify)
  public campaign: Campaign = {} as Campaign;


  constructor(
    private apiService: ApiService,
  ) { 
    this.init()
  }

  // Load all initial data
  private init() {
    this.downloadCampaign();
    this.downloadPackets();
    this.downloadPeriodics();
  }

  /** Downloads **/

  downloadPackets() {
    // Packets
    this.apiService.getPackets().subscribe(
        (packetInfos: PacketInfo[]) => {
          this.packetPipeline(packetInfos);
          this.packetInfos = packetInfos;
          this.packetInfosEvent.emit(undefined); // undefined is broadcast all
        },
        (err: HttpErrorResponse) => {
          console.error(err);
        },
    );
  }

  downloadCampaign() {
    // Campaign
    this.apiService.getCampaign().subscribe(
      (campaign: Campaign) => { 
        this.campaign = campaign;
      },
      (err: HttpErrorResponse) => {
        console.log("HTTP Error: " + err);
      },
    );
  }

  private downloadPeriodics() {
    this.apiService.getClients().subscribe(
      (data: ClientInfo[]) => { 
          this.clients = data;
          this.clientsEvent.emit(data);
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


  /** Called externally, via AdminWebsocketService **/
  
  public periodicRefresh() {
    this.downloadPeriodics()
  }

  addUpdatePacket(packetInfo: PacketInfo) {
    var x: PacketInfo = this.packetInfos.find(packetInfo => packetInfo.Packet.packetid == packetInfo.Packet.packetid ) as PacketInfo
    if (x == undefined) {
      // Add Packet
      this.packetInfos.push(packetInfo);
    } else {
      // Update Packet 
      var index = this.packetInfos.indexOf(x);
      Object.assign(this.packetInfos[index], packetInfo);
    }

    this.packetPipeline([packetInfo])

    // Notify
    this.packetInfosEvent.emit(packetInfo);
  }


  /** Update local data structures based on events **/

  private packetPipeline(packetInfos: PacketInfo[]) {
    for (const packetInfo of packetInfos) {
      // Update downstreams data structure based on response
      if (packetInfo.Packet.packetType == "downstreams") {
        this.updateDownstreams(packetInfo)
      }
    }
  }

  private updateDownstreams(packetInfo: PacketInfo) {
    if (packetInfo.Packet.packetType != "downstreams") {
      return;
    }

    // Update downstreams list of client
    this.downstreams[packetInfo.Packet.computerid] = this.downstreamPacketResponseToData(packetInfo);

    // Notify
    this.downstreamsEvent.emit("");
  }


  /** Some special getters **/

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

  public getClientBy(computerId: string): ClientInfo {
    return this.clients.find(c => c.ComputerId == computerId)!;
  }


  /** Utility Functions **/
  
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
  
	// Util functions here for now...
	public getClientRelativeLastSeen(clientInfo: ClientInfo) {
		var dNow: moment.Moment = moment();
		var dLast: moment.Moment = moment(clientInfo.LastSeen);
		var diff = dNow.diff(dLast);
		return moment.duration(diff).humanize();
	}


}
