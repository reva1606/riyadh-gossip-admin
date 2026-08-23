"use client";

import { createDataTableColumnHelper } from "@/components/data-table/columns";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import type { PermissionDto } from "@/types/role.types";

const columnHelper = createDataTableColumnHelper<PermissionDto>();

export const permissionColumns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ getValue }) => <span className="font-mono text-sm font-medium">{getValue()}</span>,
  }),
  columnHelper.accessor("module", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Module" />,
    cell: ({ getValue }) => <Badge variant="outline">{getValue()}</Badge>,
    filterFn: "equalsString",
  }),
  columnHelper.accessor("description", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() || "—"}</span>,
    enableSorting: false,
  }),
]);
