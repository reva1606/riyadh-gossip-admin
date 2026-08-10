"use client";

import { LayoutDashboard } from "lucide-react";

import { useAuth } from "@/store/auth-context";
import { ComingSoon } from "@/components/shared/coming-soon";
import { PageHeader } from "@/components/shared/page-header";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <PageHeader
        title={`Welcome back${user ? `, ${user.firstName}` : ""}`}
        description="Here's what's happening across Glitch404 today."
      />
      <ComingSoon
        icon={LayoutDashboard}
        title="Dashboard widgets are next"
        description="Statistics cards, recent ticket sales, bookings and quick actions land in the next module."
      />
    </>
  );
}
