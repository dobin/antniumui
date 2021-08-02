import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { AdminWebsocketService } from '../admin-websocket.service';
import { PacketInfo, Packet, ClientInfo, Campaign, DownstreamInfo } from '../app.model';

@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.css']
})
export class ClientInfoComponent implements OnInit {
  @Input() computerId = "";

  client: ClientInfo = {} as ClientInfo// fake clientinfo so page-reload works
  downstreamList: DownstreamInfo[] = [];

  displayedColumns: string[] = [ 'Name', 'Info' ]
  dataSource = [];
  clickedRow: any;

  constructor(
    private adminWebsocketService: AdminWebsocketService,
  ) { }

  ngOnInit(): void {
    // On page reload, it may not be immediately available
    var client = this.adminWebsocketService.getClientBy(this.computerId);
    if (client != undefined) {
      this.client = client;
    }
    // Also update client info (e.g. last seen)
    this.adminWebsocketService.clientsEvent.subscribe((clientInfo: ClientInfo) => {
      this.client = this.adminWebsocketService.getClientBy(this.computerId);
    });

    this.downstreamList = this.adminWebsocketService.getDownstreamListFor(this.computerId); // useless, as often empty
    if (this.downstreamList != undefined) {
      this.clickedRow = this.downstreamList[0]; 
    }

    this.adminWebsocketService.downstreamsEvent.subscribe((data: any) => {
      var downstreamList = this.adminWebsocketService.getDownstreamListFor(this.computerId);

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

  }

  rowClicked(downstreamInfo: DownstreamInfo) {
    this.clickedRow = downstreamInfo;
    this.adminWebsocketService.downstreamSelection.next(downstreamInfo.Name);
  }

  getClientRelativeLastSeen(): string {
    return this.adminWebsocketService.getClientRelativeLastSeen(this.client);
  }
}
