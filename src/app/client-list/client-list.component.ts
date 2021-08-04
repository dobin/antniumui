import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from "@angular/material/dialog";
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

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
  displayedColumns: string[] = [
    'actions', 'ComputerId',  'Hostname', 'FirstSeen', 'LastSeen', 'LastIp','LocalIps' ];

  // Table shit
  dataSource: MatTableDataSource<ClientInfo> = new MatTableDataSource<ClientInfo>();
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
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
}
