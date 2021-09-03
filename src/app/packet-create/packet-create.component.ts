import { Component, OnInit, Input } from '@angular/core';
import { PacketInfo, Packet, Campaign, DirEntry } from '../app.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-packet-create',
  templateUrl: './packet-create.component.html',
  styleUrls: ['./packet-create.component.css']
})
export class PacketCreateComponent implements OnInit {
  // Data
  @Input() computerId = "";

  // UI
  selectedTabIndex: number = 0
  commandselect: number = 0
  interval: any

  downstreamId: string = "client"

  constructor(
    private apiService: ApiService,
    private dataService: DataService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    // Downstream-Selection
    this.dataService.downstreamSelectionReset();
    this.dataService.downstreamSelection.subscribe(downstreamId => {
      this.downstreamId = downstreamId;
    });
  }

  sendPacketTest() {
    var packet: Packet = {
      computerid: this.computerId, 
      packetid: this.apiService.getRandomInt(),
      packetType: 'test',
      arguments: { "test": "test" },
      response: {},
      downstreamId: this.downstreamId,
    }

    this.apiService.sendPacket(packet).subscribe(
      (data: any) => { 
        console.log("SendPacket successful")
      },
      (err: HttpErrorResponse) => {
        console.log("SendPacket failed")
      },
    );
  }

  sendPacketShutdown() {
    var packet: Packet = {
      computerid: this.computerId, 
      packetid: this.apiService.getRandomInt(),
      packetType: 'shutdown',
      arguments: {},
      response: {},
      downstreamId: this.downstreamId,
    }
    this.apiService.sendPacket(packet).subscribe(
      (data: any) => { 
        console.log("SendPacket successful")
      },
      (err: HttpErrorResponse) => {
        console.log("SendPacket failed")
      },
    );
  }


  // Utils:

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
 

}
