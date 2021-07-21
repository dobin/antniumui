import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Command, SrvCmdBase } from '../app.model';
import { ApiService } from '../api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { AdminWebsocketService } from '../admin-websocket.service';

export interface CommandCreateArgs {
  computerId: string,
}

@Component({
  selector: 'app-command-create-modal',
  templateUrl: './command-create-modal.component.html',
  styleUrls: ['./command-create-modal.component.css']
})
export class CommandCreateModalComponent implements OnInit {
  serverurl: string = "http://127.0.0.1:4444"
  executable: string = ""
  param1: string = ""
  param2: string = ""
  param3: string = ""
  uploadUrl: string = ""
  uploadSource: string = ""
  downloadUrl: string = ""
  downloadDestination: string = ""

  dataSource: MatTableDataSource<SrvCmdBase> = new MatTableDataSource<SrvCmdBase>();
  displayedColumns: string[] = [
    'command', 'arguments', 'response'];

  interval: any

  constructor(
    private apiService: ApiService,
    private adminWebsocketService: AdminWebsocketService,
    @Inject(MAT_DIALOG_DATA) public data: CommandCreateArgs
  ) { }

  openFileTab(url: string){
    let basename = url.substring(url.lastIndexOf('/')+1);
    let url2 = this.apiService.getAdminUpload(basename);
    window.open(url2, "_blank");
  }
  
  getRandomInt(): string {
    return Math.floor(Math.random() * 1000000).toString();
  }

  ngAfterViewInit() {
    // Get and update data
    this.dataSource.data = this.adminWebsocketService.getSrvCmds();
    this.adminWebsocketService.srvCmdsEvent.subscribe(data => {
      this.dataSource.data = this.adminWebsocketService.getSrvCmds();
    })
  }

  ngOnInit(): void {
    if (true) {
      this.executable = "cmd";
      this.param1 = "/C"
      this.param2 = "whoami"

      this.uploadUrl = this.serverurl + "/upload/"
      this.uploadSource = "README.md";

      this.downloadUrl = this.serverurl + "/static/test.txt";
      this.downloadDestination = "test.txt";
    }
  }

  addCommandTest() {
    var command: Command = {
      computerid: '0', 
      packetid: this.getRandomInt(),
      command: 'test',
      arguments: { "test": "test" },
      response: {},
    }

    this.apiService.sendCommand(command).subscribe(
      (data: any) => { 
        console.log("SendCommand successful")
      },
      (err: HttpErrorResponse) => {
        console.log("SendCommand failed")
      },
    );
  }

  addCommandExec() {
    var command: Command = {
      computerid: '0', 
      packetid: this.getRandomInt(),
      command: 'exec',
      arguments: { 
        "executable": this.executable,
      },
      response: {},
    }

    if (this.param1 != "") {
      command.arguments["param1"] = this.param1;
    }
    if (this.param2 != "") {
      command.arguments["param2"] = this.param2;
    }
    if (this.param3 != "") {
      command.arguments["param3"] = this.param3;
    }

    this.apiService.sendCommand(command).subscribe(
      (data: any) => { 
        console.log("SendCommand successful")
      },
      (err: HttpErrorResponse) => {
        console.log("SendCommand failed")
      },
    );
  }

  addCommandUpload() {
    var packetId = this.getRandomInt();
    var command: Command = {
      computerid: '0', 
      packetid: packetId,
      command: 'fileupload',
      arguments: { 
        "remoteurl": this.uploadUrl + packetId,
        "source": this.uploadSource
      },
      response: {},
    }
    this.apiService.sendCommand(command).subscribe(
      (data: any) => { 
        console.log("SendCommand successful")
      },
      (err: HttpErrorResponse) => {
        console.log("SendCommand failed")
      },
    );
  }

  addCommandDownload() {
    var command: Command = {
      computerid: '0', 
      packetid: this.getRandomInt(),
      command: 'filedownload',
      arguments: { 
        "remoteurl": this.downloadUrl,
        "destination": this.downloadDestination
      },
      response: {},
    }

    this.apiService.sendCommand(command).subscribe(
      (data: any) => { 
        console.log("SendCommand successful")
      },
      (err: HttpErrorResponse) => {
        console.log("SendCommand failed")
      },
    );
  }
}
