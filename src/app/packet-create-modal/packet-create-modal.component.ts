import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PacketInfo, Packet, ClientInfo, Campaign } from '../app.model';

@Component({
  selector: 'app-packet-create-modal',
  templateUrl: './packet-create-modal.component.html',
  styleUrls: ['./packet-create-modal.component.css']
})
export class PacketCreateModalComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public packetInfo: PacketInfo
  ) { }

  ngOnInit(): void {
    
  }
}
