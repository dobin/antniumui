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

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  displayedColumns: string[] = [
    'actions', 'FirstSeen', 'ComputerID' ];

  // Table shit
  dataSource: MatTableDataSource<ClientInfo> = new MatTableDataSource<ClientInfo>();
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private adminWebsocketService: AdminWebsocketService,
  ) { }

  ngOnInit(): void {
    // FIX: JS Warning Race Condition
    timer(0)
    .pipe(take(1))
    .subscribe(() => {
      this.sort.sort({ id: 'FirstSeen', start: 'desc', disableClear: true });
    });

    // Get and update data
    this.dataSource.data = this.adminWebsocketService.getClients();
    this.adminWebsocketService.clientsEvent.subscribe(data => {
      this.dataSource.data = this.adminWebsocketService.getClients();
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
    return this.adminWebsocketService.getClientRelativeLastSeen(clientInfo);
  }
}
