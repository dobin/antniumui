import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpErrorResponse } from '@angular/common/http';

import { SrvCmdBase } from '../app.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  srvCmds: SrvCmdBase[] //

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
  }

  refresh() {
    this.apiService.refresh().subscribe(
      // (data: SrvCmd) => { 
      (data: any) => { 
        this.srvCmds = data;
      },
      (err: HttpErrorResponse) => {
        console.log("HTTP Error");
      },
    );
  }
}
