import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpErrorResponse } from '@angular/common/http';

import { SrvCmdBase, ClientBase } from '../app.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  srvCmds: SrvCmdBase[] //
  clients: ClientBase[]

  constructor(
    private apiService: ApiService,
  ) { }

  data: any;
  interval: any;

  ngOnInit() {
    /*this.refreshCommands();
    this.refreshClients();
    if(this.interval){
        clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
        this.refreshCommands();
        this.refreshClients();
    }, 1000);*/
  }

  refreshCommands() {
    this.apiService.refreshCommands().subscribe(
      (data: SrvCmdBase[]) => { 
        this.srvCmds = data;
      },
      (err: HttpErrorResponse) => {
        console.log("HTTP Error");
      },
    );
  }

  refreshClients() {
    this.apiService.refreshClients().subscribe(
      (data: ClientBase[]) => { 
        this.clients = data;
      },
      (err: HttpErrorResponse) => {
        console.log("HTTP Error");
      },
    );
  }
}
