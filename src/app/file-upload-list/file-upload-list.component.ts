import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { PacketInfo, Packet, ClientInfo, Campaign, DownstreamInfo, DirEntry } from '../app.model';

@Component({
  selector: 'app-file-upload-list',
  templateUrl: './file-upload-list.component.html',
  styleUrls: ['./file-upload-list.component.css']
})
export class FileUploadListComponent implements OnInit {
  uploadList: DirEntry[] = [];
  displayedColumns: string[] = [ 'name', 'size', 'modified', 'isDir' ];

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.dataService.clientFilesUpdates.subscribe(nothing => {
      this.uploadList = this.dataService.uploads;
    });
  }

}
