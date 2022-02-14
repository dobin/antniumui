import { Component, OnInit, Input } from '@angular/core';
import { PacketInfo, Packet, Campaign, DirEntry } from '../app.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-packet-create',
  templateUrl: './packet-create.component.html',
  styleUrls: ['./packet-create.component.css']
})
export class PacketCreateComponent implements OnInit {
  // Data
  @Input() clientId = "";

  // UI
  selectedTabIndex: number = 0
  commandselect: number = 0
  interval: any

  downstreamId: string = "client"

  constructor(
    private apiService: ApiService,
    private dataService: DataService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {

  }




  // Utils:

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
 

}
