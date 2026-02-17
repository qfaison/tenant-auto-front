/**
 * Axios instance with base URL and interceptors
 */
import axios, { type AxiosInstance } from 'axios';
import { setupRequestInterceptor, setupResponseErrorHandler } from './interceptors';

const BASE_URL =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BASE_URL) || 'http://localhost:3000';

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(setupRequestInterceptor, (err) => Promise.reject(err));

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    setupResponseErrorHandler(error);
    return Promise.reject(error);
  }
);

export { BASE_URL };
