import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PacketInfo, Packet, ClientInfo, Campaign } from '../app.model';
import { ApiService } from '../api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminWebsocketService } from '../admin-websocket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PacketCreateComponent } from '../packet-create/packet-create.component';

@Component({
  selector: 'app-packet-create-modal',
  templateUrl: './packet-create-modal.component.html',
  styleUrls: ['./packet-create-modal.component.css']
})
export class PacketCreateModalComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public computerId: string
  ) { }

  ngOnInit(): void {
   
  }
}
