"use client";

import { useParams } from "next/navigation";
import { TenantDetail } from "@/features/tenant/components/TenantDetail/TenantDetail";

export default function TenantDetailPage() {
  const params = useParams();
  const tenantId =
    typeof params?.tenantId === "string" ? params.tenantId : null;

  return <TenantDetail tenantId={tenantId ?? ""} />;
}
