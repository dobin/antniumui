import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DocsComponent } from './docs/docs.component';
import { CampaignViewComponent } from './campaign-view/campaign-view.component';
import { ClientsPageComponent } from './clients-page/clients-page.component';
import { PacketCreatePageComponent } from './packet-create-page/packet-create-page.component';
import { FileUploadListComponent } from './file-upload-list/file-upload-list.component';
import { FileStaticListComponent } from './file-static-list/file-static-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'docs', component: DocsComponent },
  { path: 'campaign', component: CampaignViewComponent },
  { path: 'clients', component: ClientsPageComponent },
  { path: 'packetcreate/:computerId', component: PacketCreatePageComponent },
  { path: 'uploads', component: FileUploadListComponent },
  { path: 'static', component: FileStaticListComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }