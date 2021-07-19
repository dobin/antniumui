import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Command } from '../app.model';
import { ApiService } from '../api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-command-create-modal',
  templateUrl: './command-create-modal.component.html',
  styleUrls: ['./command-create-modal.component.css']
})
export class CommandCreateModalComponent implements OnInit {
  executable: string = ""
  param1: string = ""
  param2: string = ""
  param3: string = ""
  uploadUrl: string = ""
  uploadSource: string = ""
  downloadUrl: string = ""
  downloadDestination: string = ""

  constructor(
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public computerId: string
  ) { }

  ngOnInit(): void {
  }

  addCommandTest() {
    var command: Command = {
      computerid: '0', 
      packetid: Math.random().toString(),
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
      packetid: Math.random().toString(),
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
    var packetId = Math.random().toString();
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
      packetid: Math.random().toString(),
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
