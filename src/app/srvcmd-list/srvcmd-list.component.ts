import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SrvCmdBase } from '../app.model';

@Component({
  selector: 'app-srvcmd-list',
  templateUrl: './srvcmd-list.component.html',
  styleUrls: ['./srvcmd-list.component.css']
})
export class SrvcmdListComponent implements OnInit {
  @Input() srvCmds: SrvCmdBase[]; // Data this component receives


  displayedColumns: string[] = [
    'actions', 'computer_id', 'packet_id', 'arguments', 'response', 'state', 'source'];

  // Table shit
  dataSource: MatTableDataSource<SrvCmdBase> = new MatTableDataSource<SrvCmdBase>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void { // called when we have data via @Input
    console.log("CHANGES!");
    console.log(this.srvCmds);
    if (this.srvCmds == null) {
      return;
    }
    /*
    this.srvCmds = [
    ]
    */

    this.dataSource.data = this.srvCmds;
  }

  ngAfterViewInit() {
    // Connect the table components
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
