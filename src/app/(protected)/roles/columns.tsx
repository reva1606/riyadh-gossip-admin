"use client";

import { createDataTableColumnHelper } from "@/components/data-table/columns";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { dictionaries } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { RoleDto } from "@/types/role.types";

const columnHelper = createDataTableColumnHelper<RoleDto>();

/**
 * Permission counts are fetched per-role (small catalog, see the page's
 * `useQueries` call) and passed in here rather than kept in `RoleDto` itself.
 *
 * Column defs are built once per locale (outside React) — `useTranslation` isn't available here.
 */
export function createRoleColumns(
  locale: Locale,
  permissionCounts: Record<number, number | undefined>,
) {
  const t = dictionaries[locale].roles.table;

  return columnHelper.columns([
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t.name} />
      ),
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    }),
    columnHelper.accessor("description", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t.description} />
      ),
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue() || "—"}</span>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("is_system", {
      id: "is_system",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t.type} />
      ),
      cell: ({ getValue }) => (
        <Badge variant={getValue() ? "outline" : "secondary"}>
          {getValue() ? t.system : t.custom}
        </Badge>
      ),
      enableGlobalFilter: false,
    }),
    columnHelper.display({
      id: "permission_count",
      header: t.permissions,
      cell: ({ row }) => {
        const count = permissionCounts[row.original.id];
        return <span className="text-muted-foreground">{count ?? "…"}</span>;
      },
      enableSorting: false,
    }),
  ]);
}
