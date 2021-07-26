import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PacketInfo, Packet, ClientInfo, Campaign } from '../app.model';

@Component({
  selector: 'app-client-view-modal',
  templateUrl: './client-view-modal.component.html',
  styleUrls: ['./client-view-modal.component.css']
})
export class ClientViewModalComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public clientInfo: ClientInfo
  ) { }

  ngOnInit(): void {
  }

}
