import { Component } from '@angular/core';
import { ConfigModalComponent } from './config-modal/config-modal.component';
import { MatDialog } from "@angular/material/dialog";
import { AdminWebsocketService } from './admin-websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'antniumui';

  constructor(
    private adminWebsocketService: AdminWebsocketService, // This connects the WS via init()
    private dialog: MatDialog,
  ) {}

  openConfigModal() {
    const dialogRef = this.dialog.open(ConfigModalComponent, {
      width: '80em',
      height: '42em',
      data: {},
    });
  }
}
