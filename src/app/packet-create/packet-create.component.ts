import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { PacketInfo, Packet, ClientInfo, Campaign } from '../app.model';
import { ApiService } from '../api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminWebsocketService } from '../admin-websocket.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-packet-create',
  templateUrl: './packet-create.component.html',
  styleUrls: ['./packet-create.component.css']
})
export class PacketCreateComponent implements OnInit {
  // Data
  @Input() computerId = "";


  // UI
  selectExecType: string = "line"

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
  interactiveStdout: string = ""
  
  commandlineInteractive: string = "hostname"

  commandselect: number = 0
  commandline: string = "cmd /C hostname"
  interval: any

  downstreamId: string = "client"

  constructor(
    private apiService: ApiService,
    private adminWebsocketService: AdminWebsocketService,
    private snackBar: MatSnackBar,
  ) { }

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

    // Get initial Packet Data
    this.updateInteractive();
    // Update Packet data
    this.adminWebsocketService.packetInfosEvent.subscribe((packetInfo: PacketInfo) => {
      // Check if it concerns us
      if (packetInfo != undefined && packetInfo.Packet.computerid == this.computerId) {
        this.updateInteractive();
      }
    })

    // Subscribe to downstream selection
    this.adminWebsocketService.downstreamSelection.subscribe(downstreamId => {
      this.downstreamId = downstreamId;
    });
  }

  updateInteractive() {
    var data2 = this.adminWebsocketService.getPacketInfos();
    var newData = data2.filter(d => 
      (d.Packet.computerid == this.computerId || d.Packet.computerid == "0") 
      && (d.Packet.packetType == "iIssue" || d.Packet.packetType == "iOpen"));
    
    this.commandlineInteractive = "";
    this.interactiveStdout = "";
    newData.forEach(element => {
      if (element.Packet.response.hasOwnProperty("stdout")) {
        this.interactiveStdout += element.Packet.response['stdout'];
      }
      if (element.Packet.response.hasOwnProperty("stderr")) {
        this.interactiveStdout += element.Packet.response['stderr'];
      }
      if (element.Packet.response.hasOwnProperty("error")) {
        this.interactiveStdout += element.Packet.response['error'];
      }
    });
  }

  sendPacketTest() {
    var packet: Packet = {
      computerid: this.computerId, 
      packetid: this.getRandomInt(),
      packetType: 'test',
      arguments: { "test": "test" },
      response: {},
      downstreamId: this.downstreamId,
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

  sendPacketInteractiveCmdOpen(force: boolean) {
    var packet: Packet = {
      computerid: this.computerId, 
      packetid: this.getRandomInt(),
      packetType: 'iOpen',
      arguments: { },
      response: {},
      downstreamId: this.downstreamId,
    }
    if (force) {
      packet.arguments['force'] = "force";
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

  sendPacketInteractiveCmdIssue() {
    var packet: Packet = {
      computerid: this.computerId, 
      packetid: this.getRandomInt(),
      packetType: 'iIssue',
      arguments: { 'commandline': this.commandlineInteractive },
      response: {},
      downstreamId: this.downstreamId,
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

  sendPacketExec() {
    var split = this.commandline.split(" ")
    var executable: string = split[0];
    var paramsArr = split.slice(1);

    var params:{ [id: string]: string } = {};
    if (this.selectExecType == "line") {
      console.log("line", params);
      params["executable"] = executable;
      for(var n=0; n<paramsArr.length; n++) {
        params["param" + n] = paramsArr[n];
      }
    } else if (this.selectExecType == "array") {
      console.log("array", params);
      params["executable"] = this.executable;
      if (this.param1 != "") {
        params["param0"] = this.param1;
      }
      if (this.param2 != "") {
        params["param1"] = this.param2;
      }
      if (this.param3 != "") {
        params["param2"] = this.param3;
      }
    } else {
      console.log("Unknown: " + this.selectExecType);
      return;
    }

    var packet: Packet = {
      computerid: this.computerId, 
      packetid: this.getRandomInt(),
      packetType: 'exec',
      arguments: params,
      response: {},
      downstreamId: this.downstreamId,
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

  sendPacketUpload() {
    var packetId = this.getRandomInt();
    var packet: Packet = {
      computerid: this.computerId, 
      packetid: packetId,
      packetType: 'fileupload',
      arguments: { 
        "remoteurl": this.uploadUrlBase + packetId,
        "source": this.uploadSource
      },
      response: {},
      downstreamId: this.downstreamId,
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

  sendPacketDownload() {
    var packet: Packet = {
      computerid: this.computerId, 
      packetid: this.getRandomInt(),
      packetType: 'filedownload',
      arguments: { 
        "remoteurl": this.downloadUrlBase + this.downloadUrlFile,
        "destination": this.downloadDestination
      },
      response: {},
      downstreamId: this.downstreamId,
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

  // Utils:

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }

  openFileTab(url: string){
    let basename = url.substring(url.lastIndexOf('/')+1);
    let url2 = this.apiService.getAdminUpload(basename);
    window.open(url2, "_blank");
  }
  
  getRandomInt(): string {
    return Math.floor(Math.random() * 1000000).toString();
  }

}
