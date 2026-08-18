"use client";

import { useEffect } from "react";
import { HashRouterProvider, usePathname, useRouter } from "@/core/lib/hash-router";
import { RouteGuard } from "@/core/components/RouteGuard";
import { Navbar } from "@/shared/components/Navbar/Navbar";
import { NotFound } from "@/shared/components/NotFound";
import { LoginPage } from "@/features/auth/components/LoginPage";
import { TenantList } from "@/features/tenant/components/TenantList/TenantList";
import { TenantDetailPage } from "@/features/tenant/components/TenantDetail/TenantDetailPage";
import { useAuth } from "@/core/hooks/useAuth";
import { APP_CONSTANT } from "@/core/utils/constants";

/**
 * Angular-style hash routing: everything resolves at "/" and the view is
 * chosen from window.location.hash (e.g. /#/tenant/list). Required for
 * static export (output: 'export') so no server-side rewrite rules are
 * needed for deep links or refreshes.
 */
function AppRoutes() {
  const pathname = usePathname();

  if (pathname === `/${APP_CONSTANT.ROUTES.USER.LOGIN}`) {
    return <LoginPage />;
  }

  if (pathname === `/${APP_CONSTANT.ROUTES.TENANT.LIST}`) {
    return (
      <RouteGuard>
        <Navbar />
        <TenantList />
      </RouteGuard>
    );
  }

  if (pathname === `/${APP_CONSTANT.ROUTES.TENANT.DETAIL}`) {
    return (
      <RouteGuard>
        <Navbar />
        <TenantDetailPage />
      </RouteGuard>
    );
  }

  if (pathname === "/") {
    return <RootRedirect />;
  }

  return <NotFound />;
}

function RootRedirect() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(`/${APP_CONSTANT.ROUTES.TENANT.LIST}`);
    } else {
      router.replace(`/${APP_CONSTANT.ROUTES.USER.LOGIN}`);
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function RootPage() {
  return (
    <HashRouterProvider>
      <AppRoutes />
    </HashRouterProvider>
  );
}
