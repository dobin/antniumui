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

  // UI
  selectExecType: string = "cmd"
  selectSpawnType: string = "standard"

  commandline: string = "hostname"
  executable: string = "c:\\windows\\system32\\net.exe"
  param1: string = "user"
  param2: string = "dobin"
  param3: string = ""
  destination: string = "C:\\temp\\server.exe"

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
    params["spawnType"] = this.selectSpawnType;
    params["spawnData"] = this.destination;

    var packet = this.apiService.makePacket(
      this.clientId,
      'exec',
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
