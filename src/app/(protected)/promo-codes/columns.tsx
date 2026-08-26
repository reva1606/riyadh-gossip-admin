"use client";

import { createDataTableColumnHelper } from "@/components/data-table/columns";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import type { PromoCode } from "@/types/promo-code.types";

const columnHelper = createDataTableColumnHelper<PromoCode>();

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

function formatDate(value: string | null) {
  return value ? dateFormatter.format(new Date(value)) : "—";
}

export const promoCodeColumns = columnHelper.columns([
  columnHelper.accessor("code", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
    cell: ({ row }) => (
      <div>
        <span className="font-medium">{row.original.code}</span>
        <span className="block text-xs text-muted-foreground">{row.original.name}</span>
      </div>
    ),
  }),
  columnHelper.display({
    id: "discount",
    header: "Discount",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <Badge variant="outline">{row.original.type === "PERCENTAGE" ? "Percentage" : "Fixed"}</Badge>
        <span className="text-muted-foreground">
          {row.original.type === "PERCENTAGE" ? `${row.original.value}%` : row.original.value}
        </span>
      </div>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor("valid_from", {
    id: "valid_from",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Valid from" />,
    cell: ({ getValue }) => <span className="text-muted-foreground">{formatDate(getValue())}</span>,
  }),
  columnHelper.accessor("valid_until", {
    id: "valid_until",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Valid until" />,
    cell: ({ getValue }) => <span className="text-muted-foreground">{formatDate(getValue())}</span>,
  }),
  columnHelper.display({
    id: "usage",
    header: "Usage",
    cell: ({ row }) =>
      row.original.max_uses == null ? (
        <span className="text-muted-foreground">{row.original.used_count} used · unlimited</span>
      ) : (
        <Badge variant={row.original.used_count >= row.original.max_uses ? "secondary" : "outline"}>
          {row.original.used_count} / {row.original.max_uses}
        </Badge>
      ),
    enableSorting: false,
  }),
  columnHelper.accessor("is_active", {
    id: "is_active",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ getValue }) => (
      <Badge variant={getValue() ? "success" : "secondary"}>{getValue() ? "Active" : "Inactive"}</Badge>
    ),
  }),
  columnHelper.display({
    id: "users",
    header: "Users",
    cell: ({ row }) =>
      row.original.users.length === 0 ? (
        <span className="text-muted-foreground">All users</span>
      ) : (
        <Badge variant="secondary">{row.original.users.length} user(s)</Badge>
      ),
    enableSorting: false,
  }),
  columnHelper.display({
    id: "events",
    header: "Events",
    cell: ({ row }) =>
      row.original.events.length === 0 ? (
        <span className="text-muted-foreground">All events</span>
      ) : (
        <Badge variant="secondary">{row.original.events.length} event(s)</Badge>
      ),
    enableSorting: false,
  }),
]);
