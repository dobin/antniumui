import { Injectable, EventEmitter } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

import { PacketInfo, Packet, ClientInfo, Campaign, DownstreamInfo, DirEntry, PacketState } from './app.model';
import { AdminWebsocketService } from './admin-websocket.service';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  /* Notifiers */
  // When: New packet arrived via websocket
  public packetInfosEvent: EventEmitter<any> = new EventEmitter();

  // When: updated (periodically)
  private _clients: BehaviorSubject<ClientInfo[]> = new BehaviorSubject<ClientInfo[]>([] as ClientInfo[]);
  public readonly clients: Observable<ClientInfo[]> = this._clients.asObservable();

  public downstreamsEvent: EventEmitter<any> = new EventEmitter();
  public clientFilesUpdates: BehaviorSubject<string> = new BehaviorSubject<string>("client");

  // When: user selects a downstream in the UI
  public downstreamSelection: BehaviorSubject<string> = new BehaviorSubject<string>("client");
  

  /* Data */
  // Loaded: Periodically
  //public clients: ClientInfo[] = [];
  public clientsDict: { [id: string]: ClientInfo } = {};
  public downstreams: { [id: string]: DownstreamInfo[] } = {};
  public uploads: DirEntry[] = [];
  public statics: DirEntry[] = [];
 
  // Loaded: Once (no notify)
  public campaign: Campaign = {} as Campaign;

  public packetInfos: PacketInfo[] = [];

  constructor(
    private apiService: ApiService,
    private adminWebsocketService: AdminWebsocketService,
  ) {
    this.downloadPeriodics();
    this.downloadCampaign();

    /** Downloads **/
    this.adminWebsocketService.messages$.subscribe(
      (packetInfo: PacketInfo) => {
        this.addUpdatePacket(packetInfo);
      },
    )
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
          this._clients.next(data);

          // Copy into dict
          this.clientsDict = {};
          for(var n=0; n<data.length; n++) {
            this.clientsDict[data[n].ComputerId] = data[n];
          }
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


  public periodicRefresh() {
    this.downloadPeriodics()
  }

  addUpdatePacket(packetInfo: PacketInfo) {
    var x: PacketInfo = this.packetInfos.find(pi => pi.Packet.packetid == packetInfo.Packet.packetid ) as PacketInfo
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
      } else if (packetInfo.Packet.packetType == "clientinfo") {
        this.downloadPeriodics() // Only need clients actually
      } else if (packetInfo.Packet.packetType == "fileupload" && packetInfo.State == PacketState.ANSWERED) {
        this.downloadPeriodics() // Only need files actually
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

  public downstreamSelectionReset() {
    this.downstreamSelection.next("client");
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
    return this.clientsDict[computerId];
    //return this.clients.find(c => c.ComputerId == computerId)!;
  }

  /** Data translation **/
  // Used for constructing links when static filename is known
	public makeStaticLink(filename: string): string {
		var url = this.campaign.ServerUrl + this.campaign.FileDownloadPath + filename;
    return url;
	}

  // Used for constructing links when upload filename is known
  public makeUploadLink(filename: string): string {
    var url = this.campaign.ServerUrl + "/admin/upload/" + filename;
    return url;
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

  public AddArrToArgs(packet: Packet, arr: string[]) {
    for(var n=0; n<arr.length; n++) {
      packet.arguments["param" + n] = arr[n]
    }
  }
}
