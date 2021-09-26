import { Component, OnInit, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PacketInfo, Packet, Campaign, DirEntry } from '../app.model';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-cmd-exec',
  templateUrl: './cmd-exec.component.html',
  styleUrls: ['./cmd-exec.component.css']
})
export class CmdExecComponent implements OnInit {
  // Input
  @Input() computerId = "";
  downstreamId: string = "client"

  // UI
  selectExecType: string = "cmd"
  commandline: string = "hostname"
  executable: string = ""
  param1: string = ""
  param2: string = ""
  param3: string = ""

  constructor(
    private apiService: ApiService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    if (true) {
      this.executable = "cmd";
      this.param1 = "/C"
      this.param2 = "whoami"
    }

    var client = this.dataService.getClientBy(this.computerId);
    if (client != undefined) {
      var arch = client.Arch;
      if (arch == "darwin") {
        this.selectExecType = "zsh";
      } else if (arch == "linux") {
        this.selectExecType = "bash";
      }
    } else {
      console.log("Arch UNDEFINED");
    }

    // Downstream-Selection
    this.dataService.downstreamSelection.subscribe(downstreamId => {
      this.downstreamId = downstreamId;
    });
  }

  
  sendPacketExec() {
    var params:{ [id: string]: string } = {};
    params["shelltype"] = this.selectExecType;
    if (this.selectExecType == "cmd" || this.selectExecType == "powershell" || this.selectExecType == "bash" || this.selectExecType == "zsh") {
      params["commandline"] = this.commandline;
    } else if (this.selectExecType == "raw") {
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

    var packet = this.apiService.makePacket(
      this.computerId,
      'exec',
      params,
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
