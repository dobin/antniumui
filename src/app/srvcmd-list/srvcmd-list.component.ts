import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from "@angular/material/dialog";
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { SrvCmdBase, Campaign } from '../app.model';
import { ApiService } from '../api.service';
import { AdminWebsocketService } from '../admin-websocket.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-srvcmd-list',
  templateUrl: './srvcmd-list.component.html',
  styleUrls: ['./srvcmd-list.component.css']
})
export class SrvcmdListComponent implements OnInit {
  constructor(    
    private dialog: MatDialog,
		private apiService: ApiService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }
}
