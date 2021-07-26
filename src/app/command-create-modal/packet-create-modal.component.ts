import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PacketInfo, Packet, ClientInfo, Campaign } from '../app.model';
import { ApiService } from '../api.service';
import {AfterViewInit, ViewChild} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { AdminWebsocketService } from '../admin-websocket.service';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfigService } from '../config.service';
import { CommandTableComponent } from '../packet-table/packet-table.component';

export interface PacketCreateArgs {
  computerId: string,
}

@Component({
  selector: 'app-packet-create-modal',
  templateUrl: './packet-create-modal.component.html',
  styleUrls: ['./packet-create-modal.component.css']
})
export class PacketCreateModalComponent implements OnInit {
  serverurl: string = ""
  executable: string = ""
  param1: string = ""
  param2: string = ""
  param3: string = ""

  selectedTabIndex: number = 0

  uploadUrlBase: string = ""
  uploadSource: string = ""

  downloadUrlBase: string = ""
  downloadUrlFile: string = ""
  downloadDestination: string = ""
  client: ClientInfo
  interactiveStdout: string = ""
  
  commandlineInteractive: string = "hostname"

  commandselect: number = 0
  commandline: string = "cmd /C hostname"
  interval: any

  constructor(
    private apiService: ApiService,
    private adminWebsocketService: AdminWebsocketService,
    private configService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public packetCreateArgs: PacketCreateArgs
  ) { }

  openFileTab(url: string){
    let basename = url.substring(url.lastIndexOf('/')+1);
    let url2 = this.apiService.getAdminUpload(basename);
    window.open(url2, "_blank");
  }
  
  getRandomInt(): string {
    return Math.floor(Math.random() * 1000000).toString();
  }

  ngOnInit(): void {
    // Default values (for testing)
    if (true) {
      this.apiService.getCampaign().subscribe(
        (campaign: Campaign) => { 
          this.executable = "cmd";
          this.param1 = "/C"
          this.param2 = "whoami"

          this.serverurl = campaign.ServerUrl;
    
          this.uploadUrlBase = campaign.ServerUrl + campaign.FileUploadPath;
          this.uploadSource = "README.md";
    
          this.downloadUrlBase = campaign.ServerUrl + campaign.FileDownloadPath;
          console.log("0: ", this.serverurl);
          this.downloadUrlFile = "test.txt";
          this.downloadDestination = "test.txt";
        },
        (err: HttpErrorResponse) => {
          console.log("HTTP Error: " + err);
        },
      );
    }

    this.client = this.adminWebsocketService.getClientBy(this.packetCreateArgs.computerId);

    // Get initial
    this.updateInteractive();

    // Get and update data
    this.adminWebsocketService.packetInfosEvent.subscribe((packetInfo: PacketInfo) => {
      // Check if it concerns us
      if (packetInfo != undefined && packetInfo.Packet.computerid == this.packetCreateArgs.computerId) {
        this.updateInteractive();
      }

      // Also update client info (e.g. last seen)
      this.client = this.adminWebsocketService.getClientBy(this.packetCreateArgs.computerId);
    })
  }

  updateInteractive() {
    var data2 = this.adminWebsocketService.getPacketInfos();
    var newData = data2.filter(d => 
      (d.Packet.computerid == this.packetCreateArgs.computerId || d.Packet.computerid == "0") 
      && (d.Packet.command == "iIssue" || d.Packet.command == "iOpen"));
    
    this.commandlineInteractive = "";
    this.interactiveStdout = "";
    newData.forEach(element => {
      if (element.Packet.response.hasOwnProperty("stdout")) {
        this.interactiveStdout += element.Packet.response['stdout'];
      }
      if (element.Packet.response.hasOwnProperty("stderr")) {
        this.interactiveStdout += element.Packet.response['stderr'];
      }
    });
  }

