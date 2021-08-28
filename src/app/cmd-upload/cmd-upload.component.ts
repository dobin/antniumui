import { Component, OnInit, Input } from '@angular/core';
import { PacketInfo, Packet, Campaign, DirEntry } from '../app.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-cmd-upload',
  templateUrl: './cmd-upload.component.html',
  styleUrls: ['./cmd-upload.component.css']
})
export class CmdUploadComponent implements OnInit {
  // Data
  @Input() computerId = "";

  downstreamId: string = "client"

  uploadUrlBase: string = ""
  uploadSource: string = ""

  constructor(
    private apiService: ApiService,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    if (true) {
      this.apiService.getCampaign().subscribe(
        (campaign: Campaign) => { 
          this.uploadUrlBase = campaign.ServerUrl + campaign.FileUploadPath;
          this.uploadSource = "README.md";
        },
        (err: HttpErrorResponse) => {
          console.log("HTTP Error: " + err);
        },
      );

    }

    // Downstream-Selection
    this.dataService.downstreamSelection.subscribe(downstreamId => {
      this.downstreamId = downstreamId;
    });
  }

  
  sendPacketUpload() {
    var packetId = this.apiService.getRandomInt();
    var packet: Packet = {
      computerid: this.computerId, 
      packetid: packetId,
      packetType: 'fileupload',
      arguments: { 
        "remoteurl": this.uploadUrlBase + packetId,
        "source": this.uploadSource
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
