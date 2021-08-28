import { Component, OnInit, Input } from '@angular/core';
import { PacketInfo, Packet, Campaign, DirEntry } from '../app.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cmd-download',
  templateUrl: './cmd-download.component.html',
  styleUrls: ['./cmd-download.component.css']
})
export class CmdDownloadComponent implements OnInit {
  // Data
  @Input() computerId = "";

  downloadUrlBase: string = ""
  downloadDestination: string = ""
  downloadDestinationSelection = ""
  serverurl: string = ""

  staticFiles: DirEntry[] = []


  downstreamId: string = "client"

  constructor(
    private apiService: ApiService,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    if (true) {
      this.apiService.getCampaign().subscribe(
        (campaign: Campaign) => { 
          this.serverurl = campaign.ServerUrl;
    
          this.downloadUrlBase = campaign.ServerUrl + campaign.FileDownloadPath;
          this.downloadDestination = "test.txt";
        },
        (err: HttpErrorResponse) => {
          console.log("HTTP Error: " + err);
        },
      );
    }

    // Files
    this.staticFiles = this.dataService.statics;
    // Subscribe to updates 
    this.dataService.clientFilesUpdates.subscribe((data: String) => {
      this.staticFiles = this.dataService.statics;
    })
    
    // Downstream-Selection
    this.dataService.downstreamSelection.subscribe(downstreamId => {
      this.downstreamId = downstreamId;
    });
  }

  
  sendPacketDownload() {
    var packet: Packet = {
      computerid: this.computerId, 
      packetid: this.apiService.getRandomInt(),
      packetType: 'filedownload',
      arguments: { 
        "remoteurl": this.downloadUrlBase + this.downloadDestinationSelection,
        "destination": this.downloadDestination
      },
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
}
