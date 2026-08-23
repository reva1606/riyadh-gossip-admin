"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldAlert, X } from "lucide-react";

import { ROUTES } from "@/config/routes";
import { useAuth } from "@/store/auth-context";
import { Button } from "@/components/ui/button";

/** Non-blocking nudge for accounts still on a system-generated temporary password (e.g. new staff). */
export function MustChangePasswordBanner() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = React.useState(false);

  if (!user?.must_change_password || dismissed) return null;

  return (
    <div className="flex items-center gap-3 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-700 sm:px-6 dark:text-amber-400">
      <ShieldAlert className="size-4 shrink-0" />
      <p className="flex-1">
        You&apos;re signed in with a temporary password.{" "}
        <Link href={ROUTES.settings} className="font-medium underline underline-offset-2">
          Change it now
        </Link>
        .
      </p>
      <Button
        variant="ghost"
        size="icon"
        className="size-6 text-amber-700 hover:bg-amber-500/20 hover:text-amber-700 dark:text-amber-400"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
      >
        <X className="size-3.5" />
      </Button>
    </div>
  );
}
