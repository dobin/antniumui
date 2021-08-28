import { Component, OnInit, Input } from '@angular/core';
import { PacketInfo, Packet, Campaign, DirEntry } from '../app.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-cmd-browse',
  templateUrl: './cmd-browse.component.html',
  styleUrls: ['./cmd-browse.component.css']
})
export class CmdBrowseComponent implements OnInit {
  // Input
  @Input() computerId = "";
  downstreamId: string = "client"
  dirContent: DirEntry[] = [];

  // UI
  browse: string = "./"

  constructor(
    private apiService: ApiService,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.updateDir();
    this.dataService.packetInfosEvent.subscribe((packetInfo: PacketInfo) => {
      // Check if it concerns us
      if (packetInfo == undefined || packetInfo.Packet.computerid == this.computerId) {
        this.updateDir();
      }
    })

    // Downstream-Selection
    this.dataService.downstreamSelection.subscribe(downstreamId => {
      this.downstreamId = downstreamId;
    });
  }

  
  updateDir() {
    var data2 = this.dataService.packetInfos;
    var newData = data2.filter(d => 
      (d.Packet.computerid == this.computerId && d.Packet.packetType == "dir")
    );

    if (newData.length == 0) {
      return;
    }
    var latestPacket = newData[newData.length - 1].Packet
    if (! ("filelist" in latestPacket.response)) {
      return;
    }

    var json = latestPacket.response["filelist"];
    var data: DirEntry[] = JSON.parse(json); 
    this.dirContent = data;
  }



  sendPacketDir() {
    var packetId = this.apiService.getRandomInt();
    var packet: Packet = {
      computerid: this.computerId, 
      packetid: packetId,
      packetType: 'dir',
      arguments: { 
        "path": this.browse,
      },
      response: {},
      downstreamId: this.downstreamId,
    }
    this.apiService.sendPacket(packet).subscribe(
      (data: any) => { 
        console.log("SendPacket successful")

        // Subscribe to new packets until ours is found

      },
      (err: HttpErrorResponse) => {
        console.log("SendPacket failed")
      },
    );

  }


}
