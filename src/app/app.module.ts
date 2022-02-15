import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { FlexLayoutModule } from '@angular/flex-layout';

import { PacketInfoListComponent } from './packetinfo-list/packetinfo-list.component';
import { ClientListComponent } from './client-list/client-list.component';
import { PacketCreateModalComponent } from './packet-create-modal/packet-create-modal.component';
import { AuthInterceptor } from './auth-interceptor';
import { StripPipe } from './strip-pipe'
import { CampaignViewComponent } from './campaign-view/campaign-view.component';
import { ConfigModalComponent } from './config-modal/config-modal.component';
import { DocsComponent } from './docs/docs.component';
import { PacketTableComponent } from './packet-table/packet-table.component';
import { ClientViewModalComponent } from './client-view-modal/client-view-modal.component';
import { ClientsPageComponent } from './clients-page/clients-page.component';
import { PacketCreateComponent } from './packet-create/packet-create.component';
import { PacketCreatePageComponent } from './packet-create-page/packet-create-page.component';
import { ClientInfoComponent } from './client-info/client-info.component';
import { FileUploadListComponent } from './file-upload-list/file-upload-list.component';
import { FileStaticListComponent } from './file-static-list/file-static-list.component';
import { CmdExecComponent } from './cmd-exec/cmd-exec.component';
import { CmdShellComponent } from './cmd-shell/cmd-shell.component';
import { CmdUploadComponent } from './cmd-upload/cmd-upload.component';
import { CmdDownloadComponent } from './cmd-download/cmd-download.component';
import { CmdBrowseComponent } from './cmd-browse/cmd-browse.component';
import { CmdOtherComponent } from './cmd-other/cmd-other.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PacketInfoListComponent,
    ClientListComponent,
    PacketCreateModalComponent,
    CampaignViewComponent,
    StripPipe,
    ConfigModalComponent,
    DocsComponent,
    PacketTableComponent,
    ClientViewModalComponent,
    ClientsPageComponent,
    PacketCreateComponent,
    PacketCreatePageComponent,
    ClientInfoComponent,
    FileUploadListComponent,
    FileStaticListComponent,
    CmdExecComponent,
    CmdShellComponent,
    CmdUploadComponent,
    CmdDownloadComponent,
    CmdBrowseComponent,
    CmdOtherComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatGridListModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatTabsModule,
    MatToolbarModule,
    // TreetableModule,
    MatMenuModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    FlexLayoutModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
