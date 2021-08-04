import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { PacketInfo, Packet, ClientInfo, Campaign, DownstreamInfo, DirEntry } from '../app.model';

@Component({
  selector: 'app-file-static-list',
  templateUrl: './file-static-list.component.html',
  styleUrls: ['./file-static-list.component.css']
})
export class FileStaticListComponent implements OnInit {
  staticList: DirEntry[] = [];
  displayedColumns: string[] = [ 'name', 'size', 'modified', 'isDir' ];

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.dataService.clientFilesUpdates.subscribe(nothing => {
      this.staticList = this.dataService.statics;
    });
  }


}
