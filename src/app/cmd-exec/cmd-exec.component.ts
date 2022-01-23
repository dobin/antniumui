import { Component, OnInit, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PacketInfo, Packet, Campaign, DirEntry, ClientInfo } from '../app.model';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { first, take, skipWhile } from 'rxjs/operators';

@Component({
  selector: 'app-cmd-exec',
  templateUrl: './cmd-exec.component.html',
  styleUrls: ['./cmd-exec.component.css']
})
export class CmdExecComponent implements OnInit {
  // Input
  @Input() clientId = "";
  downstreamId: string = "client"

  // UI
  selectExecType: string = "cmd"
  commandline: string = "hostname"
  executable: string = "c:\\windows\\system32\\net.exe"
  param1: string = "user"
  param2: string = "dobin"
  param3: string = ""
  destination: string = "C:\\temp\\server.exe"

  constructor(
    private apiService: ApiService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    // Only consume one valid, to have the truth
    // Skip empty array, and take 1
    this.dataService.clients.pipe(skipWhile(v => v.length == 0), take(1)).subscribe((clientInfos: ClientInfo[]) => {
      var client = clientInfos.find(ci => ci.ClientId == this.clientId);
      if (client != undefined) {
        var arch = client.Arch;
        if (arch == "darwin") {
          this.selectExecType = "zsh";
        } else if (arch == "linux") {
          this.selectExecType = "bash";
        }
      }
    });

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
    } else if (this.selectExecType == "rawCopyFirst") {
      params["executable"] = this.executable;
      params["destination"] = this.destination;
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
      this.clientId,
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
