"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { DEFAULT_AUTHENTICATED_ROUTE } from "@/config/routes";
import { useAuth } from "@/store/auth-context";

/** Opposite of ProtectedGuard — bounces an already-authenticated user away from /login etc. */
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(DEFAULT_AUTHENTICATED_ROUTE);
    }
  }, [isLoading, isAuthenticated, router]);

  return <>{children}</>;
}
