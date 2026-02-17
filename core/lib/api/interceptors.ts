/**
 * Axios request/response interceptors
 * Migrated from Angular HttpInterceptorHandler
 */
import type { InternalAxiosRequestConfig, AxiosError } from 'axios';
import { storageService } from '../../services/storage.service';
import { toastService } from '../../services/toast.service';

export function setupRequestInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  if (typeof window === 'undefined') return config;

  const url = config.url ?? '';
  // Remove Content-Type header for FormData - browser will set it with boundary
  if (config.data instanceof FormData) {
    config.headers.delete('Content-Type');
  }
  if (url.includes('bonanzaconnect.com')) {
    config.headers.set('Authorization', 'bearer test123');
  } else {
    const token = storageService.getToken();
    if (token) {
      config.headers.set('Authorization', token);
    }
  }
  return config;
}

export function setupResponseErrorHandler(error: AxiosError<{ message?: string | Array<{ message?: string }>; response?: { message?: string } }>): void {
  if (typeof window === 'undefined') return;

  if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
    toastService.showError('You are not connected to the internet, Or maybe the server is down.');
    return;
  }

  const errMsg = error.response?.data;
  if (errMsg) {
    const msg = errMsg.message;
    if (Array.isArray(msg)) {
      msg.forEach((m: { message?: string }) => {
        if (m?.message) toastService.showError(m.message);
      });
    } else if (typeof msg === 'string') {
      toastService.showError(msg);
    } else {
      const fallback =
        (errMsg as { response?: { message?: string } })?.response?.message ||
        error.message ||
        'An error occurred';
      toastService.showError(fallback);
    }
  } else {
    toastService.showError(error.message || 'An error occurred');
  }
}
