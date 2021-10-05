import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { ConfigModalComponent } from '../config-modal/config-modal.component';
import { ConfigService } from '../config.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private configService: ConfigService,
   ) { }

  ngOnInit(): void {
    if (this.configService.getIsVirgin()) {
      const dialogRef = this.dialog.open(ConfigModalComponent, {
        width: '80em',
        height: '42em',
        data: {},
      });
    }
  }
}
