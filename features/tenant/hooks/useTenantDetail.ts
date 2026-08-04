'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Tenant } from '@/shared/types/tenant';
import {
  fetchTenant,
  fetchWebhook,
  updateWebhook,
  makeTenantPublic,
  makeTenantPrivate,
  stopTenant,
  restartTenant,
  sendWelcomeEmail,
  updateTenantEmail,
  setupTenantSSL,
  updateTenantPassword,
  updateTenant3PL,
  bPlannedProvision,
  approveCancelRequest,
  qa3CancelInitiate,
  qa3CancelApprove,
  bankeloOnboarding,
  bankeloOnboardingDocument,
  uploadAppleVerificationFile,
  updateTenant,
  processMissingBonanzaEntries,
} from '../services/tenant.service';
import type { UpdateTenantParams } from '../services/tenant.service';
import { toastService } from '@/core/services/toast.service';

export function useTenantDetail(tenantId: string | null) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [webhookBaseUrl, setWebhookBaseUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [bonanzaEntriesLoading, setBonanzaEntriesLoading] = useState(false);

  // Refs to prevent duplicate API calls
  const fetchingTenantRef = useRef<string | null>(null);
  const fetchedWebhookRef = useRef(false);

  // Fix: Depend directly on tenantId instead of callback to prevent duplicate calls
  useEffect(() => {
    if (!tenantId) {
      setTenant(null);
      setLoading(false);
      return;
    }

    // Prevent duplicate calls for same tenantId
    if (fetchingTenantRef.current === tenantId) return;

    fetchingTenantRef.current = tenantId;
    setLoading(true);

    fetchTenant(tenantId)
      .then((data) => {
        // Only update if still fetching the same tenantId
        if (fetchingTenantRef.current === tenantId) {
          setTenant(data);
        }
      })
      .catch(() => {
        // Only update if still fetching the same tenantId
        if (fetchingTenantRef.current === tenantId) {
          setTenant(null);
        }
      })
      .finally(() => {
        // Only update loading if still fetching the same tenantId
        if (fetchingTenantRef.current === tenantId) {
          setLoading(false);
          fetchingTenantRef.current = null;
        }
      });
  }, [tenantId]); // Direct dependency on tenantId

  // Fix: Fetch webhook only once using ref
  useEffect(() => {
    if (fetchedWebhookRef.current) return;

    fetchedWebhookRef.current = true;
    fetchWebhook()
      .then((res) => {
        setWebhookBaseUrl(res.baseUrl ?? '');
      })
      .catch(() => {
        setWebhookBaseUrl('');
      });
  }, []); // Empty deps - fetch once on mount

  // Keep loadTenant for use in runAction (for refetching after actions)
  const loadTenant = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    try {
      const data = await fetchTenant(tenantId);
      setTenant(data);
    } catch {
      setTenant(null);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  const handleProcessMissingBonanzaEntries = useCallback(async () => {
    if (!tenant?.tenantId) return;

    setBonanzaEntriesLoading(true);
    try {
      const result = await processMissingBonanzaEntries(tenant.tenantId);
      await loadTenant();
      toastService.showSuccess(
        result.processedEntries.length > 0
          ? 'Bonanza users created successfully'
          : 'Bonanza and Booth users are already created'
      );
    } finally {
      setBonanzaEntriesLoading(false);
    }
  }, [tenant?.tenantId, loadTenant]);

  const loadWebhook = useCallback(async () => {
    try {
      const res = await fetchWebhook();
      setWebhookBaseUrl(res.baseUrl ?? '');
    } catch {
      setWebhookBaseUrl('');
    }
  }, []);

  const runAction = useCallback(
    async (fn: () => Promise<unknown>, successMsg: string) => {
      setActionLoading(true);
      try {
        const response = await fn();
        // Extract message from API response if available, otherwise use fallback
        const message = (response as { message?: string; response?: { message?: string } })?.message
          || (response as { response?: { message?: string } })?.response?.message
          || successMsg;
        toastService.showSuccess(message);
        loadTenant();
      } catch (error: unknown) {
        // Error toast is already handled by axios interceptor, so we don't show it here to avoid duplicates
        // The interceptor has already shown the error toast, so we just need to handle the error silently
      } finally {
        setActionLoading(false);
      }
    },
    [loadTenant]
  );

  const handleMakePublic = useCallback(() => {
    if (!tenant?.tenantId) return;
    runAction(() => makeTenantPublic(tenant.tenantId), 'Made public successfully');
  }, [tenant?.tenantId, runAction]);

  const handleMakePrivate = useCallback(() => {
    if (!tenant?.tenantId) return;
    runAction(() => makeTenantPrivate(tenant.tenantId), 'Made private successfully');
  }, [tenant?.tenantId, runAction]);

  const handleStop = useCallback(() => {
    if (!tenant?.tenantId) return;
    runAction(() => stopTenant(tenant.tenantId, tenant.api ?? tenant.apiKey), 'Tenant stopped');
  }, [tenant, runAction]);

  const handleRestart = useCallback(() => {
    if (!tenant?.tenantId) return;
    runAction(() => restartTenant(tenant.tenantId), 'Tenant restarted');
  }, [tenant?.tenantId, runAction]);

  const handleSendWelcomeEmail = useCallback(() => {
    if (!tenant?.tenantId) return;
    runAction(() => sendWelcomeEmail(tenant.tenantId), 'Welcome email sent');
  }, [tenant?.tenantId, runAction]);

  const handleUpdateEmail = useCallback(
    async (email: string) => {
      if (!tenant?.tenantId) return;
      await runAction(() => updateTenantEmail(tenant.tenantId, email), 'Email updated');
      setTenant((prev) => (prev ? { ...prev, email } : null));
    },
    [tenant?.tenantId, runAction]
  );

  const handleSetupSSL = useCallback(() => {
    if (!tenant?.tenantId) return;
    runAction(() => setupTenantSSL(tenant.tenantId), 'SSL setup initiated');
  }, [tenant?.tenantId, runAction]);

  const handleUpdatePassword = useCallback(async () => {
    if (!tenant?.tenantId) return;

    setActionLoading(true);
    try {
      const response = await updateTenantPassword(tenant.tenantId);
      const body = (response as { body?: { status?: string }; message?: string })?.body;
      const message = (response as { message?: string })?.message || 'Password update scheduled';

      if (body?.status === 'SUCCEEDED') {
        toastService.showWarning('Password is already updated');
      } else {
        toastService.showSuccess(message);
      }
      loadTenant();
    } finally {
      setActionLoading(false);
    }
  }, [tenant?.tenantId, loadTenant]);

  const handleUpdate3PL = useCallback(
    async (threePL: string) => {
      if (!tenant?.tenantId) return;
      await runAction(() => updateTenant3PL(tenant.tenantId, threePL), '3PL updated');
      setTenant((prev) => (prev ? { ...prev, threePL } : null));
    },
    [tenant?.tenantId, runAction]
  );

  const handleBPlannedProvision = useCallback(() => {
    if (!tenant?.tenantId) return;
    runAction(() => bPlannedProvision(tenant.tenantId), 'BPlanned provision successful');
  }, [tenant?.tenantId, runAction]);

  const handleApproveCancelRequest = useCallback(() => {
    if (!tenant?.tenantId) return;
    runAction(() => approveCancelRequest(tenant.tenantId), 'Cancel request approved');
  }, [tenant?.tenantId, runAction]);

  const handleQa3Initiate = useCallback(() => {
    if (!tenant?.tenantId) return;
    runAction(() => qa3CancelInitiate(tenant.tenantId), 'Initiated');
  }, [tenant?.tenantId, runAction]);

  const handleQa3Approve = useCallback(() => {
    if (!tenant?.tenantId) return;
    runAction(() => qa3CancelApprove(tenant.tenantId), 'Approved');
  }, [tenant?.tenantId, runAction]);

  const handleWebhook = useCallback(() => {
    if (!tenant?.tenantId) return;
    runAction(() => qa3CancelInitiate(tenant.tenantId), 'Webhook initiated successfully');
  }, [tenant?.tenantId, runAction]);

  const handleCancelAccounts = useCallback(() => {
    if (!tenant?.tenantId) return;
    runAction(() => qa3CancelApprove(tenant.tenantId), 'Cancel accounts approved successfully');
  }, [tenant?.tenantId, runAction]);

  const handleBankeloOnboarding = useCallback(() => {
    if (!tenant?.tenantId) return;
    runAction(() => bankeloOnboarding(tenant.tenantId), 'Bankelo onboarding submitted');
  }, [tenant?.tenantId, runAction]);

  const handleBankeloDocumentSubmission = useCallback(
    async (documentType: string) => {
      if (!tenant?.tenantId) return;
      setActionLoading(true);
      try {
        const response = await bankeloOnboardingDocument(tenant.tenantId, documentType);
        const message = (response as { message?: string; messsage?: string; response?: { message?: string } })?.message
          || (response as { messsage?: string })?.messsage
          || (response as { response?: { message?: string } })?.response?.message
          || 'Document submitted for approval';
        toastService.showSuccess(message);
      } finally {
        setActionLoading(false);
      }
    },
    [tenant?.tenantId]
  );

  const handleUpdateWebhook = useCallback(
    async (baseUrl: string) => {
      setActionLoading(true);
      try {
        const response = await updateWebhook(baseUrl);
        // Extract message from API response if available, otherwise use fallback
        const message = (response as { message?: string; response?: { message?: string } })?.message
          || (response as { response?: { message?: string } })?.response?.message
          || 'Webhook updated';
        toastService.showSuccess(message);
        setWebhookBaseUrl(baseUrl);
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  const handleUploadAppleVerification = useCallback(
    async (file: File) => {
      if (!tenant?.tenantId) return;
      setActionLoading(true);
      try {
        const response = await uploadAppleVerificationFile(tenant.tenantId, file);
        const message = (response as { message?: string; response?: { message?: string } })?.message
          || (response as { response?: { message?: string } })?.response?.message
          || 'File uploaded successfully';
        toastService.showSuccess(message);
      } finally {
        setActionLoading(false);
      }
    },
    [tenant?.tenantId]
  );

  const handleUpdateTenant = useCallback(
    async (params: UpdateTenantParams) => {
      await runAction(() => updateTenant(params), 'Tenant updated successfully');
    },
    [runAction]
  );

  return {
    tenant,
    webhookBaseUrl,
    loading,
    actionLoading,
    bonanzaEntriesLoading,
    handleUpdatePassword,
    handleProcessMissingBonanzaEntries,
    loadTenant,
    loadWebhook,
    handleMakePublic,
    handleMakePrivate,
    handleStop,
    handleRestart,
    handleSendWelcomeEmail,
    handleUpdateEmail,
    handleSetupSSL,
    handleUpdate3PL,
    handleBPlannedProvision,
    handleApproveCancelRequest,
    handleQa3Initiate,
    handleQa3Approve,
    handleWebhook,
    handleCancelAccounts,
    handleBankeloOnboarding,
    handleUpdateWebhook,
    handleUploadAppleVerification,
    handleUpdateTenant,
    handleBankeloDocumentSubmission,
  };
}
