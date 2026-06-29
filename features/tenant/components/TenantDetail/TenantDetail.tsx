"use client";

import { Spin } from "antd";
import { useTenantDetail } from "../../hooks/useTenantDetail";
import { TenantTabs } from "./TenantTabs";

interface TenantDetailProps {
  tenantId: string;
}

export function TenantDetail({ tenantId }: TenantDetailProps) {
  const {
    tenant,
    webhookBaseUrl,
    loading,
    actionLoading,
    bonanzaEntriesLoading,
    handleProcessMissingBonanzaEntries,
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
    handleBankeloDocumentSubmission,
    handleUpdateWebhook,
    handleUploadAppleVerification,
    handleUpdateTenant,
  } = useTenantDetail(tenantId);

  if (!tenantId) {
    return <div style={{ padding: 24 }}>Invalid tenant ID</div>;
  }

  if (tenant === null && !loading) {
    return <div style={{ padding: 24 }}>Tenant not found.</div>;
  }

  return (
    <>
      {/* Fullscreen Loader */}
      <Spin spinning={loading} fullscreen />

      <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
        <TenantTabs
          tenant={tenant}
          webhookBaseUrl={webhookBaseUrl}
          actionLoading={actionLoading}
          bonanzaEntriesLoading={bonanzaEntriesLoading}
          onProcessMissingBonanzaEntries={handleProcessMissingBonanzaEntries}
          onBack={() => {}}
          onUpdateWebhook={handleUpdateWebhook}
          onUpdateEmail={handleUpdateEmail}
          onSetupSSL={handleSetupSSL}
          onUpdate3PL={handleUpdate3PL}
          onBPlannedProvision={handleBPlannedProvision}
          onSendWelcomeEmail={handleSendWelcomeEmail}
          onApproveCancelRequest={handleApproveCancelRequest}
          onQa3Initiate={handleQa3Initiate}
          onQa3Approve={handleQa3Approve}
          onWebhook={handleWebhook}
          onCancelAccounts={handleCancelAccounts}
          onBankeloOnboarding={handleBankeloOnboarding}
          onBankeloDocumentSubmission={handleBankeloDocumentSubmission}
          onUploadAppleVerification={handleUploadAppleVerification}
          onUpdateTenant={handleUpdateTenant}
          actions={{
            handleMakePublic,
            handleMakePrivate,
            handleStop,
            handleRestart,
          }}
        />
      </div>
    </>
  );
}
