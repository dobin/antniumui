import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from "@angular/material/dialog";
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Command, SrvCmdBase, ClientBase, Campaign } from '../app.model';
import { ApiService } from '../api.service';
import {AfterViewInit, ViewChild} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { AdminWebsocketService } from '../admin-websocket.service';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfigService } from '../config.service';


export interface CommandCreateArgs {
  computerId: string,
}


@Component({
  selector: 'app-command-table',
  templateUrl: './command-table.component.html',
  styleUrls: ['./command-table.component.css']
})
export class CommandTableComponent implements OnInit {
  @Input() computerId = '';

  dataSource: MatTableDataSource<SrvCmdBase> = new MatTableDataSource<SrvCmdBase>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  client: ClientBase
  displayedColumns: string[] = [];
  pageSizeOptions: number[] = [5];


  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private adminWebsocketService: AdminWebsocketService,
    private configService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public commandCreateArgs: CommandCreateArgs
  ) { }
  openFileTab(url: string){
    let basename = url.substring(url.lastIndexOf('/')+1);
    let url2 = this.apiService.getAdminUpload(basename);
    window.open(url2, "_blank");
  }
  ngAfterViewInit() {
    // Connect the table components
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  } 
  ngOnInit(): void {
    if (this.computerId != "") {
      this.displayedColumns = [
        'TimeRecorded', 'command', 'arguments', 'response'];
        this.pageSizeOptions = [3, 5, 10];
    } else {
      this.displayedColumns = [
        //'actions', 'TimeRecorded', 'ClientIp', 'command', 'arguments', 'response', 'State'];
        'TimeRecorded', 'command', 'arguments', 'response'];
      this.pageSizeOptions = [6, 12, 24, 48];
    }
    

    this.client = this.adminWebsocketService.getClientBy(this.commandCreateArgs.computerId);

    // FIX: JS Warning Race Condition
    timer(0)
    .pipe(take(1))
    .subscribe(() => {
      this.sort.sort({ id: 'TimeRecorded', start: 'desc', disableClear: true });
    });

    this.apiService.refreshCommandsClient(this.commandCreateArgs.computerId).subscribe(
      (data2: SrvCmdBase[]) => {
        this.dataSource.data = data2;
      },
      (err: HttpErrorResponse) => {
        console.log("HTTP Error: " + err);
      },
    );

    this.updateSrvCmds();
    // Get and update data
    this.adminWebsocketService.srvCmdsEvent.subscribe((srvCmd: SrvCmdBase) => {
      // Check if it concerns us
      if (srvCmd == undefined || srvCmd.Command.computerid == this.commandCreateArgs.computerId) {
        this.updateSrvCmds();
      }

      // Also update client info (e.g. last seen)
      this.client = this.adminWebsocketService.getClientBy(this.commandCreateArgs.computerId);
    })
  }

  updateSrvCmds() {
    var data2 = this.adminWebsocketService.getSrvCmds();
    var newData = data2.filter(d => d.Command.computerid == this.commandCreateArgs.computerId ||d.Command.computerid == "0");
    this.dataSource.data = newData;
  }

}
