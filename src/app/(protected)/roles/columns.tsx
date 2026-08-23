"use client";

import { createDataTableColumnHelper } from "@/components/data-table/columns";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import type { RoleDto } from "@/types/role.types";

const columnHelper = createDataTableColumnHelper<RoleDto>();

/**
 * Permission counts are fetched per-role (small catalog, see the page's
 * `useQueries` call) and passed in here rather than kept in `RoleDto` itself.
 */
export function createRoleColumns(permissionCounts: Record<number, number | undefined>) {
  return columnHelper.columns([
    columnHelper.accessor("name", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    }),
    columnHelper.accessor("description", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
      cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() || "—"}</span>,
      enableSorting: false,
    }),
    columnHelper.accessor("is_system", {
      id: "is_system",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ getValue }) => (
        <Badge variant={getValue() ? "outline" : "secondary"}>{getValue() ? "System" : "Custom"}</Badge>
      ),
      enableGlobalFilter: false,
    }),
    columnHelper.display({
      id: "permission_count",
      header: "Permissions",
      cell: ({ row }) => {
        const count = permissionCounts[row.original.id];
        return <span className="text-muted-foreground">{count ?? "…"}</span>;
      },
      enableSorting: false,
    }),
  ]);
}
