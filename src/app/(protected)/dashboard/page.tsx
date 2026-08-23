"use client";

import type { LucideIcon } from "lucide-react";
import { KeyRound, ShieldCheck, Users as UsersIcon } from "lucide-react";

import { useAuth } from "@/store/auth-context";
import { useUsersQuery } from "@/hooks/use-users";
import { useRolesQuery } from "@/hooks/use-roles";
import { usePermissionsQuery } from "@/hooks/use-permissions";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";

interface StatCardProps {
  label: string;
  value: number | undefined;
  isLoading: boolean;
  icon: LucideIcon;
}

function StatCard({ label, value, isLoading, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 py-6">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          {isLoading ? (
            <Skeleton className="mt-2 h-8 w-16" />
          ) : (
            <p className="mt-1 text-3xl font-semibold tracking-tight">{value ?? "—"}</p>
          )}
        </div>
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  // Cheap, already-available counts — a real analytics dashboard is a separate module.
  const usersQuery = useUsersQuery({ limit: 1 });
  const rolesQuery = useRolesQuery();
  const permissionsQuery = usePermissionsQuery();

  return (
    <>
      <PageHeader
        title={`Welcome back${user ? `, ${user.first_name}` : ""}`}
        description="Here's what's happening across Riyadh Gossip today."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total users"
          value={usersQuery.data?.meta.total}
          isLoading={usersQuery.isLoading}
          icon={UsersIcon}
        />
        <StatCard
          label="Roles"
          value={rolesQuery.data?.length}
          isLoading={rolesQuery.isLoading}
          icon={ShieldCheck}
        />
        <StatCard
          label="Permissions"
          value={permissionsQuery.data?.length}
          isLoading={permissionsQuery.isLoading}
          icon={KeyRound}
        />
      </div>
    </>
  );
}
