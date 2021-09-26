import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { first, take, skipWhile } from 'rxjs/operators';

import { PacketInfo, Packet, Campaign, DirEntry, ClientInfo } from '../app.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { MatTableDataSource } from '@angular/material/table';
//import 'rxjs/add/operator/first';

@Component({
  selector: 'app-cmd-browse',
  templateUrl: './cmd-browse.component.html',
  styleUrls: ['./cmd-browse.component.css']
})
export class CmdBrowseComponent implements OnInit {
  // Input
  @Input() computerId = "";
  downstreamId: string = "client";
  dirContent: DirEntry[] = [];

  // UI
  browse: string = "";
  client: ClientInfo = {} as ClientInfo;
  clientArch: string = "";
  clientSep: string = '/';

  dataSource: MatTableDataSource<DirEntry> = new MatTableDataSource<DirEntry>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: String[] = [
    'isDir', 'name',  'size', 'modified', ];
  pageSizeOptions: Number[] = [3, 5, 10];


  constructor(
    private apiService: ApiService,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    // Only consume one valid, to have the truth
    // Skip empty array, and take 1
    this.dataService.clients.pipe(skipWhile(v => v.length == 0), take(1)).subscribe((clientInfos: ClientInfo[]) => {
      var client = clientInfos.find(ci => ci.ComputerId == this.computerId);
      if (client != undefined) {
        this.client = client;
        this.browse = this.client.WorkingDir;
        this.clientArch = this.client.Arch;

        if (this.clientArch == 'windows') {
          this.clientSep = '\\';
        } // linux darwin is default
      }
    });

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

    // Add seperator if necessary
    if (this.browse.slice(-1) != this.clientSep) {
      this.browse += this.clientSep;
    }
    
    this.sendPacketDir(this.browse + dirEntry.name);
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


  browseDir() {
    this.sendPacketDir(this.browse);
  }

  browseUp() {
    // Add seperator if necessary
    if (this.browse.slice(-1) != this.clientSep) {
      this.browse += this.clientSep;
    }

    // string.search() can't handle slashes and/or backspaces
    // Count number of characters this way...
    if ((this.browse.split(this.clientSep).length - 1) < 2 ) {
      return;
    }

    var parentPath = this.browse.substring(0, this.browse.lastIndexOf(this.clientSep, this.browse.lastIndexOf(this.clientSep)-1)+1);
    this.browse = parentPath;
    this.browseDir();
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
