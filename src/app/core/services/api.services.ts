import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  BASE_URL = `${environment.BASE_URL}/api`;
  constructor(private _httpClient: HttpClient) {}

  post(url: string, optional: { body: any; query?: any, includeBaseUrl?: boolean }) {
    if(!optional.includeBaseUrl){
      url = `${this.BASE_URL}/${url}`
    }
    return this._httpClient.post(url, optional.body, {
      params: optional.query,
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // }
    });
  }

  get(url: string, optional: { params?: any; query?: any, headers?: any }) {
    return this._httpClient.get(
      `${this.BASE_URL}/${this.handleUrl(url, optional.params)}`,
      {
        params: optional.query,
        responseType: optional?.headers?.responseType || 'json'
      }
    );
  }

  put(url: string, optional: { body: any; params?: string; query?: any }) {
    return this._httpClient.put(
      `${this.BASE_URL}/${this.handleUrl(url, optional.params)}`,
      optional.body,
      {
        params: optional.query,
      }
    );
  }

  patch(url: string, optional: { body: any; params: string; query: any }) {
    return this._httpClient.patch(
      `${this.BASE_URL}/${this.handleUrl(url, optional.params)}`,
      optional.body,
      {
        params: optional.query,
      }
    );
  }

  delete(url: string, params: string) {
    return this._httpClient.delete(`${this.BASE_URL}/${url}/${params}`);
  }

  handleUrl(url: string, params: string | undefined) {
    if (params) {
      return `${url}/${params}`;
    }
    return url;
  }
}
