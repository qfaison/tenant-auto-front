"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Spin } from "antd";
import { TenantDetail } from "@/features/tenant/components/TenantDetail/TenantDetail";

/**
 * Tenant detail page - reads tenantId from query (?tenantId=xxx).
 * Renders TenantDetail for the given tenant; no dynamic route.
 */
function TenantDetailContent() {
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId");

  if (!tenantId) {
    return (
      <div style={{ padding: 24 }}>
        Missing tenantId. Use /tenant/detail?tenantId=xxx
      </div>
    );
  }

  return <TenantDetail tenantId={tenantId} />;
}

export default function TenantDetailPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            padding: 24,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 200,
          }}
        >
          <Spin size="large" />
        </div>
      }
    >
      <TenantDetailContent />
    </Suspense>
  );
}
