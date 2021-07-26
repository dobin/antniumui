import { Injectable } from '@angular/core';  
import { HttpClient } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { config, Observable } from 'rxjs';
import { PacketInfo, ClientInfo, Packet, Campaign } from './app.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({  
	providedIn: 'root'  
})  
export class ApiService {
	private SERVER_URL = "";

    constructor(
		private httpClient: HttpClient,
		private configService: ConfigService,
	) { 
		if (isDevMode()) {
			//this.SERVER_URL = "http://localhost:4444";
		}
		this.SERVER_URL = configService.getServerIp();
	}

	public getCampaign(): Observable<Campaign> {
		return this.httpClient.get<Campaign>(this.SERVER_URL + "/admin/campaign");
	}

	public refreshCommands(): Observable<PacketInfo[]> {
		return this.httpClient.get<PacketInfo[]>(this.SERVER_URL + "/admin/commands");
	}

	public refreshCommandsClient(computerId: string): Observable<PacketInfo[]> {
		return this.httpClient.get<PacketInfo[]>(this.SERVER_URL + "/admin/commands/" + computerId);
	}

	public refreshClients(): Observable<ClientInfo[]> {
		return this.httpClient.get<ClientInfo[]>(this.SERVER_URL + "/admin/clients");
	}

	public sendCommand(command: Packet) {
		return this.httpClient.post(this.SERVER_URL + "/admin/addCommand", JSON.stringify(command));
	}

	public getAdminUpload(filename: string): string {
		return this.SERVER_URL + "/admin/upload/" + filename;
	}
}

