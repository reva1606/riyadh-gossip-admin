"use client";

import { createDataTableColumnHelper } from "@/components/data-table/columns";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@/types/event.types";

const columnHelper = createDataTableColumnHelper<Event>();

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export const eventColumns = columnHelper.columns([
  columnHelper.accessor("title", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
  }),
  columnHelper.accessor((row) => row.category.name, {
    id: "category",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ getValue }) => <Badge variant="secondary">{getValue()}</Badge>,
    enableSorting: false,
  }),
  columnHelper.accessor("start_date", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Starts" />,
    cell: ({ getValue }) => dateFormatter.format(new Date(getValue())),
  }),
  columnHelper.accessor("location", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
    enableSorting: false,
  }),
  columnHelper.display({
    id: "ticket_classes",
    header: "Ticket classes",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.ticket_classes.length}</span>,
    enableSorting: false,
  }),
]);
