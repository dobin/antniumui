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
  // Input
  @Input() computerId = "";
  downstreamId: string = "client"
  staticFiles: DirEntry[] = []

  // UI
  downloadUrlBase: string = ""
  downloadDestination: string = ""
  downloadDestinationSelection = ""
  serverurl: string = ""

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
    var args = { 
      "remoteurl": this.downloadUrlBase + this.downloadDestinationSelection,
      "destination": this.downloadDestination
    };
    var packet = this.apiService.makePacket(
      this.computerId,
      'filedownload',
      args,
      this.downstreamId
    );
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