  addPacketTest() {
    var packet: Packet = {
      computerid: this.client.ComputerId, 
      packetid: this.getRandomInt(),
      command: 'test',
      arguments: { "test": "test" },
      response: {},
    }

    this.apiService.sendPacket(packet).subscribe(
      (data: any) => { 
        console.log("sendPacket successful")
      },
      (err: HttpErrorResponse) => {
        console.log("sendPacket failed")
      },
    );
  }

  interactiveCmdOpen(force: boolean) {
    var packet: Packet = {
      computerid: this.client.ComputerId, 
      packetid: this.getRandomInt(),
      command: 'iOpen',
      arguments: { },
      response: {},
    }
    if (force) {
      packet.arguments['force'] = "force";
    }

    this.apiService.sendPacket(packet).subscribe(
      (data: any) => { 
        console.log("sendPacket successful")
      },
      (err: HttpErrorResponse) => {
        console.log("sendPacket failed")
      },
    );
  }

  interactiveCmdIssue() {
    var packet: Packet = {
      computerid: this.client.ComputerId, 
      packetid: this.getRandomInt(),
      command: 'iIssue',
      arguments: { 'commandline': this.commandlineInteractive },
      response: {},
    }

    this.apiService.sendPacket(packet).subscribe(
      (data: any) => { 
        console.log("sendPacket successful")
      },
      (err: HttpErrorResponse) => {
        console.log("sendPacket failed")
      },
    );
  }

  addPacketExecLine() {
    var split = this.commandline.split(" ")
    var executable: string = split[0];
    var paramsArr = split.slice(1);

    var params:{ [id: string]: string } = {};
    params["executable"] = executable
    for(var n=0; n<paramsArr.length; n++) {
      params["param" + n] = paramsArr[n];
    }
    console.log(params);

    var packet: Packet = {
      computerid: this.client.ComputerId, 
      packetid: this.getRandomInt(),
      command: 'exec',
      arguments: params,
      response: {},
    }

    this.apiService.sendPacket(packet).subscribe(
      (data: any) => { 
        console.log("sendPacket successful")
      },
      (err: HttpErrorResponse) => {
        console.log("sendPacket failed")
      },
    );
  }

  addPacketExecArgs() {
    var packet: Packet = {
      computerid: this.client.ComputerId, 
      packetid: this.getRandomInt(),
      command: 'exec',
      arguments: { 
        "executable": this.executable,
      },
      response: {},
    }

    if (this.param1 != "") {
      packet.arguments["param0"] = this.param1;
    }
    if (this.param2 != "") {
      packet.arguments["param1"] = this.param2;
    }
    if (this.param3 != "") {
      packet.arguments["param2"] = this.param3;
    }

    this.apiService.sendPacket(packet).subscribe(
      (data: any) => { 
        console.log("sendPacket successful")
      },
      (err: HttpErrorResponse) => {
        console.log("sendPacket failed")
      },
    );
  }

  addPacketUpload() {
    var packetId = this.getRandomInt();
    var packet: Packet = {
      computerid: this.client.ComputerId, 
      packetid: packetId,
      command: 'fileupload',
      arguments: { 
        "remoteurl": this.uploadUrlBase + packetId,
        "source": this.uploadSource
      },
      response: {},
    }
    this.apiService.sendPacket(packet).subscribe(
      (data: any) => { 
        console.log("sendPacket successful")
      },
      (err: HttpErrorResponse) => {
        console.log("sendPacket failed")
      },
    );
  }

  addPacketDownload() {
    var packet: Packet = {
      computerid: this.client.ComputerId, 
      packetid: this.getRandomInt(),
      command: 'filedownload',
      arguments: { 
        "remoteurl": this.downloadUrlBase + this.downloadUrlFile,
        "destination": this.downloadDestination
      },
      response: {},
    }

    this.apiService.sendPacket(packet).subscribe(
      (data: any) => { 
        console.log("sendPacket successful")
      },
      (err: HttpErrorResponse) => {
        console.log("sendPacket failed")
      },
    );
  }
}
