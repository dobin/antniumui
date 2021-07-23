import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-config-modal',
  templateUrl: './config-modal.component.html',
  styleUrls: ['./config-modal.component.css']
})
export class ConfigModalComponent implements OnInit {

  adminApiKey = "";
  serverIp = "";

  constructor(
    private configService: ConfigService,
  ) { }

  ngOnInit(): void {
    this.adminApiKey = this.configService.getAdminApiKey();
    this.serverIp = this.configService.getServerIp();
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
