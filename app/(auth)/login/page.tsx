"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/core/hooks/useAuth";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { APP_CONSTANT } from "@/core/utils/constants";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    if (isInitializing || !isAuthenticated) return;
    const from = searchParams.get("from");
    router.replace(from || `/${APP_CONSTANT.ROUTES.TENANT.LIST}`);
  }, [isAuthenticated, isInitializing, router, searchParams]);

  return (
    <div className="auth-page-bg min-h-screen flex items-center justify-center p-4 md:p-6 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
