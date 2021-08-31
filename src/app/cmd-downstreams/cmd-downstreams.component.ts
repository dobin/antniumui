import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { Packet, ClientInfo, Campaign, DownstreamInfo, DirEntry } from '../app.model';
import { ApiService } from '../api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cmd-downstreams',
  templateUrl: './cmd-downstreams.component.html',
  styleUrls: ['./cmd-downstreams.component.css']
})
export class CmdDownstreamsComponent implements OnInit {
  @Input() computerId = "";

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
  }

  
  sendPacketDownstreamStart() {
    var packetId = this.apiService.getRandomInt();
    var packet: Packet = {
      computerid: this.computerId, 
      packetid: packetId,
      packetType: 'downstreamServerStart',
      arguments: {},
      response: {},
      downstreamId: "manager",
    }
    this.apiService.sendPacket(packet).subscribe(
      (data: any) => { 
        console.log("SendPacket successful")
      },
      (err: HttpErrorResponse) => {
        console.log("SendPacket failed")
      },
    );
  }

  sendPacketDownstreamServers() {
    var packetId = this.apiService.getRandomInt();
    var packet: Packet = {
      computerid: this.computerId, 
      packetid: packetId,
      packetType: 'downstreamServers',
      arguments: {},
      response: {},
      downstreamId: "manager",
    }
    this.apiService.sendPacket(packet).subscribe(
      (data: any) => { 
        console.log("SendPacket successful")
      },
      (err: HttpErrorResponse) => {
        console.log("SendPacket failed")
      },
    );
  }

  sendPacketDownstreamStop() {
    var packetId = this.apiService.getRandomInt();
    var packet: Packet = {
      computerid: this.computerId, 
      packetid: packetId,
      packetType: 'downstreamServerStop',
      arguments: {},
      response: {},
      downstreamId: "manager",
    }
    this.apiService.sendPacket(packet).subscribe(
      (data: any) => { 
        console.log("SendPacket successful")
      },
      (err: HttpErrorResponse) => {
        console.log("SendPacket failed")
      },
    );
  }
}
