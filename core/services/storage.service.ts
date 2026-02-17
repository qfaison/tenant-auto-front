/**
 * Storage service for token and local storage operations
 * Migrated from Angular StorageService
 */
import { APP_CONSTANT } from '../utils/constants';

export class StorageService {
  tenantId = '';

  getToken(): string {
    let token: string | null;
    if (this.tenantId) {
      token = typeof window !== 'undefined' ? localStorage.getItem(this.tenantId) : null;
    } else {
      token = typeof window !== 'undefined' ? localStorage.getItem(APP_CONSTANT.LOCAL_STORAGE.TOKEN) : null;
    }
    if (token) {
      try {
        return JSON.parse(token) as string;
      } catch {
        return token;
      }
    }
    return '';
  }

  setToken(userData: { username: string; password: string }): void {
    if (userData && typeof window !== 'undefined') {
      const token = 'Basic ' + btoa(userData.username + ':' + userData.password);
      localStorage.setItem(APP_CONSTANT.LOCAL_STORAGE.TOKEN, JSON.stringify(token));
      document.cookie = `${APP_CONSTANT.AUTH_COOKIE_NAME}=1; path=/; max-age=86400; SameSite=Lax`;
    }
  }

  setEncryptedToken(token: string, tenantId: string): void {
    this.tenantId = tenantId;
    if (typeof window !== 'undefined') {
      localStorage.setItem(tenantId, JSON.stringify(token));
    }
  }

  clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      document.cookie = `${APP_CONSTANT.AUTH_COOKIE_NAME}=; path=/; max-age=0`;
    }
  }
}

export const storageService = new StorageService();
