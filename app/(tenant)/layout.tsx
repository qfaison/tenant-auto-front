"use client";

import { Navbar } from "@/shared/components/Navbar/Navbar";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
