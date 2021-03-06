import { Component } from '@angular/core';
import { ConfigModalComponent } from './config-modal/config-modal.component';
import { MatDialog } from "@angular/material/dialog";
import { environment } from '../environments/environment';
import { ConfigService } from './config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'antniumui';
  isProd: boolean = false;
  serverIp: string = "";

  constructor(
    private dialog: MatDialog,
    private configService: ConfigService,
  ) {
    this.serverIp = this.configService.getServerIp();
    if (environment.production) {
      this.isProd = true;
    } else {
      this.isProd = false;
    }
  }

  openConfigModal() {
    const dialogRef = this.dialog.open(ConfigModalComponent, {
      width: '80em',
      height: '42em',
      data: {},
    });
  }
}
