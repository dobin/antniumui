import { Injectable } from '@angular/core';  
import { HttpClient } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { SrvCmdBase, ClientBase, Command, Campaign } from './app.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({  
	providedIn: 'root'  
})  
export class ApiService {
	private SERVER_URL = location.origin;

    constructor(
		private httpClient: HttpClient,
	) { 
		if (isDevMode()) {
			this.SERVER_URL = "http://localhost:4444";
		}
	}

	public getCampaign(): Observable<Campaign> {
		return this.httpClient.get<Campaign>(this.SERVER_URL + "/admin/campaign");
	}

	public refreshCommands(): Observable<SrvCmdBase[]> {
		return this.httpClient.get<SrvCmdBase[]>(this.SERVER_URL + "/admin/commands");
	}

	public refreshCommandsClient(computerId: string): Observable<SrvCmdBase[]> {
		return this.httpClient.get<SrvCmdBase[]>(this.SERVER_URL + "/admin/commands/" + computerId);
	}

	public refreshClients(): Observable<ClientBase[]> {
		return this.httpClient.get<ClientBase[]>(this.SERVER_URL + "/admin/clients");
	}

	public sendCommand(command: Command) {
		return this.httpClient.post(this.SERVER_URL + "/admin/addCommand", JSON.stringify(command));
	}

	public getAdminUpload(filename: string): string {
		return this.SERVER_URL + "/admin/upload/" + filename;
	}
}

