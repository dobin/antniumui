import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { AdminWebsocketService } from '../admin-websocket.service';
import { PacketInfo, Packet, ClientInfo, Campaign } from '../app.model';

@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.css']
})
export class ClientInfoComponent implements OnInit {
  @Input() computerId = "";
  client: ClientInfo = {} as ClientInfo// fake clientinfo so page-reload works

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
  }

  getClientRelativeLastSeen(): string {
    return this.adminWebsocketService.getClientRelativeLastSeen(this.client);
  }
}
