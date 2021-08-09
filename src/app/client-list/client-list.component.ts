import { Component, OnInit, Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from "@angular/material/dialog";
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';

import { ClientInfo } from '../app.model';
import { PacketCreateModalComponent } from '../packet-create-modal/packet-create-modal.component';
import { ClientViewModalComponent } from '../client-view-modal/client-view-modal.component';
import { AdminWebsocketService } from '../admin-websocket.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  @Input() short = false;

  displayedColumns: string[] = [];


  // Table shit
  dataSource: MatTableDataSource<ClientInfo> = new MatTableDataSource<ClientInfo>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    if (this.short) {
      this.displayedColumns = [ 'actions', 'FirstSeen', 'ComputerId'];
    } else {
      this.displayedColumns = [ 'actions', 'ComputerId',  'Hostname', 'FirstSeen', 'LastSeen', 'LastIp','LocalIps' ];
    }

    // FIX: JS Warning Race Condition
    timer(0)
    .pipe(take(1))
    .subscribe(() => {
      this.sort.sort({ id: 'FirstSeen', start: 'desc', disableClear: true });
    });

    // Get and update data
    this.dataSource.data = this.dataService.clients;
    this.dataService.clientsEvent.subscribe(data => {
      this.dataSource.data = this.dataService.clients;
    })
  }

  ngAfterViewInit() {
    // Connect the table components
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  showModalPacketCreate(computerId: string) {
    const dialogRef = this.dialog.open(PacketCreateModalComponent, {
      width: '80em',
      data: computerId,
    });
  }

  showModalClientInfo(client: ClientInfo) {
    const dialogRef = this.dialog.open(ClientViewModalComponent, {
      width: '80em',
      data: client,
    });
  }

  getClientRelativeLastSeen(clientInfo: ClientInfo) {
    return this.dataService.getClientRelativeLastSeen(clientInfo);
  }

  // Table filter
  applyFilter(event: any) {
    var filterValue: string = event.target.value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
