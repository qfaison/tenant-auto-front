'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useTenantStore } from '../store/tenantStore';
import {
  fetchTenants,
  createTenant,
  updateTenant,
  exportBankelo,
  type CreateTenantParams,
  type UpdateTenantParams,
} from '../services/tenant.service';
import { toastService } from '@/core/services/toast.service';

const DEBOUNCE_MS = 1200;

export function useTenant() {
  const {
    tenants,
    totalCounts,
    page,
    limit,
    searchText,
    isOnboarding,
    loading,
    setTenants,
    setPage,
    setLimit,
    setSearchText,
    setIsOnboarding,
    setLoading,
  } = useTenantStore();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ref to prevent duplicate API calls
  const fetchingRef = useRef<string | null>(null);

  // Keep loadTenants callback for manual calls (e.g., after create/update)
  const loadTenants = useCallback(async () => {
    setLoading(true);
    try {
      const skip = page === 1 ? 0 : (page - 1) * limit;
      const params: { skip: number; limit: number; searchText?: string; isOnboarding?: boolean } = {
        skip,
        limit,
      };
      if (searchText) params.searchText = searchText;
      if (isOnboarding) params.isOnboarding = true;
      const result = await fetchTenants(params);
      setTenants(result.data, result.totalCounts);
    } catch {
      // Interceptor shows toast
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchText, isOnboarding, setTenants, setLoading]);

  // Fix: Depend directly on values instead of callback to prevent duplicate calls
  useEffect(() => {
    // Create a unique key for this fetch based on params
    const fetchKey = `${page}-${limit}-${searchText}-${isOnboarding}`;

    // Prevent duplicate calls for same params
    if (fetchingRef.current === fetchKey) return;

    fetchingRef.current = fetchKey;
    setLoading(true);

    const skip = page === 1 ? 0 : (page - 1) * limit;
    const params: { skip: number; limit: number; searchText?: string; isOnboarding?: boolean } = {
      skip,
      limit,
    };
    if (searchText) params.searchText = searchText;
    if (isOnboarding) params.isOnboarding = true;

    fetchTenants(params)
      .then((result) => {
        // Only update if still fetching the same params
        if (fetchingRef.current === fetchKey) {
          setTenants(result.data, result.totalCounts);
        }
      })
      .catch(() => {
        // Interceptor shows toast
      })
      .finally(() => {
        // Only update loading if still fetching the same params
        if (fetchingRef.current === fetchKey) {
          setLoading(false);
          fetchingRef.current = null;
        }
      });
  }, [page, limit, searchText, isOnboarding, setTenants, setLoading]); // Direct dependencies

  const onSearchDebounced = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSearchText(value);
        debounceRef.current = null;
      }, DEBOUNCE_MS);
    },
    [setSearchText]
  );

  const onPageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const onLimitChange = useCallback(
    (newLimit: number) => {
      setLimit(newLimit);
    },
    [setLimit]
  );

  const onBankeloOnlyChange = useCallback(
    (checked: boolean) => {
      setIsOnboarding(checked);
    },
    [setIsOnboarding]
  );

  const handleCreateTenant = useCallback(
    async (params: CreateTenantParams) => {
      await createTenant(params);
      toastService.showSuccess('Tenant created successfully');
      loadTenants();
    },
    [loadTenants]
  );

  const handleUpdateTenant = useCallback(
    async (params: UpdateTenantParams) => {
      await updateTenant(params);
      toastService.showSuccess('Tenant updated successfully');
      loadTenants();
    },
    [loadTenants]
  );

  const handleExportBankelo = useCallback(async () => {
    try {
      const blob = await exportBankelo();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const d = new Date();
      a.download = `bankelo-tenant-${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toastService.showSuccess('Export completed');
    } catch {
      // Interceptor shows error
    }
  }, []);

  return {
    tenants,
    totalCounts,
    page,
    limit,
    searchText,
    isOnboarding,
    loading,
    loadTenants,
    onSearchDebounced,
    onPageChange,
    onLimitChange,
    onBankeloOnlyChange,
    handleCreateTenant,
    handleUpdateTenant,
    handleExportBankelo,
  };
}
