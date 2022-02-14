import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { Packet, ClientInfo, Campaign, DownstreamInfo, DirEntry } from '../app.model';
import { ApiService } from '../api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DataService } from '../data.service';

@Component({
  selector: 'app-cmd-other',
  templateUrl: './cmd-other.component.html',
  styleUrls: ['./cmd-other.component.css']
})
export class CmdOtherComponent implements OnInit {
  @Input() clientId = "";
  downstreamId: string = "client"

  constructor(
    private apiService: ApiService,
    private dataService: DataService,
  ) {}

  ngOnInit(): void {
        // Downstream-Selection
        this.dataService.downstreamSelectionReset();
        this.dataService.downstreamSelection.subscribe(downstreamId => {
          this.downstreamId = downstreamId;
        });
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

  sendPacketWingmanExplorer() {
    var args = { 
      "shelltype": "raw",
      "executable": "explorer.exe",
      "param0": "C:\\users\\dobin\\Repositories\\antnium\\wingman.exe",
    };
    var packet = this.apiService.makePacket(
      this.clientId,
      'exec',
      args,
      this.downstreamId
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

  sendPacketTest() {
    var args = { 
      "test": "test",
    };
    var packet = this.apiService.makePacket(
      this.clientId,
      'test',
      args,
      this.downstreamId
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

  sendPacketShutdown() {
    var args = { };
    var packet = this.apiService.makePacket(
      this.clientId,
      'shutdown',
      args,
      this.downstreamId
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
