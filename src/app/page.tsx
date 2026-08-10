"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { DEFAULT_AUTHENTICATED_ROUTE, ROUTES } from "@/config/routes";
import { useAuth } from "@/store/auth-context";
import { Logo } from "@/components/shared/logo";

export default function RootPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoading) return;
    router.replace(isAuthenticated ? DEFAULT_AUTHENTICATED_ROUTE : ROUTES.login);
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <Logo />
      <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
