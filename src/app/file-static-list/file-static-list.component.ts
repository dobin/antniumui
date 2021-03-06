import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DataService } from '../data.service';
import { DirEntry } from '../app.model';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-file-static-list',
  templateUrl: './file-static-list.component.html',
  styleUrls: ['./file-static-list.component.css']
})
export class FileStaticListComponent implements OnInit {
  @Input() short = false;

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<DirEntry> = new MatTableDataSource<DirEntry>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dataService: DataService,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    if (this.short) {
      this.displayedColumns = [ 'name', 'size' ];
    } else {
      this.displayedColumns =  [ 'name', 'size', 'modified', 'isDir' ];
    }

    this.dataService.clientFilesUpdates.subscribe(nothing => {
      this.dataSource.data = this.dataService.statics;
    });
  }

  ngAfterViewInit() {
    // Connect the table components
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  } 

  downloadStatic(filename: string) {
    var url = this.dataService.makeStaticLink(filename);
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
  
  handleFileInput(event: any) {
    var file = event.target.files.item(0);
    this.uploadFileToActivity(file);
  }

  uploadFileToActivity(file: File) {
    this.apiService.uploadFile(file).subscribe(
      (data: any) => {
        console.log("Success file upload");
        this.openSnackBar("success", "Ignore");
        this.dataService.downloadPeriodics();
      }, 
      (err: HttpErrorResponse) => {
        this.openSnackBar("Error uploading file", "Ignore");
        console.log("Fail file upload");
        console.log(err);
        this.dataService.downloadPeriodics();
      });
  }

  
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
}
