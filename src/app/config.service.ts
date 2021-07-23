import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private adminApiKey = "";

  constructor() { 
    var adminApiKey = localStorage.getItem("adminApiKey");
    if (adminApiKey == null) {
      this.adminApiKey = "Secret-AdminApi-Key";
    } else {
      this.adminApiKey = adminApiKey;
    }
  }

  getAdminApiKey(): string {
    return this.adminApiKey;
  }

  setAdminApiKey(adminApiKey: string) {
    localStorage.setItem("adminApiKey", adminApiKey);
    this.adminApiKey = adminApiKey;
  }
}
