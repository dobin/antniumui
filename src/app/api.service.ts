import { Injectable } from '@angular/core';  
import { HttpClient } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { SrvCmdBase, ClientBase, Command } from './app.model';

@Injectable({  
	providedIn: 'root'  
})  
export class ApiService {
	private SERVER_URL = location.origin;

    constructor(private httpClient: HttpClient) { 
		if (isDevMode()) {
			this.SERVER_URL = "http://localhost:4444";
		}
	}

	public refreshCommands(): Observable<SrvCmdBase[]> {
		return this.httpClient.get<SrvCmdBase[]>(this.SERVER_URL + "/admin/commands");
	}

	public refreshClients(): Observable<ClientBase[]> {
		return this.httpClient.get<ClientBase[]>(this.SERVER_URL + "/admin/clients");
	}

	public sendCommand(command: Command) {
		return this.httpClient.post(this.SERVER_URL + "/admin/addCommand", JSON.stringify(command));
	}
}

