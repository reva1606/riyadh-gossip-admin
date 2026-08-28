"use client";

import { createDataTableColumnHelper } from "@/components/data-table/columns";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { dictionaries } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { Booking, BookingStatus } from "@/types/booking.types";

const columnHelper = createDataTableColumnHelper<Booking>();

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "SAR",
});

const STATUS_BADGE_VARIANT: Record<BookingStatus, "success" | "warning" | "danger"> = {
  PAID: "success",
  PENDING_PAYMENT: "warning",
  CANCELLED: "danger",
  EXPIRED: "danger",
};

/** Column defs are built once per locale (outside React) — `useTranslation` isn't available here. */
export function getBookingColumns(locale: Locale) {
  const t = dictionaries[locale].bookings;

  const STATUS_LABEL: Record<BookingStatus, string> = {
    PAID: t.status.paid,
    PENDING_PAYMENT: t.status.pendingPayment,
    CANCELLED: t.status.cancelled,
    EXPIRED: t.status.expired,
  };

  return columnHelper.columns([
    columnHelper.accessor("id", {
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.table.id} />,
      cell: ({ getValue }) => <span className="font-medium">#{getValue()}</span>,
    }),
    columnHelper.accessor((row) => `${row.user.first_name} ${row.user.last_name}`, {
      id: "user",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.table.customer} />,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">
            {row.original.user.first_name} {row.original.user.last_name}
          </span>
          <span className="text-sm text-muted-foreground">{row.original.user.email}</span>
        </div>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor((row) => row.event.title, {
      id: "event",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.table.event} />,
      cell: ({ getValue }) => <span>{getValue()}</span>,
      enableSorting: false,
    }),
    columnHelper.display({
      id: "tickets",
      header: t.table.tickets,
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.tickets.length}</span>,
      enableSorting: false,
    }),
    columnHelper.accessor("total_amount", {
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.table.total} />,
      cell: ({ getValue }) => currencyFormatter.format(getValue()),
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.table.status} />,
      cell: ({ getValue }) => {
        const status = getValue();
        return <Badge variant={STATUS_BADGE_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
      },
    }),
    columnHelper.accessor("created_at", {
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.table.booked} />,
      cell: ({ getValue }) => dateFormatter.format(new Date(getValue())),
    }),
  ]);
}
