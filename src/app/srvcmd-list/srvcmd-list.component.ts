import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from "@angular/material/dialog";

import { CommandCreateModalComponent, CommandCreateArgs} from '../command-create-modal/command-create-modal.component';
import { SrvCmdBase } from '../app.model';

@Component({
  selector: 'app-srvcmd-list',
  templateUrl: './srvcmd-list.component.html',
  styleUrls: ['./srvcmd-list.component.css']
})
export class SrvcmdListComponent implements OnInit {
  @Input() srvCmds!: SrvCmdBase[]; // Data this component receives

  displayedColumns: string[] = [
    'actions', 'TimeRecorded', 'ClientIp', 'command', 'arguments', 'response', 'State'];

  // Table shit
  dataSource: MatTableDataSource<SrvCmdBase> = new MatTableDataSource<SrvCmdBase>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(    
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void { // called when we have data via @Input
    if (this.srvCmds == null) {
      return;
    }
    this.dataSource.data = this.srvCmds;
  }

  ngAfterViewInit() {
    // Connect the table components
    this.dataSource.paginator = this.paginator;
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

  openFileTab(url: string){
    let basename = url.substring(url.lastIndexOf('/')+1);
    let url2 = "http://127.0.0.1:4444/admin/upload/" + basename;
    console.log(url2);
    window.open(url2, "_blank");
}

}
