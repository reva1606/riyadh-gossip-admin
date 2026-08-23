"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { SidebarProvider, useSidebar } from "@/store/sidebar-context";
import { Header } from "@/components/layout/header";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { MustChangePasswordBanner } from "@/components/layout/must-change-password-banner";
import { ProtectedGuard } from "@/components/layout/protected-guard";
import { Sidebar } from "@/components/layout/sidebar";

function ShellBody({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileSidebar />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[margin] duration-200",
          isCollapsed ? "lg:ml-[76px]" : "lg:ml-64",
        )}
      >
        <Header />
        <MustChangePasswordBanner />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedGuard>
      <SidebarProvider>
        <ShellBody>{children}</ShellBody>
      </SidebarProvider>
    </ProtectedGuard>
  );
}
