'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isAxiosError } from 'axios';
import { useAuth } from '@/core/hooks/useAuth';
import { toastService } from '@/core/services/toast.service';
import { login } from '../services/auth.service';
import { APP_CONSTANT } from '@/core/utils/constants';
import type { LoginCredentials } from '../services/auth.service';

function getLoginErrorMessage(err: unknown): string {
  if (isAxiosError(err) && err.response?.status === 400) {
    const data = err.response?.data as { message?: string } | undefined;
    const msg = typeof data?.message === 'string' ? data.message : undefined;
    return msg ?? 'Invalid credentials';
  }
  return err instanceof Error ? err.message : 'Login failed';
}

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login: setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const submitLogin = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true);
      setError(null);
      try {
        const res = await login(credentials);
        const successMessage = typeof res?.message === 'string' ? res.message : 'Login successful';
        toastService.showSuccess(successMessage);
        const body = (res?.body ?? res) as { username?: string; password?: string } | undefined;
        const userData = body && typeof body === 'object' && body.username != null
          ? { username: body.username, password: body.password ?? credentials.password }
          : credentials;
        setAuth(userData);
        const from = searchParams.get('from');
        router.push(from || `/${APP_CONSTANT.ROUTES.TENANT.LIST}`);
      } catch (err) {
        setError(getLoginErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [router, searchParams, setAuth]
  );

  return { submitLogin, loading, error, clearError };
}
