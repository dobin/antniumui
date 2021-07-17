import { Injectable } from '@angular/core';  
import { HttpClient } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { SrvCmdBase } from './app.model';
import { Observable } from 'rxjs';

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

	public refresh(): Observable<SrvCmdBase[]> {
		return this.httpClient.get<SrvCmdBase[]>(this.SERVER_URL + "/admin/listCommands");
	}
}

