"use client";

import { Navbar } from "@/shared/components/Navbar/Navbar";
import { RouteGuard } from "@/core/components/RouteGuard";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard>
      <Navbar />
      {children}
    </RouteGuard>
  );
}
