"use client";

import { App } from "antd";
import { useEffect } from "react";
import { toastService } from "../services/toast.service";

/**
 * Injects the context-aware message API from Ant Design App into ToastService
 * so static callers (e.g. Axios interceptors) get themed toasts.
 * Must be rendered inside antd <App>.
 */
export function ToastInjector() {
  const { message } = App.useApp();

  useEffect(() => {
    toastService.setMessageApi(message);
    return () => toastService.setMessageApi(null);
  }, [message]);

  return null;
}
