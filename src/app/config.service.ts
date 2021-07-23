import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private adminApiKey = "";
  private serverIp = "";

  constructor() { 
    var adminApiKey = localStorage.getItem("adminApiKey");
    if (adminApiKey == null) {
      this.adminApiKey = "Secret-AdminApi-Key";
    } else {
      this.adminApiKey = adminApiKey;
    }

    var serverIp = localStorage.getItem("serverIp");
    if (serverIp == null) {
      this.serverIp = "http://127.0.0.1:4444";
    } else {
      this.serverIp = serverIp;
    }

  }

  getAdminApiKey(): string {
    return this.adminApiKey;
  }

  setAdminApiKey(adminApiKey: string) {
    localStorage.setItem("adminApiKey", adminApiKey);
    this.adminApiKey = adminApiKey;
  }

  getServerIp(): string {
    return this.serverIp;
  }

  setServerIp(serverIp: string) {
    localStorage.setItem("serverIp", serverIp);
    this.serverIp = serverIp;
  }
}
