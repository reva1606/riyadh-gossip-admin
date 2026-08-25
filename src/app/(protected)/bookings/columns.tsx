"use client";

import { createDataTableColumnHelper } from "@/components/data-table/columns";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
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

const STATUS_LABEL: Record<BookingStatus, string> = {
  PAID: "Paid",
  PENDING_PAYMENT: "Pending payment",
  CANCELLED: "Cancelled",
  EXPIRED: "Expired",
};

export const bookingColumns = columnHelper.columns([
  columnHelper.accessor("id", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ getValue }) => <span className="font-medium">#{getValue()}</span>,
  }),
  columnHelper.accessor((row) => `${row.user.first_name} ${row.user.last_name}`, {
    id: "user",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Event" />,
    cell: ({ getValue }) => <span>{getValue()}</span>,
    enableSorting: false,
  }),
  columnHelper.display({
    id: "tickets",
    header: "Tickets",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.tickets.length}</span>,
    enableSorting: false,
  }),
  columnHelper.accessor("total_amount", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
    cell: ({ getValue }) => currencyFormatter.format(getValue()),
  }),
  columnHelper.accessor("status", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ getValue }) => {
      const status = getValue();
      return <Badge variant={STATUS_BADGE_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
    },
  }),
  columnHelper.accessor("created_at", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Booked" />,
    cell: ({ getValue }) => dateFormatter.format(new Date(getValue())),
  }),
]);
