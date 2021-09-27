import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor() { 
    var adminApiKey = localStorage.getItem("adminApiKey");
    if (adminApiKey == null) {
      this.setAdminApiKey("Secret-AdminApi-Key");
    } else {
      this.setAdminApiKey(adminApiKey);
    }

    var serverIp = localStorage.getItem("serverIp");
    if (serverIp == null) {
      this.setServerIp("http://127.0.0.1:8080");
    } else {
      this.setServerIp(serverIp);
    }

  }

  getUser(): string {
    return localStorage.getItem("user") || "anon";
  }
  setUser(user: string) {
    if (user == "") {
      user = "anon";
    }
    localStorage.setItem("user", user);
  }

  getAdminApiKey(): string {
    return localStorage.getItem("adminApiKey") || "";
  }
  setAdminApiKey(adminApiKey: string) {
    localStorage.setItem("adminApiKey", adminApiKey);
  }

  getServerIp(): string {
    return localStorage.getItem("serverIp") || "";
  }
  setServerIp(serverIp: string) {
    localStorage.setItem("serverIp", serverIp);
  }

  getPacketDbFilter(): string {
    return localStorage.getItem("packetDbFilter") || "";
  }
  setPacketDbFilter(packetDbFilter: string){
    localStorage.setItem("packetDbFilter", packetDbFilter);
  }


}
