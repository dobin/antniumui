import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Campaign } from '../app.model'
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-campaign-view',
  templateUrl: './campaign-view.component.html',
  styleUrls: ['./campaign-view.component.css']
})
export class CampaignViewComponent implements OnInit {

  public campaign: Campaign

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.apiService.getCampaign().subscribe(
      (data: Campaign) => { 
        this.campaign = data;
      },
      (err: HttpErrorResponse) => {
        console.log("HTTP Error: " + err);
      },
    );
  }


}
