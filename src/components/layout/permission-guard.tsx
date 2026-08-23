"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/config/routes";
import { useAuth } from "@/store/auth-context";

/**
 * Gates a page's content behind a specific permission (on top of
 * ProtectedGuard's auth-only check in the layout above it) — redirects to
 * the dashboard if the current user lacks it. The backend enforces the
 * real authorization on every request regardless; this only prevents a
 * broken/erroring page from rendering for someone who can't use it.
 */
export function PermissionGuard({
  permission,
  children,
}: {
  permission: string;
  children: React.ReactNode;
}) {
  const { hasPermission, isLoading } = useAuth();
  const router = useRouter();
  const allowed = hasPermission(permission);

  React.useEffect(() => {
    if (!isLoading && !allowed) {
      router.replace(ROUTES.dashboard);
    }
  }, [isLoading, allowed, router]);

  if (isLoading || !allowed) {
    return null;
  }

  return <>{children}</>;
}
