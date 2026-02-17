"use client";

import { ThemeProvider } from "@/core/hooks/useTheme";
import { AntdThemeProvider } from "@/core/providers/ThemeProvider";
import { ThemeSync } from "@/core/providers/ThemeSync";
import { AuthProvider } from "@/core/providers/AuthProvider";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
  locale?: string;
  messages?: Record<string, unknown>;
  timeZone?: string;
};

export function Providers({
  children,
  locale = "en",
  messages = {},
  timeZone = "UTC",
}: ProvidersProps) {
  return (
    <ThemeProvider>
      <ThemeSync />
      <AntdThemeProvider>
        <AuthProvider>
          <NextIntlClientProvider
            locale={locale}
            messages={messages}
            timeZone={timeZone}
          >
            {children}
          </NextIntlClientProvider>
        </AuthProvider>
      </AntdThemeProvider>
    </ThemeProvider>
  );
}
