import { Injectable } from '@angular/core';  
import { HttpClient } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { PacketInfo, ClientInfo, Packet, Campaign } from './app.model';
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

	public getPackets(): Observable<PacketInfo[]> {
		return this.httpClient.get<PacketInfo[]>(this.SERVER_URL + "/admin/packets");
	}

	public getPacketsClient(computerId: string): Observable<PacketInfo[]> {
		return this.httpClient.get<PacketInfo[]>(this.SERVER_URL + "/admin/packets/" + computerId);
	}

	public getClients(): Observable<ClientInfo[]> {
		return this.httpClient.get<ClientInfo[]>(this.SERVER_URL + "/admin/clients");
	}

	public sendPacket(packet: Packet) {
		return this.httpClient.post(this.SERVER_URL + "/admin/addPacket", JSON.stringify(packet));
	}

	public getAdminUpload(filename: string): any {
		var url = this.SERVER_URL + "/admin/upload/" + filename;
	
		// https://stackoverflow.com/questions/51682514/angular-how-to-download-a-file-from-httpclient
		this.httpClient.get(url,{responseType: 'blob' as 'json'}).subscribe(
			(response: any) =>{
				let dataType = response.type;
				let binaryData = [];
				binaryData.push(response);
				let downloadLink = document.createElement('a');
				downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
				if (filename)
					downloadLink.setAttribute('download', filename);
				document.body.appendChild(downloadLink);
				downloadLink.click();
			}
		)
	}

}

