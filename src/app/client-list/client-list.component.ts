import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ClientBase } from '../app.model';
import { MatDialog } from "@angular/material/dialog";
import { CommandCreateModalComponent, CommandCreateArgs } from '../command-create-modal/command-create-modal.component';
import { AdminWebsocketService } from '../admin-websocket.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  displayedColumns: string[] = [
    'actions', 'ComputerID', 'LastSeen'];

  // Table shit
  dataSource: MatTableDataSource<ClientBase> = new MatTableDataSource<ClientBase>();

  constructor(
    private dialog: MatDialog,
    private adminWebsocketService: AdminWebsocketService,
  ) { }

  ngOnInit(): void {
      // Get and update data
      this.dataSource.data = this.adminWebsocketService.getClients();
      this.adminWebsocketService.clientsEvent.subscribe(data => {
        this.dataSource.data = this.adminWebsocketService.getClients();
      })
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
