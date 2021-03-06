import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
import { AdminWebsocketService } from '../admin-websocket.service';
import { ApiService } from '../api.service';
import { PacketInfo, Packet, ClientInfo, Campaign, DownstreamInfo, DirEntry, PacketState } from '../app.model';
import { HttpErrorResponse } from '@angular/common/http';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-config-modal',
  templateUrl: './config-modal.component.html',
  styleUrls: ['./config-modal.component.css']
})
export class ConfigModalComponent implements OnInit {
  connectionTestResult= "";

  adminApiKey = "";
  serverIp = "";
  user = "";

  constructor(
    private configService: ConfigService,
    private adminWebsocketService: AdminWebsocketService,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<ConfigModalComponent>,
  ) { }

  ngOnInit(): void {
    this.adminApiKey = this.configService.getAdminApiKey();
    this.serverIp = this.configService.getServerIp();
    this.user = this.configService.getUser();
  }

  actionApply() {
    this.connectionTestResult = "";
    this.save();

    // Grab campaign as test
    this.apiService.getCampaign().subscribe(
      (campaign: Campaign) => { 
        this.connectionTestResult = "connected";
        this.adminWebsocketService.connectWs();
        this.configService.setIsVirgin(false);
      },
      (err: HttpErrorResponse) => {
        this.connectionTestResult = "HTTP Error: " + err.message;
        console.log(err);
      },
    );
  }

  actionClose() {
    this.dialogRef.close();
  }

  save() {
    this.configService.setAdminApiKey(this.adminApiKey)
    this.configService.setServerIp(this.serverIp);
    this.configService.setUser(this.user);
  }

}
