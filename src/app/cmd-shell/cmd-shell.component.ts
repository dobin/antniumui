import { Component, OnInit, Input } from '@angular/core';
import { PacketInfo, Packet, Campaign, DirEntry } from '../app.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';

interface ShellDesc {
  name: string
  executable: string
  args: string[]
}

@Component({
  selector: 'app-cmd-shell',
  templateUrl: './cmd-shell.component.html',
  styleUrls: ['./cmd-shell.component.css']
})
export class CmdShellComponent implements OnInit {
  // Input
  @Input() computerId = "";
  downstreamId: string = "client"
  interactiveStdout: string = ""

  // UI
  commandlineInteractive: string = "hostname"
  shellDescriptions: ShellDesc[] = [
    {
      name: "cmd.exe",
      executable: "cmd.exe",
      args: [ '/a' ],
    },

    {
      name: "powershell",
      executable: "powershell.exe",
      args: [ '-ExecutionPolicy', 'Bypass' ],
    },

    {
      name: "bash",
      executable: "/bin/bash",
      args: [ ],
    },

    {
      name: "zsh",
      executable: "/bin/zsh",
      args: [ ],
    },
  ];
  
  selectedShell = this.shellDescriptions[0];


  constructor(
    private apiService: ApiService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    // Packet data
    this.updateInteractive(); // Init immediately
    // Update Packet data
    this.dataService.packetInfosEvent.subscribe((packetInfo: PacketInfo) => {
      // Check if it concerns us
      if (packetInfo == undefined || packetInfo.Packet.computerid == this.computerId) {
        this.updateInteractive();
      }
    })

    var client = this.dataService.getClientBy(this.computerId);
    if (client != undefined) {
      var arch = client.Arch;
      if (arch == "darwin") {
        this.selectedShell = this.shellDescriptions[3];
      } else if (arch == "linux") {
        this.selectedShell = this.shellDescriptions[2];
      }
    } else {
      console.log("Arch UNDEFINED");
    }
  

    // Downstream-Selection
    this.dataService.downstreamSelection.subscribe(downstreamId => {
      this.downstreamId = downstreamId;
      this.updateInteractive(); // Update the downstream immediately
    });
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
  
  sendPacketInteractiveCmdOpen(force: boolean) {
    var args = { 
      'executable': this.selectedShell.executable,
    };
    var packet = this.apiService.makePacket(
      this.computerId,
      'iOpen',
      args,
      this.downstreamId
    );
    this.dataService.AddArrToArgs(packet, this.selectedShell.args);
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
    var args = { 
      'commandline': this.commandlineInteractive,
    };
    var packet = this.apiService.makePacket(
      this.computerId,
      'iIssue',
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

  sendPacketCmdClose() {
    var args = {};
    var packet = this.apiService.makePacket(
      this.computerId,
      'iClose',
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
