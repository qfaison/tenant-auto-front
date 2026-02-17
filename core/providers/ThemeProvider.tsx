"use client";

import { App, ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import { useTheme } from "../hooks/useTheme";
import type { ReactNode } from "react";
import { ToastInjector } from "./ToastInjector";

export function AntdThemeProvider({ children }: { children: ReactNode }) {
  const { themeConfig } = useTheme();
  return (
    <ConfigProvider theme={themeConfig} locale={enUS}>
      <App>
        <ToastInjector />
        {children}
      </App>
    </ConfigProvider>
  );
}
