/**
 * Toast service using Ant Design message API
 * Migrated from Angular ToastService (Bootstrap toasts → Ant Design message)
 * Uses context-aware message from App.useApp() when set via setMessageApi().
 */
import type { MessageInstance } from 'antd/es/message/interface';

export class ToastService {
  private messageApi: MessageInstance | null = null;

  setMessageApi(api: MessageInstance | null): void {
    this.messageApi = api;
  }

  showSuccess(msg: string): void {
    this.messageApi?.success(msg);
  }

  showError(msg: string): void {
    this.messageApi?.error(msg);
  }

  showWarning(msg: string): void {
    this.messageApi?.warning(msg);
  }

  showStandard(msg: string): void {
    this.messageApi?.info(msg);
  }

  show(msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    this.messageApi?.[type](msg);
  }
}

export const toastService = new ToastService();
