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
  constructor(
    private apiService: ApiService,
  ) { }

  data: any;
  interval: any;

  ngOnInit() {
  }
}
