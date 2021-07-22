import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Command, SrvCmdBase, ClientBase } from '../app.model';
import { ApiService } from '../api.service';
import {AfterViewInit, ViewChild} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { AdminWebsocketService } from '../admin-websocket.service';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

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
  client: ClientBase
  
  commandselect: number = 0
  commandline: string = "cmd /C hostname"

  dataSource: MatTableDataSource<SrvCmdBase> = new MatTableDataSource<SrvCmdBase>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'command', 'arguments', 'response'];

  interval: any

  constructor(
    private apiService: ApiService,
    private adminWebsocketService: AdminWebsocketService,
    @Inject(MAT_DIALOG_DATA) public commandCreateArgs: CommandCreateArgs
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
    // Connect the table components
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    // Default values (for testing)
    if (true) {
      this.executable = "cmd";
      this.param1 = "/C"
      this.param2 = "whoami"

      this.uploadUrl = this.serverurl + "/upload/"
      this.uploadSource = "README.md";

      this.downloadUrl = this.serverurl + "/static/test.txt";
      this.downloadDestination = "test.txt";
    }

    this.client = this.adminWebsocketService.getClientBy(this.commandCreateArgs.computerId);

    // FIX: JS Warning Race Condition
    timer(0)
    .pipe(take(1))
    .subscribe(() => {
      this.sort.sort({ id: 'TimeRecorded', start: 'desc', disableClear: true });
    });

    this.apiService.refreshCommandsClient(this.commandCreateArgs.computerId).subscribe(
      (data2: SrvCmdBase[]) => {
        this.dataSource.data = data2;
      },
      (err: HttpErrorResponse) => {
        console.log("HTTP Error: " + err);
      },
    );

    // Get and update data
    this.adminWebsocketService.srvCmdsEvent.subscribe((data2: SrvCmdBase[]) => {
      var newData = data2.filter(d => d.Command.computerid == this.commandCreateArgs.computerId ||d.Command.computerid == "0");
      this.dataSource.data = newData;
    })
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

  addCommandExecLine() {
    var split = this.commandline.split(" ")
    var executable: string = split[0];
    var paramsArr = split.slice(1);

    var params:{ [id: string]: string } = {};
    params["executable"] = executable
    for(var n=0; n<paramsArr.length; n++) {
      params["param" + n] = paramsArr[n];
    }
    console.log(params);

    var command: Command = {
      computerid: '0', 
      packetid: this.getRandomInt(),
      command: 'exec',
      arguments: params,
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

  addCommandExecArgs() {
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
      command.arguments["param0"] = this.param1;
    }
    if (this.param2 != "") {
      command.arguments["param1"] = this.param2;
    }
    if (this.param3 != "") {
      command.arguments["param2"] = this.param3;
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
