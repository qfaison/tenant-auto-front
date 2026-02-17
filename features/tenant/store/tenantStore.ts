"use client";

import { create } from "zustand";
import type { Tenant } from "@/shared/types/tenant";
import { APP_CONSTANT } from "@/core/utils/constants";

interface TenantState {
  tenants: Tenant[];
  totalCounts: number;
  page: number;
  limit: number;
  searchText: string;
  isOnboarding: boolean;
  loading: boolean;
  setTenants: (tenants: Tenant[], totalCounts: number) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearchText: (searchText: string) => void;
  setIsOnboarding: (isOnboarding: boolean) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const ROWS = [10, 20, 50, 100] as const;

export const defaultLimit = APP_CONSTANT.LIMIT;

export const rowOptions = ROWS;

export const useTenantStore = create<TenantState>((set) => ({
  tenants: [],
  totalCounts: 0,
  page: 1,
  limit: defaultLimit,
  searchText: "",
  isOnboarding: false,
  loading: false,
  setTenants: (tenants, totalCounts) => set({ tenants, totalCounts }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  setSearchText: (searchText) => set({ searchText, page: 1 }),
  setIsOnboarding: (isOnboarding) => set({ isOnboarding, page: 1 }),
  setLoading: (loading) => set({ loading }),
  reset: () =>
    set({
      tenants: [],
      totalCounts: 0,
      page: 1,
      limit: defaultLimit,
      searchText: "",
      isOnboarding: false,
    }),
}));
