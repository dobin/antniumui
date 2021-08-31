import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from "@angular/material/dialog";
import { Packet, PacketInfo } from '../app.model';
import { ApiService } from '../api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { PacketCreateModalComponent } from '../packet-create-modal/packet-create-modal.component';
import { DataService } from '../data.service';


@Component({
  selector: 'app-packet-table',
  templateUrl: './packet-table.component.html',
  styleUrls: ['./packet-table.component.css']
})
export class PacketTableComponent implements OnInit {
  @Input() computerId = '';

  dataSource: MatTableDataSource<PacketInfo> = new MatTableDataSource<PacketInfo>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [];
  pageSizeOptions: number[] = [5];


  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    // For table filter
    this.dataSource.filterPredicate = 
      (data: PacketInfo, filter: string) => !filter || filter == "" || (
        data.Packet.packetType.includes(filter)
        || data.Packet.computerid.includes(filter)
        || data.Packet.packetid.includes(filter)
        || (Object.values(data.Packet.arguments).filter(s => s.includes(filter))).length > 0
        || (Object.values(data.Packet.response).filter(s => s.includes(filter))).length > 0
      );

    if (this.computerId != "") {
      this.displayedColumns = [
        'TimeRecorded', 'packetType', 'arguments', 'response'];
        this.pageSizeOptions = [3, 5, 10];
    } else {
      this.displayedColumns = [
        'actions', 'TimeRecorded', 'ClientIp', 'packetType', 'arguments', 'response', 'State'];
      this.pageSizeOptions = [6, 12, 24, 48];
    }

    // Get initial data
    this.updatePacketInfos();
    // Get and update data
    this.dataService.packetInfosEvent.subscribe((packetInfo: PacketInfo) => {
      // Check if it concerns us
      if (this.computerId == '' || packetInfo == undefined || packetInfo.Packet.computerid == this.computerId) {
        this.updatePacketInfos();
      }
    })
  }

  ngAfterViewInit() {
    // Connect the table components
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  } 

  updatePacketInfos() {
    var data2 = this.dataService.packetInfos;

    if (this.computerId == '') {
      this.dataSource.data = data2.reverse();
    } else {
      var newData = data2.filter(d => d.Packet.computerid == this.computerId ||d.Packet.computerid == "0").reverse();
      this.dataSource.data = newData;
    }
  }


  showModalPacketCreate(computerId: string) {
    const dialogRef = this.dialog.open(PacketCreateModalComponent, {
      width: '80em',
      height: '55em',
      data: computerId,
    });
  }

  openUploadFile(packet: Packet){
    var campaign = this.dataService.campaign;
    var filename = this.apiService.basename(packet.arguments["source"]);
    var url = campaign.ServerUrl + "/admin/upload/" + packet.computerid + "." + packet.packetid + "." + filename;

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
