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
  argline: string = "user"
  selectSpawnType: string = "standard"
  destinationHollow: string = "c:\\windows\\system32\\clipup.exe"
  destinationCopyFirst: string = "C:\\temp\\notavirus.exe"

  // remote
  remote_file: string = "Seatbelt.exe"
  remote_files: DirEntry[] = [];
  remote_argline: string = "DotNet"
  remote_injectInto: string = "c:\\windows\\notepad.exe"

  constructor(
    private apiService: ApiService,
    private dataService: DataService,
    private configService: ConfigService,
  ) { }

  destinationHollowFormControl = new FormControl();
  destinationHollowOptions: string[] = [];
  destinationHollowFilteredOptions: Observable<string[]>;

  destinationCopyFirstFormControl = new FormControl();
  destinationCopyFirstOptions: string[] = [];
  destinationCopyFirstFilteredOptions: Observable<string[]>;

  private _filterHollow(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.destinationHollowOptions.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filterCopyFirst(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.destinationHollowOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  displayFn(s: string): string {
    return s;
  }

  ngOnInit(): void {
    this.destinationHollowOptions = this.configService.getHollowData();
    this.destinationHollowFilteredOptions = this.destinationHollowFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterHollow(value)),
    );
    this.destinationCopyFirstOptions = this.configService.getCopyFirstData();
    this.destinationCopyFirstFilteredOptions = this.destinationCopyFirstFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCopyFirst(value)),
    );

    // Remote files
    this.remote_files = this.dataService.statics;
    this.dataService.clientFilesUpdates.subscribe((data: string) => {
      this.remote_files = this.dataService.statics;
    })

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

      if (this.selectSpawnType == "hollow") {
        params["spawnType"] = this.selectSpawnType;
        params["spawnData"] = this.destinationHollow;
      }
      if (this.selectSpawnType == "copyFirst") {
        params["spawnType"] = this.selectSpawnType;
        params["spawnData"] = this.destinationCopyFirst;
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

    if (! this.destinationHollowOptions.includes(this.destinationHollow)) {
      this.destinationHollowOptions.push(this.destinationHollow);
    }
    if (! this.destinationCopyFirstOptions.includes(this.destinationCopyFirst)) {
      this.destinationCopyFirstOptions.push(this.destinationCopyFirst);
    }
    //this.configService.setSpawnData(this.destinationOptions);
  }


}
