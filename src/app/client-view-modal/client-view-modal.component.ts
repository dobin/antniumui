import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PacketInfo, Packet, ClientInfo, Campaign } from '../app.model';
import { MatPaginator } from '@angular/material/paginator';
import {AfterViewInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-client-view-modal',
  templateUrl: './client-view-modal.component.html',
  styleUrls: ['./client-view-modal.component.css']
})
export class ClientViewModalComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: MatTableDataSource<string> = new MatTableDataSource<string>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public clientInfo: ClientInfo
  ) { }

  ngOnInit(): void {
    this.dataSource.data = this.clientInfo.Processes;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  } 
}
