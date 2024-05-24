import { Injectable } from '@angular/core';
import { APP_CONSTANT } from 'src/app/core/constant/app.constant';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  tenantId: string = '';
  getToken() {
    let token: any;
    if (this.tenantId) {
      token = localStorage.getItem(this.tenantId);
    } else {
      token = localStorage.getItem(APP_CONSTANT.LOCAL_STORAGE.TOKEN);
    }
    if (token) {
      return JSON.parse(token);
    }
    return '';
  }

  setToken(userData: { username: string; password: string }) {
    if (userData) {
      const token =
        'Basic ' + btoa(userData.username + ':' + userData.password);
      localStorage.setItem(
        APP_CONSTANT.LOCAL_STORAGE.TOKEN,
        JSON.stringify(token)
      );
    }
  }

  setEncryptedToken(token: string, tenantId: string) {
    this.tenantId = tenantId;
    localStorage.setItem(
      tenantId,
      JSON.stringify(token)
    );
  }
}
