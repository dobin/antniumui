import { Component, OnInit, Input } from '@angular/core';
import { PacketInfo, Packet, Campaign, DirEntry, ClientInfo } from '../app.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { first, take, skipWhile } from 'rxjs/operators';

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
  @Input() clientId = "";
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
      if (packetInfo == undefined || packetInfo.Packet.clientid == this.clientId) {
        this.updateInteractive();
      }
    })

    // Only consume one valid, to have the truth
    // Skip empty array, and take 1
    this.dataService.clients.pipe(skipWhile(v => v.length == 0), take(1)).subscribe((clientInfos: ClientInfo[]) => {
      var client = clientInfos.find(ci => ci.ClientId == this.clientId);
      if (client != undefined) {
        var arch = client.Arch;
        if (arch == "darwin") {
          this.selectedShell = this.shellDescriptions[3];
        } else if (arch == "linux") {
          this.selectedShell = this.shellDescriptions[2];
        }
      }
    });

    // Downstream-Selection
    this.dataService.downstreamSelection.subscribe(downstreamId => {
      this.downstreamId = downstreamId;
      this.updateInteractive(); // Update the downstream immediately
    });
  }

  updateInteractive() {
    var data2 = this.dataService.packetInfos;
    var newData = data2.filter(d => 
      (d.Packet.clientid == this.clientId || d.Packet.clientid == "0") 
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
      this.clientId,
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
      this.clientId,
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
      this.clientId,
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
