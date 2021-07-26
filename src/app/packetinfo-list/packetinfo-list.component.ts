import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from "@angular/material/dialog";
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { AdminWebsocketService } from '../admin-websocket.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-packetinfo-list',
  templateUrl: './packetinfo-list.component.html',
  styleUrls: ['./packetinfo-list.component.css']
})
export class PacketInfoListComponent implements OnInit {
  constructor(    
    private dialog: MatDialog,
		private apiService: ApiService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }
}
