import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ClientBase } from '../app.model';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  @Input() clients: ClientBase[]; // Data this component receives

  displayedColumns: string[] = [
    'actions', ];

  // Table shit
  dataSource: MatTableDataSource<ClientBase> = new MatTableDataSource<ClientBase>();

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void { // called when we have data via @Input
    console.log(this.clients);
    if (this.clients == null) {
      return;
    }
    this.dataSource.data = this.clients;
  }

}
