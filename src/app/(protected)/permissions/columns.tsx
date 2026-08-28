"use client";

import { createDataTableColumnHelper } from "@/components/data-table/columns";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { dictionaries } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { PermissionDto } from "@/types/role.types";

const columnHelper = createDataTableColumnHelper<PermissionDto>();

/** Column defs are built once per locale (outside React) — `useTranslation` isn't available here. */
export function getPermissionColumns(locale: Locale) {
  const t = dictionaries[locale].permissions.table;

  return columnHelper.columns([
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t.name} />
      ),
      cell: ({ getValue }) => (
        <span className="font-mono text-sm font-medium">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("module", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t.module} />
      ),
      cell: ({ getValue }) => <Badge variant="outline">{getValue()}</Badge>,
      filterFn: "equalsString",
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
  ]);
}
