import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Command, SrvCmdBase, ClientBase, Campaign } from '../app.model';
import { ApiService } from '../api.service';
import {AfterViewInit, ViewChild} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { AdminWebsocketService } from '../admin-websocket.service';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfigService } from '../config.service';
import { CommandTableComponent } from '../command-table/command-table.component';

export interface CommandCreateArgs {
  computerId: string,
}

@Component({
  selector: 'app-command-create-modal',
  templateUrl: './command-create-modal.component.html',
  styleUrls: ['./command-create-modal.component.css']
})
export class CommandCreateModalComponent implements OnInit {
  serverurl: string = ""
  executable: string = ""
  param1: string = ""
  param2: string = ""
  param3: string = ""

  selectedTabIndex: number = 0

  uploadUrlBase: string = ""
  uploadSource: string = ""

  downloadUrlBase: string = ""
  downloadUrlFile: string = ""
  downloadDestination: string = ""
  client: ClientBase
  interactiveStdout: string = ""
  
  commandlineInteractive: string = "hostname"

  commandselect: number = 0
  commandline: string = "cmd /C hostname"

  //dataSource: MatTableDataSource<SrvCmdBase> = new MatTableDataSource<SrvCmdBase>();
  //@ViewChild(MatSort) sort!: MatSort;
  //@ViewChild(MatPaginator) paginator!: MatPaginator;
  //displayedColumns: string[] = [
  //  'command', 'arguments', 'response'];

  interval: any

  constructor(
    private apiService: ApiService,
    private adminWebsocketService: AdminWebsocketService,
    private configService: ConfigService,
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

  //ngAfterViewInit() {
  //  // Connect the table components
  //  this.dataSource.paginator = this.paginator;
  //  this.dataSource.sort = this.sort;
  //}



  ngOnInit(): void {
    // Default values (for testing)
    if (true) {
      this.apiService.getCampaign().subscribe(
        (data: Campaign) => { 
          this.executable = "cmd";
          this.param1 = "/C"
          this.param2 = "whoami"
    
          this.uploadUrlBase = data.ServerUrl + data.CommandFileUploadPath;
          this.uploadSource = "README.md";
    
          this.downloadUrlBase = this.serverurl + data.CommandFileDownloadPath;
          this.downloadUrlFile = "test.txt";
          this.downloadDestination = "test.txt";
        },
        (err: HttpErrorResponse) => {
          console.log("HTTP Error: " + err);
        },
      );
    }

    this.client = this.adminWebsocketService.getClientBy(this.commandCreateArgs.computerId);


    this.apiService.refreshCommandsClient(this.commandCreateArgs.computerId).subscribe(
      (data: SrvCmdBase[]) => { 
        this.updateInteractive(data);
      },
      (err: HttpErrorResponse) => {
        console.log("HTTP Error: " + err);
      },
    );

    // Get and update data
    this.adminWebsocketService.srvCmdsEvent.subscribe((data2: SrvCmdBase[]) => {
      this.updateInteractive(data2);

      // Also update client info (e.g. last seen)
      this.client = this.adminWebsocketService.getClientBy(this.commandCreateArgs.computerId);
    })
  }

  updateInteractive(data2: SrvCmdBase[]) {
    var newData = data2.filter(d => 
      (d.Command.computerid == this.commandCreateArgs.computerId || d.Command.computerid == "0") 
      && (d.Command.command == "iIssue" || d.Command.command == "iOpen"));
    
    this.commandlineInteractive = "";
    this.interactiveStdout = "";
    newData.forEach(element => {
      if (element.Command.response.hasOwnProperty("stdout")) {
        this.interactiveStdout += element.Command.response['stdout'];
      }
      if (element.Command.response.hasOwnProperty("stderr")) {
        this.interactiveStdout += element.Command.response['stderr'];
      }
    });
  }

  addCommandTest() {
    var command: Command = {
      computerid: this.client.ComputerId, 
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



  interactiveCmdOpen() {
    var command: Command = {
      computerid: this.client.ComputerId, 
      packetid: this.getRandomInt(),
      command: 'iOpen',
      arguments: { },
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

  interactiveCmdIssue() {
    var command: Command = {
      computerid: this.client.ComputerId, 
      packetid: this.getRandomInt(),
      command: 'iIssue',
      arguments: { 'commandline': this.commandlineInteractive },
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
      computerid: this.client.ComputerId, 
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
      computerid: this.client.ComputerId, 
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
      computerid: this.client.ComputerId, 
      packetid: packetId,
      command: 'fileupload',
      arguments: { 
        "remoteurl": this.uploadUrlBase + packetId,
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
      computerid: this.client.ComputerId, 
      packetid: this.getRandomInt(),
      command: 'filedownload',
      arguments: { 
        "remoteurl": this.downloadUrlBase + this.downloadUrlFile,
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
