import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-config-modal',
  templateUrl: './config-modal.component.html',
  styleUrls: ['./config-modal.component.css']
})
export class ConfigModalComponent implements OnInit {

  adminApiKey = "";

  constructor(
    private configService: ConfigService,
  ) { }

  ngOnInit(): void {
    this.adminApiKey = this.configService.getAdminApiKey();
  }

  setAdminApiKey() {
    this.configService.setAdminApiKey(this.adminApiKey)
    //this.reconnect();
  }

  reconnect() {
  //  this.adminWebService.connect();
  //  this.configService.connect();
  }

}
