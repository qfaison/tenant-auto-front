"use client";

import { AuthProvider as AuthContextProvider } from "../hooks/useAuth";
import type { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}
