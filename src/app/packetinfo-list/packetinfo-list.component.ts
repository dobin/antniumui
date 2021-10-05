import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { ApiService } from '../api.service';

@Component({
  selector: 'app-packetinfo-list',
  templateUrl: './packetinfo-list.component.html',
  styleUrls: ['./packetinfo-list.component.css']
})
export class PacketInfoListComponent implements OnInit {
  constructor(    
    private dialog: MatDialog,
		private apiService: ApiService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }
}
