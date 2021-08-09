import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { DirEntry } from '../app.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-file-upload-list',
  templateUrl: './file-upload-list.component.html',
  styleUrls: ['./file-upload-list.component.css']
})
export class FileUploadListComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [ 'name', 'size', 'modified', 'isDir' ];
  dataSource: MatTableDataSource<DirEntry> = new MatTableDataSource<DirEntry>();

  constructor(
    private dataService: DataService,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.dataService.clientFilesUpdates.subscribe(nothing => {
      this.dataSource.data = this.dataService.uploads;
    });
  }

  ngAfterViewInit() {
    // Connect the table components
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  } 

  downloadUpload(filename: string) {
    var url = this.dataService.makeUploadLink(filename);
    // Not public, need authenticated http client
    this.apiService.downloadClientUpload(url);
  }

    // Table filter
    applyFilter(event: any) {
      var filterValue: string = event.target.value;
      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
      this.dataSource.filter = filterValue;
    }
}
