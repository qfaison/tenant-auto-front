"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { Spin } from "antd";

/**
 * Tenant detail page - query params fallback (?tenantId=xxx).
 * Redirects to /tenant/detail/[tenantId] when tenantId is present.
 */
function TenantDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tenantId = searchParams.get("tenantId");

  useEffect(() => {
    if (tenantId) {
      router.replace(`/tenant/detail/${tenantId}`);
    }
  }, [tenantId, router]);

  if (tenantId) {
    return (
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
    );
  }

  return (
    <div style={{ padding: 24 }}>
      Missing tenantId. Use /tenant/detail/[tenantId] or ?tenantId=xxx
    </div>
  );
}

export default function TenantDetailQueryPage() {
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
