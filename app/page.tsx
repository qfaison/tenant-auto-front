"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/hooks/useAuth";
import { APP_CONSTANT } from "@/core/utils/constants";

/**
 * Root page - client-side redirect (used when middleware is disabled for static export).
 */
export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    if (isInitializing) return;
    if (isAuthenticated) {
      router.replace(`/${APP_CONSTANT.ROUTES.TENANT.LIST}`);
    } else {
      router.replace(`/${APP_CONSTANT.ROUTES.USER.LOGIN}`);
    }
  }, [isAuthenticated, isInitializing, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
