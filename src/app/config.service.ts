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
      //this.setServerIp("");
    } else {
      this.setServerIp(serverIp);
    }
  }

  getIsVirgin(): boolean {
    var o = localStorage.getItem("isVirgin");
    if (o == "false") {
      return false;
    } else {
      return true;
    }
  }
  setIsVirgin(isVirgin: boolean) {
    if (isVirgin) {
      localStorage.setItem("isVirgin", "true")
    } else {
      localStorage.setItem("isVirgin", "false")
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

  
  getOnlyMe(): boolean {
    var o = localStorage.getItem("onlyMe");
    if (o == "true") {
      return true;
    } else {
      return false;
    }
  }
  setOnlyMe(onlyMe: boolean){
    if (onlyMe) {
      localStorage.setItem("onlyMe", "true");  
    } else {
      localStorage.setItem("onlyMe", "false");
    }
  }


  getHollowData(): string[] {
    var json = localStorage.getItem("spawnData") || "";
    if (json == "") {
      return [ 'c:\\windows\\system32\\clipup.exe' ];
    } else {
      return JSON.parse(json);
    }
  }
  setHollowData(spawnData: string[]) {
    localStorage.setItem("spawnData", JSON.stringify(spawnData));
  }

  getCopyFirstData(): string[] {
    var json = localStorage.getItem("spawnData") || "";
    if (json == "") {
      return ['c:\\temp\\notavirus.exe' ];
    } else {
      return JSON.parse(json);
    }
  }
  setCopyFirstData(spawnData: string[]) {
    localStorage.setItem("spawnData", JSON.stringify(spawnData));
  }

}
