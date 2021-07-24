import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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
  displayedColumns: string[] = [
    'command', 'arguments', 'response'];

  constructor(
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

    // Get and update data
    this.adminWebsocketService.srvCmdsEvent.subscribe((data2: SrvCmdBase[]) => {
      var newData = data2.filter(d => d.Command.computerid == this.commandCreateArgs.computerId ||d.Command.computerid == "0");
      this.dataSource.data = newData;

      // Also update client info (e.g. last seen)
      this.client = this.adminWebsocketService.getClientBy(this.commandCreateArgs.computerId);
    })
  }

}
