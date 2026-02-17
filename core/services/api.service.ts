/**
 * API service - HTTP client wrapper
 * Migrated from Angular ApiService (HttpClient → Axios)
 */
import { apiClient } from '../lib/api/axios';
import type { AxiosResponse } from 'axios';

const BASE_URL =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BASE_URL) || 'http://localhost:3000';

function handleUrl(url: string, params?: string): string {
  if (params) {
    return `${url}/${params}`;
  }
  return url;
}

export interface ApiGetOptions {
  params?: string;
  query?: Record<string, unknown>;
  headers?: { responseType?: 'json' | 'arraybuffer' | 'blob' | 'text' };
}

export interface ApiPostOptions {
  body: unknown;
  query?: Record<string, unknown>;
  includeBaseUrl?: boolean;
  header?: Record<string, string>;
}

export interface ApiPutOptions {
  body: unknown;
  params?: string;
  query?: Record<string, unknown>;
}

export interface ApiPatchOptions {
  body: unknown;
  params: string;
  query: Record<string, unknown>;
}

export class ApiService {
  get BASE_URL(): string {
    return `${BASE_URL}/api`;
  }

  async get<T = unknown>(url: string, optional: ApiGetOptions = {}): Promise<AxiosResponse<T>> {
    const path = handleUrl(url, optional.params);
    const responseType = optional.headers?.responseType ?? 'json';
    return apiClient.get<T>(path, {
      params: optional.query,
      responseType,
    });
  }

  async post<T = unknown>(url: string, optional: ApiPostOptions): Promise<AxiosResponse<T>> {
    return apiClient.post<T>(url, optional.body, {
      params: optional.query,
      headers: optional.header,
    });
  }

  async put<T = unknown>(url: string, optional: ApiPutOptions): Promise<AxiosResponse<T>> {
    const requestUrl = handleUrl(url, optional.params);
    return apiClient.put<T>(requestUrl, optional.body, {
      params: optional.query,
    });
  }

  async patch<T = unknown>(url: string, optional: ApiPatchOptions): Promise<AxiosResponse<T>> {
    const requestUrl = handleUrl(url, optional.params);
    return apiClient.patch<T>(requestUrl, optional.body, {
      params: optional.query,
    });
  }

  async delete<T = unknown>(url: string, params: string): Promise<AxiosResponse<T>> {
    return apiClient.delete<T>(`${url}/${params}`);
  }
}

export const apiService = new ApiService();
