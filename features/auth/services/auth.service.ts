/**
 * Auth service - login API
 */
import { apiService } from '@/core/services/api.service';
import { API_CONSTANT } from '@/core/lib/api/endpoints';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  body?: { username: string; password: string };
  [key: string]: unknown;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const res = await apiService.post<LoginResponse>(API_CONSTANT.USER.LOGIN, {
    body: credentials,
  });
  return res.data;
}
