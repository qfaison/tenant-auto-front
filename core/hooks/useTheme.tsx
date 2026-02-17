"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { getAntdTheme } from "../styles/antd-theme";
import type { ThemeConfig } from "antd";

const THEME_STORAGE_KEY = "tenant-dashboard-theme";

export type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  themeConfig: ThemeConfig;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    queueMicrotask(() => {
      const stored = localStorage.getItem(
        THEME_STORAGE_KEY,
      ) as ThemeMode | null;
      if (stored === "dark" || stored === "light") {
        setThemeState(stored);
      }
    });
  }, [mounted]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  const themeConfig = getAntdTheme(theme === "dark");

  const value: ThemeContextValue = {
    theme,
    setTheme,
    toggleTheme,
    themeConfig,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
