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
    var args = {};
    var packet = this.apiService.makePacket(
      this.computerId,
      'downstreamServerStart',
      args,
      "manager"
    );
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
    var args = {};
    var packet = this.apiService.makePacket(
      this.computerId,
      'downstreamServers',
      args,
      "manager"
    );
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
    var args = {};
    var packet = this.apiService.makePacket(
      this.computerId,
      'downstreamServerStop',
      args,
      "manager"
    );
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
