"use client";

import * as React from "react";

import { PageHeader } from "@/components/shared/page-header";
import { PermissionGuard } from "@/components/layout/permission-guard";
import { DataTable } from "@/components/data-table/data-table";
import type { DataTableFilterConfig } from "@/components/data-table/data-table-toolbar";
import { usePermissionsQuery } from "@/hooks/use-permissions";

import { permissionColumns } from "./columns";

// Stable reference so a `data ?? EMPTY_DATA` fallback doesn't invalidate
// memoized work (or the table's own row models) on every render.
const EMPTY_DATA: never[] = [];

export default function PermissionsPage() {
  return (
    <PermissionGuard permission="permission.view">
      <PermissionsPageContent />
    </PermissionGuard>
  );
}

function PermissionsPageContent() {
  const permissionsQuery = usePermissionsQuery();
  const data = permissionsQuery.data ?? EMPTY_DATA;

  const moduleFilter: DataTableFilterConfig = React.useMemo(() => {
    const modules = Array.from(new Set(data.map((permission) => permission.module))).sort();
    return {
      id: "module",
      label: "Module",
      options: modules.map((module) => ({ label: module, value: module })),
    };
  }, [data]);

  return (
    <>
      <PageHeader title="Permissions" description="The full catalog of permissions roles can be granted." />

      <DataTable
        mode="client"
        columns={permissionColumns}
        data={data}
        isLoading={permissionsQuery.isLoading}
        searchPlaceholder="Search permissions…"
        filters={[moduleFilter]}
        totalLabel="Permissions"
        getRowId={(row) => String(row.id)}
      />
    </>
  );
}
