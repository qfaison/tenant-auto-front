"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/hooks/useAuth";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { APP_CONSTANT } from "@/core/utils/constants";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(`/${APP_CONSTANT.ROUTES.TENANT.LIST}`);
    }
  }, [isAuthenticated, router]);

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
