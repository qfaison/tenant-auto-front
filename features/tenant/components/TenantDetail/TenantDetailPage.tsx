"use client";

import { useSearchParams } from "@/core/lib/hash-router";
import { TenantDetail } from "./TenantDetail";

/**
 * Tenant detail route - reads tenantId from the hash query (?tenantId=xxx).
 */
export function TenantDetailPage() {
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
