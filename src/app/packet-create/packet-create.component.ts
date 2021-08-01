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
  @Input() computerId = "";

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
  client!: ClientInfo
  interactiveStdout: string = ""
  
  commandlineInteractive: string = "hostname"

  commandselect: number = 0
  commandline: string = "cmd /C hostname"
  interval: any

  downstream: string = "client"

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

    this.client = this.adminWebsocketService.getClientBy(this.computerId);

    // Get initial Packet Data
    this.updateInteractive();
    // Update Packet data
    this.adminWebsocketService.packetInfosEvent.subscribe((packetInfo: PacketInfo) => {
      // Check if it concerns us
      if (packetInfo != undefined && packetInfo.Packet.computerid == this.computerId) {
        this.updateInteractive();
      }
    })

    // Also update client info (e.g. last seen)
    this.adminWebsocketService.clientsEvent.subscribe((clientInfo: ClientInfo) => {
      this.client = this.adminWebsocketService.getClientBy(this.computerId);
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

  addPacketTest() {
    var packet: Packet = {
      computerid: this.client.ComputerId, 
      packetid: this.getRandomInt(),
      packetType: 'test',
      arguments: { "test": "test" },
      response: {},
      downstreamId: this.downstream,
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

  addPacketInteractiveCmdOpen(force: boolean) {
    var packet: Packet = {
      computerid: this.client.ComputerId, 
      packetid: this.getRandomInt(),
      packetType: 'iOpen',
      arguments: { },
      response: {},
      downstreamId: this.downstream,
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

  addPacketInteractiveCmdIssue() {
    var packet: Packet = {
      computerid: this.client.ComputerId, 
      packetid: this.getRandomInt(),
      packetType: 'iIssue',
      arguments: { 'commandline': this.commandlineInteractive },
      response: {},
      downstreamId: this.downstream,
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

  addPacketExecLine() {
    var split = this.commandline.split(" ")
    var executable: string = split[0];
    var paramsArr = split.slice(1);

    var params:{ [id: string]: string } = {};
    params["executable"] = executable;
    for(var n=0; n<paramsArr.length; n++) {
      params["param" + n] = paramsArr[n];
    }
    console.log(params);

    var packet: Packet = {
      computerid: this.client.ComputerId, 
      packetid: this.getRandomInt(),
      packetType: 'exec',
      arguments: params,
      response: {},
      downstreamId: this.downstream,
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

  addPacketExecArgs() {
    var packet: Packet = {
      computerid: this.client.ComputerId, 
      packetid: this.getRandomInt(),
      packetType: 'exec',
      arguments: { 
        "executable": this.executable,
      },
      response: {},
      downstreamId: this.downstream,
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
        console.log("SendPacket successful")
      },
      (err: HttpErrorResponse) => {
        console.log("SendPacket failed")
      },
    );
  }

  addPacketUpload() {
    var packetId = this.getRandomInt();
    var packet: Packet = {
      computerid: this.client.ComputerId, 
      packetid: packetId,
      packetType: 'fileupload',
      arguments: { 
        "remoteurl": this.uploadUrlBase + packetId,
        "source": this.uploadSource
      },
      response: {},
      downstreamId: this.downstream,
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

  addPacketDownload() {
    var packet: Packet = {
      computerid: this.client.ComputerId, 
      packetid: this.getRandomInt(),
      packetType: 'filedownload',
      arguments: { 
        "remoteurl": this.downloadUrlBase + this.downloadUrlFile,
        "destination": this.downloadDestination
      },
      response: {},
      downstreamId: this.downstream,
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

  getClientRelativeLastSeen(): string {
    return this.adminWebsocketService.getClientRelativeLastSeen(this.client);
  }
}
