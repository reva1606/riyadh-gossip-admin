"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/config/routes";
import { useAuth } from "@/store/auth-context";
import { Logo } from "@/components/shared/logo";

/** Gates its children behind an authenticated session; redirects to /login otherwise. */
export function ProtectedGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.login);
    }
  }, [isLoading, isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <Logo />
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
