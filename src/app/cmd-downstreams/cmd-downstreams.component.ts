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
  @Input() clientId = "";

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
  }

  
  sendPacketDownstreamStart() {
    var args:{ [id: string]: string } = {};
    args['tcp'] = 'localhost:50000';
    args['directory'] = 'c:\\temp\\';

    var packet = this.apiService.makePacket(
      this.clientId,
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
    var args:{ [id: string]: string } = {};
    var packet = this.apiService.makePacket(
      this.clientId,
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
    var args:{ [id: string]: string } = {};
    var packet = this.apiService.makePacket(
      this.clientId,
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
