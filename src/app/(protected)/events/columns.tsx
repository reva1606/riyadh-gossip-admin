"use client";

import { createDataTableColumnHelper } from "@/components/data-table/columns";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { dictionaries } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { Event } from "@/types/event.types";

const columnHelper = createDataTableColumnHelper<Event>();

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const STATUS_BADGE_VARIANT = {
  SCHEDULED: "success",
  CANCELLED: "danger",
} as const;

/** Column defs are built once per locale (outside React) — `useTranslation` isn't available here. */
export function getEventColumns(locale: Locale) {
  const t = dictionaries[locale].events.table;
  const statusLabels = dictionaries[locale].events.status;
  const STATUS_LABEL = {
    SCHEDULED: statusLabels.scheduled,
    CANCELLED: statusLabels.cancelled,
  } as const;

  return columnHelper.columns([
    columnHelper.accessor("title", {
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.title} />,
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    }),
    columnHelper.accessor((row) => row.category.name, {
      id: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.category} />,
      cell: ({ getValue }) => <Badge variant="secondary">{getValue()}</Badge>,
      enableSorting: false,
    }),
    columnHelper.accessor("start_date", {
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.starts} />,
      cell: ({ getValue }) => dateFormatter.format(new Date(getValue())),
    }),
    columnHelper.accessor("location", {
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.location} />,
      cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
      enableSorting: false,
    }),
    columnHelper.display({
      id: "ticket_classes",
      header: t.ticketClasses,
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.ticket_classes.length}</span>,
      enableSorting: false,
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.status} />,
      cell: ({ getValue }) => {
        const status = getValue();
        return <Badge variant={STATUS_BADGE_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
      },
      enableSorting: false,
    }),
  ]);
}
