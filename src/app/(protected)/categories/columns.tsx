"use client";

import { createDataTableColumnHelper } from "@/components/data-table/columns";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { Category } from "@/types/category.types";

const columnHelper = createDataTableColumnHelper<Category>();

export const categoryColumns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
  }),
  columnHelper.accessor("description", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() || "—"}</span>,
    enableSorting: false,
  }),
]);
