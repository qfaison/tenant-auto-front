"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { storageService } from "../services/storage.service";

type AuthContextValue = {
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (userData: { username: string; password: string }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => typeof window !== "undefined" && !!storageService.getToken(),
  );
  const [isInitializing, setIsInitializing] = useState(
    () => typeof window === "undefined",
  );

  useEffect(() => {
    setIsAuthenticated(!!storageService.getToken());
    setIsInitializing(false);
  }, []);

  const login = useCallback(
    (userData: { username: string; password: string }) => {
      storageService.setToken(userData);
      setIsAuthenticated(true);
    },
    [],
  );

  const logout = useCallback(() => {
    storageService.clear();
    setIsAuthenticated(false);
  }, []);

  const value: AuthContextValue = {
    isAuthenticated,
    isInitializing,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
