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

  constructor(
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  ngOnInit(): void {
  }

  addCommandTest() {
    var command: Command = {
      computerid: '0', 
      packetid: '1',
      command: 'test',
      response:'',
      arguments: ["test"]
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
