import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  getAdminApiKey(): string {
    return "Secret-AdminApi-Key";
  }
}
