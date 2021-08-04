import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { PacketInfo, Packet, ClientInfo, Campaign, DownstreamInfo, DirEntry } from '../app.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-file-upload-list',
  templateUrl: './file-upload-list.component.html',
  styleUrls: ['./file-upload-list.component.css']
})
export class FileUploadListComponent implements OnInit {
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

  downloadUpload(filename: string) {
    var url = this.dataService.makeUploadLink(filename);
    // Not public, need authenticated http client
    this.apiService.downloadClientUpload(url);
  }

}
