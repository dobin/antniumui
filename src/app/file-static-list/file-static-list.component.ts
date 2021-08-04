import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { PacketInfo, Packet, ClientInfo, Campaign, DownstreamInfo, DirEntry } from '../app.model';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-file-static-list',
  templateUrl: './file-static-list.component.html',
  styleUrls: ['./file-static-list.component.css']
})
export class FileStaticListComponent implements OnInit {
  displayedColumns: string[] = [ 'name', 'size', 'modified', 'isDir' ];
  dataSource: MatTableDataSource<DirEntry> = new MatTableDataSource<DirEntry>();

  constructor(
    private dataService: DataService,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.dataService.clientFilesUpdates.subscribe(nothing => {
      this.dataSource.data = this.dataService.statics;
    });
  }

  downloadStatic(filename: string) {
    var url = this.dataService.makeStaticLink(filename);
    // Not public, need authenticated http client
    this.apiService.downloadClientUpload(url);
  }
}
