import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from "@angular/material/dialog";
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { CommandCreateModalComponent, CommandCreateArgs} from '../command-create-modal/command-create-modal.component';
import { SrvCmdBase, Campaign } from '../app.model';
import { ApiService } from '../api.service';
import { AdminWebsocketService } from '../admin-websocket.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-srvcmd-list',
  templateUrl: './srvcmd-list.component.html',
  styleUrls: ['./srvcmd-list.component.css']
})
export class SrvcmdListComponent implements OnInit {
  displayedColumns: string[] = [
    'actions', 'TimeRecorded', 'ClientIp', 'command', 'arguments', 'response', 'State'];

  // Table shit
  dataSource: MatTableDataSource<SrvCmdBase> = new MatTableDataSource<SrvCmdBase>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
    
  constructor(    
    private dialog: MatDialog,
		private apiService: ApiService,
    private adminWebsocketService: AdminWebsocketService,
  ) { }

  ngOnInit(): void {
    // FIX: JS Warning Race Condition
    timer(0)
    .pipe(take(1))
    .subscribe(() => {
      this.sort.sort({ id: 'TimeRecorded', start: 'desc', disableClear: true });
    });
  }

  ngAfterViewInit() {
    // Connect the table components
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Get and update data
    this.dataSource.data = this.adminWebsocketService.getSrvCmds();
    this.adminWebsocketService.srvCmdsEvent.subscribe(data => {
      this.dataSource.data = this.adminWebsocketService.getSrvCmds();
    })
  }

  showModalCommandCreate(computerId: string) {
    var data: CommandCreateArgs = {
      computerId: computerId,
    }

    const dialogRef = this.dialog.open(CommandCreateModalComponent, {
      width: '80em',
      height: '42em',
      data: data,
    });
  }

  openFileTab(url: string){
    let basename = url.substring(url.lastIndexOf('/')+1);
    let url2 = this.apiService.getAdminUpload(basename);
    window.open(url2, "_blank");
  }

}
