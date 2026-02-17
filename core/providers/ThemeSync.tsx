"use client";

import { useEffect } from "react";
import { useTheme } from "../hooks/useTheme";

/**
 * Syncs theme from context to document for CSS (data-theme) and avoids hydration mismatch.
 */
export function ThemeSync() {
  const { theme } = useTheme();

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return null;
}
