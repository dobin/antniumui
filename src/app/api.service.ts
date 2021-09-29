import { Injectable } from '@angular/core';  
import { HttpClient } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { PacketInfo, ClientInfo, Packet, Campaign, DirEntry } from './app.model';
import { ConfigService } from './config.service';


@Injectable({  
	providedIn: 'root'  
})  
export class ApiService {
    constructor(
		private httpClient: HttpClient,
		private configService: ConfigService,
	) { 
		if (isDevMode()) {
			//this.SERVER_URL = "http://localhost:4444";
		}
		
	}

	public getCampaign(): Observable<Campaign> {
		var SERVER_URL = this.configService.getServerIp();
		return this.httpClient.get<Campaign>(SERVER_URL + "/admin/campaign");
	}

	public getPackets(): Observable<PacketInfo[]> {
		var SERVER_URL = this.configService.getServerIp();

		return this.httpClient.get<PacketInfo[]>(SERVER_URL + "/admin/packets");
	}

	public getPacketsClient(computerId: string): Observable<PacketInfo[]> {
		var SERVER_URL = this.configService.getServerIp();

		return this.httpClient.get<PacketInfo[]>(SERVER_URL + "/admin/packets/" + computerId);
	}

	public getClients(): Observable<ClientInfo[]> {
		var SERVER_URL = this.configService.getServerIp();

		return this.httpClient.get<ClientInfo[]>(SERVER_URL + "/admin/clients");
	}

	public sendPacket(packet: Packet) {
		var SERVER_URL = this.configService.getServerIp();

		var user = this.configService.getUser();
		if (user == "") {
			user = "anon";
		}
		return this.httpClient.post(SERVER_URL + "/admin/addPacket/" + user, JSON.stringify(packet));
	}

	public getUploads(): Observable<DirEntry[]> {
		var SERVER_URL = this.configService.getServerIp();

		return this.httpClient.get<DirEntry[]>(SERVER_URL + "/admin/uploads");
	}
	public getStatics(): Observable<DirEntry[]> {
		var SERVER_URL = this.configService.getServerIp();

		return this.httpClient.get<DirEntry[]>(SERVER_URL + "/admin/statics");
	}

	public downloadClientUpload(url: string) {
		// https://stackoverflow.com/questions/51682514/angular-how-to-download-a-file-from-httpclient
		this.httpClient.get(url,{responseType: 'blob' as 'json'}).subscribe(
			(response: any) =>{
				var fileURL = window.URL.createObjectURL(response);                        
                window.open(fileURL, '_blank');
			}
		)
	}

	// https://stackoverflow.com/questions/3820381/need-a-basename-function-in-javascript
	basename(str: string) {
		var sep = "/";
		return str.substr(str.lastIndexOf(sep) + 1);
	}

	public makePacket(computerId: string, packetType: string, args: { [id: string]: string }, downstreamId: string): Packet {
		var packet: Packet = {
		  computerid: computerId, 
		  packetid: this.getRandomInt(),
		  packetType: packetType,
		  arguments: args,
		  response: {},
		  downstreamId: downstreamId,
		}
		return packet
	}

	getRandomInt(): string {
		return Math.floor(Math.random() * 100000000000000).toString();
	}
}

