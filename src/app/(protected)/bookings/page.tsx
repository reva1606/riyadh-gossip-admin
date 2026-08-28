"use client";

import * as React from "react";
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { PermissionGuard } from "@/components/layout/permission-guard";
import { DataTable } from "@/components/data-table/data-table";
import type { DataTableFilterConfig } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { useBookingsQuery } from "@/hooks/use-bookings";
import { useTranslation } from "@/lib/i18n/language-provider";
import type { Booking, BookingsListParams } from "@/types/booking.types";

import { getBookingColumns } from "./columns";
import { BookingDetailSheet } from "./booking-detail-sheet";

const SORTABLE_COLUMN_IDS = new Set(["id", "status", "total_amount", "created_at"]);

export default function BookingsPage() {
  return (
    <PermissionGuard permission="booking.view">
      <BookingsPageContent />
    </PermissionGuard>
  );
}

function BookingsPageContent() {
  const { t, locale } = useTranslation();
  const bookingColumns = React.useMemo(() => getBookingColumns(locale), [locale]);

  const STATUS_FILTER: DataTableFilterConfig = React.useMemo(
    () => ({
      id: "status",
      label: t("bookings.filters.statusLabel"),
      options: [
        { label: t("bookings.status.pendingPayment"), value: "PENDING_PAYMENT" },
        { label: t("bookings.status.paid"), value: "PAID" },
        { label: t("bookings.status.cancelled"), value: "CANCELLED" },
        { label: t("bookings.status.expired"), value: "EXPIRED" },
      ],
    }),
    [t],
  );

  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [selectedBookingId, setSelectedBookingId] = React.useState<number | null>(null);

  const sort = sorting[0];
  const params: BookingsListParams = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: search || undefined,
    status: (status || undefined) as BookingsListParams["status"],
    sortBy: sort && SORTABLE_COLUMN_IDS.has(sort.id) ? (sort.id as BookingsListParams["sortBy"]) : undefined,
    sortOrder: sort ? (sort.desc ? "DESC" : "ASC") : undefined,
  };

  const bookingsQuery = useBookingsQuery(params);
  const bookings = bookingsQuery.data?.data ?? [];

  function handleFilterChange(filterId: string, value: string) {
    if (filterId === "status") {
      setStatus(value);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  function handleViewBooking(booking: Booking) {
    setSelectedBookingId(booking.id);
  }

  return (
    <>
      <PageHeader title={t("bookings.title")} description={t("bookings.description")} />

      <DataTable
        mode="server"
        columns={bookingColumns}
        data={bookings}
        pageCount={bookingsQuery.data?.meta.totalPages ?? 0}
        rowCount={bookingsQuery.data?.meta.total ?? 0}
        isLoading={bookingsQuery.isLoading}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        search={search}
        onSearchChange={handleSearchChange}
        filterValues={{ status }}
        onFilterChange={handleFilterChange}
        searchPlaceholder={t("bookings.searchPlaceholder")}
        filters={[STATUS_FILTER]}
        getRowId={(row) => String(row.id)}
        totalLabel={t("bookings.totalLabel")}
        renderRowActions={(booking) => (
          <Button variant="ghost" size="icon" className="size-8" onClick={() => handleViewBooking(booking)}>
            <Eye className="size-4" />
            <span className="sr-only">{t("bookings.viewBooking")}</span>
          </Button>
        )}
      />

      <BookingDetailSheet
        bookingId={selectedBookingId}
        open={selectedBookingId !== null}
        onOpenChange={(open) => !open && setSelectedBookingId(null)}
      />
    </>
  );
}
