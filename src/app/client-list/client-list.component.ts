import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ClientInfo } from '../app.model';
import { MatDialog } from "@angular/material/dialog";
import { CommandCreateModalComponent, CommandCreateArgs } from '../command-create-modal/command-create-modal.component';
import { AdminWebsocketService } from '../admin-websocket.service';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  displayedColumns: string[] = [
    'actions', 'LastSeen', 'ComputerID' ];

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
      this.sort.sort({ id: 'LastSeen', start: 'desc', disableClear: true });
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

  showModalCommandCreate(computerId: string) {
    var data: CommandCreateArgs = {
      computerId: computerId,
    }

    const dialogRef = this.dialog.open(CommandCreateModalComponent, {
      width: '80em',
      data: data,
    });
  }
}
