import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { AdminWebsocketService } from '../admin-websocket.service';
import { PacketInfo, Packet, ClientInfo, Campaign, DownstreamInfo, DirEntry } from '../app.model';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.css']
})
export class ClientInfoComponent implements OnInit {
  @Input() computerId = "";

  client: ClientInfo = {} as ClientInfo// fake clientinfo so page-reload works
  downstreamList: DownstreamInfo[] = [];
  uploadList: DirEntry[] = [];
  staticList: DirEntry[] = [];


  displayedColumns: string[] = [ 'Name', 'Info' ];
  dataSource = [];
  clickedRow: any;

  constructor(
    private apiService: ApiService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    // On page reload, it may not be immediately available
    var client = this.dataService.getClientBy(this.computerId);
    if (client != undefined) {
      this.client = client;
    }
    // Also update client info (e.g. last seen)
    this.dataService.clientsEvent.subscribe((clientInfo: ClientInfo) => {
      this.client = this.dataService.getClientBy(this.computerId);
    });

    this.downstreamList = this.dataService.getDownstreamListFor(this.computerId); // useless, as often empty
    if (this.downstreamList != undefined) {
      this.clickedRow = this.downstreamList[0]; 
    }

    this.dataService.downstreamsEvent.subscribe((data: any) => {
      var downstreamList = this.dataService.getDownstreamListFor(this.computerId);

      if (this.downstreamList == undefined) {
        // Select first element upon initializing
        // there should be always at least one element (default)
        this.downstreamList = downstreamList;
        this.clickedRow = this.downstreamList[0]; 
      } else {
        // as we set a new list, get array element at idx from new array for row selection
        var idx = this.downstreamList.indexOf(this.clickedRow);
        this.downstreamList = downstreamList;
        this.clickedRow = this.downstreamList[idx];
      }
    });

    // Subscribe to clientfileupdates
    this.dataService.clientFilesUpdates.subscribe(nothing => {
      this.staticList = this.dataService.statics;
      var uploadList = this.dataService.uploads;
      this.uploadList = uploadList.filter(f => f.name.startsWith(this.computerId))
    });
  }

  rowClicked(downstreamInfo: DownstreamInfo) {
    this.clickedRow = downstreamInfo;
    this.dataService.downstreamSelection.next(downstreamInfo.Name);
  }

  getClientRelativeLastSeen(): string {
    return this.dataService.getClientRelativeLastSeen(this.client);
  }

  downloadStatic(filename: string) {
    var url = this.dataService.makeStaticLink(filename);
    //this.apiService.downloadClientUpload(url);
    window.open(url, "_blank") // Its public anyway
  }

  downloadUpload(filename: string) {
    var url = this.dataService.makeUploadLink(filename);
    // Not public, need authenticated http client
    this.apiService.downloadClientUpload(url);
  }

}
