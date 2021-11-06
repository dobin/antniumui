import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-packet-create-page',
  templateUrl: './packet-create-page.component.html',
  styleUrls: ['./packet-create-page.component.css']
})
export class PacketCreatePageComponent implements OnInit {
  clientId: string = "";

  constructor(
    private route: ActivatedRoute
  ) { 
  }

  ngOnInit(): void {
    this.route.params.subscribe( params => this.clientId = params["clientId"] );
  }

}
  