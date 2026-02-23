"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/core/hooks/useAuth";
import { APP_CONSTANT } from "@/core/utils/constants";

/**
 * Client-side route guard when middleware is disabled (e.g. static export).
 */
export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (pathname?.startsWith("/tenant") && !isAuthenticated) {
      const loginPath = `/${APP_CONSTANT.ROUTES.USER.LOGIN}`;
      const currentPath = pathname || "/";
      router.replace(`${loginPath}?from=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthenticated, pathname, router]);

  if (pathname?.startsWith("/tenant") && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
