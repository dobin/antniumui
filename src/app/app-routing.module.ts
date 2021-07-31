import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DocsComponent } from './docs/docs.component';
import { CampaignViewComponent } from './campaign-view/campaign-view.component';
import { ClientsPageComponent } from './clients-page/clients-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'docs', component: DocsComponent },
  { path: 'campaign', component: CampaignViewComponent },
  { path: 'clients', component: ClientsPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }