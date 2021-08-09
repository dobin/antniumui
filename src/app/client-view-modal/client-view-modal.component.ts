import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import {  ClientInfo } from '../app.model';
import { MatPaginator } from '@angular/material/paginator';
import { AfterViewInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-client-view-modal',
  templateUrl: './client-view-modal.component.html',
  styleUrls: ['./client-view-modal.component.css']
})
export class ClientViewModalComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<string> = new MatTableDataSource<string>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public clientInfo: ClientInfo
  ) { }

  ngOnInit(): void {
   // For table filter
   this.dataSource.filterPredicate = 
   (data: string, filter: string) => !filter || filter == "" || (
     data.includes(filter)
   );

    this.dataSource.data = this.clientInfo.Processes;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  } 
  
  // Table filter
  applyFilter(event: any) {
    var filterValue: string = event.target.value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
