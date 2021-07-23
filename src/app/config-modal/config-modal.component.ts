import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
import { AdminWebsocketService } from '../admin-websocket.service';

@Component({
  selector: 'app-config-modal',
  templateUrl: './config-modal.component.html',
  styleUrls: ['./config-modal.component.css']
})
export class ConfigModalComponent implements OnInit {

  adminApiKey = "";
  serverIp = "";
  websocketStatus = "";
  restStatus = "";

  constructor(
    private configService: ConfigService,
    private adminWesocketService: AdminWebsocketService,
  ) { }

  ngOnInit(): void {
    this.adminApiKey = this.configService.getAdminApiKey();
    this.serverIp = this.configService.getServerIp();
    this.websocketStatus = this.adminWesocketService.websocketStatus;
    this.restStatus = this.adminWesocketService.restStatus;
  }

  setAdminApiKey() {
    this.configService.setAdminApiKey(this.adminApiKey)
    //this.reconnect();
  }

  setServerIp() {
    this.configService.setServerIp(this.serverIp);
  }

  reconnect() {
  //  this.adminWebService.connect();
  //  this.configService.connect();
  }

}
