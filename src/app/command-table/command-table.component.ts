import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from "@angular/material/dialog";
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Packet, PacketInfo, ClientInfo, Campaign } from '../app.model';
import { ApiService } from '../api.service';
import {AfterViewInit, ViewChild} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { AdminWebsocketService } from '../admin-websocket.service';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfigService } from '../config.service';
import { CommandCreateModalComponent, CommandCreateArgs} from '../command-create-modal/command-create-modal.component';


@Component({
  selector: 'app-command-table',
  templateUrl: './command-table.component.html',
  styleUrls: ['./command-table.component.css']
})
export class CommandTableComponent implements OnInit {
  @Input() computerId = '';

  dataSource: MatTableDataSource<PacketInfo> = new MatTableDataSource<PacketInfo>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [];
  pageSizeOptions: number[] = [5];


  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private adminWebsocketService: AdminWebsocketService,
    private configService: ConfigService,
  ) { }

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
        'actions', 'TimeRecorded', 'ClientIp', 'command', 'arguments', 'response', 'State'];
      this.pageSizeOptions = [6, 12, 24, 48];
    }

    // FIX: JS Warning Race Condition
    timer(0)
    .pipe(take(1))
    .subscribe(() => {
      this.sort.sort({ id: 'TimeRecorded', start: 'desc', disableClear: true });
    });

    this.apiService.refreshCommandsClient(this.computerId).subscribe(
      (data2: PacketInfo[]) => {
        this.dataSource.data = data2;
      },
      (err: HttpErrorResponse) => {
        console.log("HTTP Error: " + err);
      },
    );

    this.updatePacketInfos();
    // Get and update data
    this.adminWebsocketService.packetInfosEvent.subscribe((packetInfo: PacketInfo) => {
      // Check if it concerns us
      if (this.computerId == '' || packetInfo == undefined || packetInfo.Command.computerid == this.computerId) {
        this.updatePacketInfos();
      }
    })
  }

  updatePacketInfos() {
    var data2 = this.adminWebsocketService.getPacketInfos();

    if (this.computerId == '') {
      this.dataSource.data = data2;
    } else {
      var newData = data2.filter(d => d.Command.computerid == this.computerId ||d.Command.computerid == "0");
      this.dataSource.data = newData;
    }
  }


  showModalCommandCreate(computerId: string) {
    var data: CommandCreateArgs = {
      computerId: computerId,
    }

    const dialogRef = this.dialog.open(CommandCreateModalComponent, {
      width: '80em',
      height: '50em',
      data: data,
    });
  }

  openFileTab(url: string){
    let basename = url.substring(url.lastIndexOf('/')+1);
    let url2 = this.apiService.getAdminUpload(basename);
    window.open(url2, "_blank");
  }

}
