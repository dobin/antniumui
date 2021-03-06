import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from "@angular/material/dialog";
import { Packet, PacketInfo } from '../app.model';
import { ApiService } from '../api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs/operators';
import { PacketCreateModalComponent } from '../packet-create-modal/packet-create-modal.component';
import { DataService } from '../data.service';
import { ConfigService } from '../config.service';
import { EMPTY, Observable, Subject, timer } from 'rxjs';

@Component({
  selector: 'app-packet-table',
  templateUrl: './packet-table.component.html',
  styleUrls: ['./packet-table.component.css']
})
export class PacketTableComponent implements OnInit {
  @Input() clientId = '';

  dataSource: MatTableDataSource<PacketInfo> = new MatTableDataSource<PacketInfo>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [];
  pageSizeOptions: number[] = [5];

  onlyMe: boolean = false;

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private dataService: DataService,
    private configService: ConfigService,
  ) { }

  ngOnInit(): void {
    this.onlyMe = this.configService.getOnlyMe();

    // FIX: JS Warning Race Condition
    timer(0)
    .pipe(take(1))
    .subscribe(() => {
      this.sort.sort({ id: 'TimeRecorded', start: 'desc', disableClear: true });
    });

    // For table filter
    this.dataSource.filterPredicate = 
      (data: PacketInfo, filter: string) => !filter || filter == "" || (
        data.Packet.packetType.includes(filter)
        || data.Packet.clientid.includes(filter)
        || data.Packet.packetid.includes(filter)
        || data.User.includes(filter)
        || (Object.values(data.Packet.arguments).filter(s => s.includes(filter))).length > 0
        || (Object.values(data.Packet.response).filter(s => s.includes(filter))).length > 0
      );

    if (this.clientId != "") {
      this.displayedColumns = [
        'TimeRecorded', 'packetType', 'arguments', 'response'];
        this.pageSizeOptions = [3, 5, 10];
    } else {
      this.displayedColumns = [
        'actions', 'TimeRecorded', 'packetType', 'arguments', 'response', 'State'];
      this.pageSizeOptions = [6, 12, 24, 48];
    }

    // Get initial data
    this.updatePacketInfos();
    // Get and update data
    this.dataService.packetInfosEvent.subscribe((packetInfo: PacketInfo) => {
      // Check if it concerns us
      if (this.clientId == '' || packetInfo == undefined || packetInfo.Packet.clientid == this.clientId) {
          this.updatePacketInfos();
      }
    })

    // Get messages directly from websocket
    /*this.adminWebsocketService.messages$.subscribe((packetInfo: PacketInfo) => {
      // Check if it concerns us
      if (this.clientId == '' || packetInfo == undefined || packetInfo.Packet.clientid == this.clientId) {
          this.updatePacketInfos();
      }
    })*/
  }

  ngAfterViewInit() {
    // Connect the table components
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  showPacketModal(packetInfo: PacketInfo) {
    const dialogRef = this.dialog.open(PacketCreateModalComponent, {
      width: '80em',
      height: '55em',
      data: packetInfo,
    });
  }

  toggleOnlyMe() {
    this.configService.setOnlyMe(this.onlyMe);
    this.updatePacketInfos();
  }

  updatePacketInfos() {
    var data2 = this.dataService.packetInfos;
    var user = this.configService.getUser();

    if (this.clientId == '') {
      if (this.onlyMe) {
        // All packets of this user
        var newData = data2.filter(d => d.User == user);
        this.dataSource.data = newData;
      } else {
        // All data
        this.dataSource.data = data2;
      }
    } else {
      if (this.onlyMe) {
        // This clientid, this user
        var newData = data2.filter(d => d.User == user && (d.Packet.clientid == this.clientId || d.Packet.clientid == "0"));
        this.dataSource.data = newData;
      } else {
        // this clientid
        var newData = data2.filter(d => d.Packet.clientid == this.clientId || d.Packet.clientid == "0");
        this.dataSource.data = newData;
      }
    }
  }

  lastseenByClientId(clientId: string) {
    var clientInfo = this.dataService.getClientBy(clientId);
    if (clientInfo == undefined) {
      return "";
    } else {
      return clientInfo.Hostname;
    }
  }


  openUploadFile(packet: Packet){
    var campaign = this.dataService.campaign;
    var filename = this.apiService.basename(packet.arguments["source"]);
    var url = campaign.ServerUrl + "/admin/upload/" + packet.clientid + "." + packet.packetid + "." + filename;

    this.apiService.downloadClientUpload(url);
  }


  public argsToDict(value: { [id: string]: string }): Array<{ [id: string]: string }> {
    var result = [ ] as Array<{ [id: string]: string }>;

    // Only work up to 9 parameters...
    var keys = Object.keys(value);
    var n = 0;
    while (true) {
      if (n > 9) {
        break;
      }

      var keysIdx = keys.filter(k => k.endsWith(n.toString()));
      if (keysIdx.length <= 0) {
        break;
      }

      var element: { [id: string]: string } = {};
      for (const key of keysIdx) {
        var keyClean = key.substr(0, key.length - 1);
        element[keyClean] = value[key];
      }
      result.push(element);

      n += 1;
    }

    return result;
  }

  // Table filter
  applyFilter(event: any) {
    var filterValue: string = event.target.value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
