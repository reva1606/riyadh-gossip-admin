import type { ReactNode } from "react";

import { GuestGuard } from "@/components/layout/guest-guard";
import { Logo } from "@/components/shared/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <GuestGuard>
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-10 text-sidebar-foreground lg:flex">
          <div
            className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-primary/30 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-24 bottom-0 size-96 rounded-full bg-accent/20 blur-3xl"
            aria-hidden
          />

          <Logo />

          <div className="relative z-10 max-w-md">
            <h1 className="text-3xl font-semibold tracking-tight text-balance">
              Run the show from one dashboard.
            </h1>
            <p className="mt-3 text-sm text-sidebar-muted-foreground">
              Staff, events, tickets and bookings — everything the Glitch404 team needs to keep
              Riyadh&apos;s nightlife running, in one place.
            </p>
          </div>

          <p className="relative z-10 text-xs text-sidebar-muted-foreground">
            © {new Date().getFullYear()} Glitch404. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-8 bg-background p-6 sm:p-10">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </GuestGuard>
  );
}
