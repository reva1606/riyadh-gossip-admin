"use client";

import * as React from "react";
import { Download, Loader2 } from "lucide-react";

import { env } from "@/config/env";
import { useBookingQuery, useDownloadInvoiceMutation } from "@/hooks/use-bookings";
import { useTranslation } from "@/lib/i18n/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { Booking, BookingStatus, PaymentStatus, Ticket } from "@/types/booking.types";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "SAR",
});

const BOOKING_STATUS_BADGE_VARIANT: Record<BookingStatus, "success" | "warning" | "danger"> = {
  PAID: "success",
  PENDING_PAYMENT: "warning",
  CANCELLED: "danger",
  EXPIRED: "danger",
};

const PAYMENT_STATUS_BADGE_VARIANT: Record<PaymentStatus, "success" | "warning" | "danger"> = {
  SUCCEEDED: "success",
  PENDING: "warning",
  FAILED: "danger",
};

interface BookingDetailSheetProps {
  bookingId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Read-only booking detail — the admin panel's first Sheet with no form or
 * mutation. Fetches fresh data by id (rather than reusing the row already
 * shown in the list) so it always reflects the current booking/ticket state.
 */
export function BookingDetailSheet({ bookingId, open, onOpenChange }: BookingDetailSheetProps) {
  const { t } = useTranslation();
  const bookingQuery = useBookingQuery(bookingId);
  const booking = bookingQuery.data;

  const STATUS_LABEL: Record<BookingStatus, string> = {
    PAID: t("bookings.status.paid"),
    PENDING_PAYMENT: t("bookings.status.pendingPayment"),
    CANCELLED: t("bookings.status.cancelled"),
    EXPIRED: t("bookings.status.expired"),
  };

  const title = booking ? t("bookings.detail.titleWithId", { id: booking.id }) : t("bookings.detail.title");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" title={title} className="w-full gap-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{title}</h2>
              {booking && (
                <Badge variant={BOOKING_STATUS_BADGE_VARIANT[booking.status]}>
                  {STATUS_LABEL[booking.status]}
                </Badge>
              )}
            </div>
            {booking && booking.status === "PAID" && <DownloadInvoiceButton bookingId={booking.id} />}
          </div>
          {booking && <p className="text-sm text-muted-foreground">{booking.event.title}</p>}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {bookingQuery.isLoading ? (
            <div className="flex flex-col gap-3 pt-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          ) : bookingQuery.isError ? (
            <p className="pt-4 text-sm text-danger">{t("bookings.detail.loadError")}</p>
          ) : booking ? (
            <Tabs defaultValue="details" className="pt-4">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">
                  {t("bookings.detail.tabs.details")}
                </TabsTrigger>
                <TabsTrigger value="tickets" className="flex-1">
                  {t("bookings.detail.tabs.tickets", { count: booking.tickets.length })}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <BookingDetailsPanel booking={booking} />
              </TabsContent>

              <TabsContent value="tickets">
                <BookingTicketsPanel tickets={booking.tickets} />
              </TabsContent>
            </Tabs>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DownloadInvoiceButton({ bookingId }: { bookingId: number }) {
  const { t } = useTranslation();
  const downloadInvoice = useDownloadInvoiceMutation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={downloadInvoice.isPending}>
          {downloadInvoice.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          {t("bookings.detail.invoice.download")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => downloadInvoice.mutate({ id: bookingId, locale: "en" })}>
          {t("bookings.invoiceLocale.english")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => downloadInvoice.mutate({ id: bookingId, locale: "ar" })}>
          {t("bookings.invoiceLocale.arabic")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-end text-sm font-medium">{value}</span>
    </div>
  );
}

function BookingDetailsPanel({ booking }: { booking: Booking }) {
  const { t } = useTranslation();
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const qrUrl = booking.qr_code_url ? `${env.apiUrl}${booking.qr_code_url}` : null;

  const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
    SUCCEEDED: t("bookings.paymentStatus.succeeded"),
    PENDING: t("bookings.paymentStatus.pending"),
    FAILED: t("bookings.paymentStatus.failed"),
  };

  return (
    <div className="flex flex-col gap-6">
      <section>
        <p className="mb-1 text-sm font-medium">{t("bookings.detail.customer.title")}</p>
        <div className="rounded-lg border border-border p-3">
          <DetailRow
            label={t("bookings.detail.customer.name")}
            value={`${booking.user.first_name} ${booking.user.last_name}`}
          />
          <DetailRow label={t("bookings.detail.customer.email")} value={booking.user.email} />
        </div>
      </section>

      <section>
        <p className="mb-1 text-sm font-medium">{t("bookings.detail.event.title")}</p>
        <div className="rounded-lg border border-border p-3">
          <DetailRow label={t("bookings.detail.event.titleLabel")} value={booking.event.title} />
          <DetailRow
            label={t("bookings.detail.event.starts")}
            value={dateFormatter.format(new Date(booking.event.start_date))}
          />
          <DetailRow label={t("bookings.detail.event.location")} value={booking.event.location} />
        </div>
      </section>

      <section>
        <p className="mb-1 text-sm font-medium">{t("bookings.detail.payment.title")}</p>
        <div className="rounded-lg border border-border p-3">
          <DetailRow
            label={t("bookings.detail.payment.status")}
            value={
              <Badge variant={PAYMENT_STATUS_BADGE_VARIANT[booking.payment.status]}>
                {PAYMENT_STATUS_LABEL[booking.payment.status]}
              </Badge>
            }
          />
          <DetailRow label={t("bookings.detail.payment.method")} value={booking.payment.method ?? "—"} />
          <DetailRow
            label={t("bookings.detail.payment.paidAt")}
            value={booking.payment.paid_at ? dateFormatter.format(new Date(booking.payment.paid_at)) : "—"}
          />
        </div>
      </section>

      <section>
        <p className="mb-1 text-sm font-medium">{t("bookings.detail.amounts.title")}</p>
        <div className="rounded-lg border border-border p-3">
          <DetailRow label={t("bookings.detail.amounts.subtotal")} value={currencyFormatter.format(booking.subtotal)} />
          <DetailRow
            label={t("bookings.detail.amounts.discount")}
            value={currencyFormatter.format(booking.discount_amount)}
          />
          <DetailRow label={t("bookings.detail.amounts.total")} value={currencyFormatter.format(booking.total_amount)} />
          <DetailRow label={t("bookings.detail.amounts.promoCode")} value={booking.promo_code_snapshot ?? "—"} />
        </div>
      </section>

      <section>
        <p className="mb-1 text-sm font-medium">{t("bookings.detail.entry.title")}</p>
        <div className="flex items-center gap-3 rounded-lg border border-border p-3">
          {qrUrl ? (
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="shrink-0 overflow-hidden rounded-md border border-border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- external, dynamic uploads URL */}
              <img
                src={qrUrl}
                alt={t("bookings.detail.entry.qrAlt", { id: booking.id })}
                className="size-14 object-cover"
              />
            </button>
          ) : (
            <div className="flex size-14 shrink-0 items-center justify-center rounded-md border border-dashed border-border text-[10px] text-muted-foreground">
              {t("bookings.detail.entry.noQr")}
            </div>
          )}

          <div className="flex flex-1 flex-col">
            <DetailRow
              label={t("bookings.detail.entry.checkedInLabel")}
              value={
                booking.checked_in_at
                  ? t("bookings.detail.entry.checkedIn", {
                      date: dateFormatter.format(new Date(booking.checked_in_at)),
                    })
                  : t("bookings.detail.entry.notCheckedIn")
              }
            />
          </div>
        </div>

        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="flex max-w-sm flex-col items-center gap-4">
            <VisuallyHidden asChild>
              <DialogTitle>{t("bookings.detail.entry.qrDialogTitle")}</DialogTitle>
            </VisuallyHidden>
            {qrUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- external, dynamic uploads URL
              <img src={qrUrl} alt={t("bookings.detail.entry.qrPreviewAlt")} className="w-full rounded-md" />
            )}
          </DialogContent>
        </Dialog>
      </section>

      <section>
        <p className="mb-1 text-sm font-medium">{t("bookings.detail.timing.title")}</p>
        <div className="rounded-lg border border-border p-3">
          <DetailRow label={t("bookings.detail.timing.created")} value={dateFormatter.format(new Date(booking.created_at))} />
          <DetailRow label={t("bookings.detail.timing.updated")} value={dateFormatter.format(new Date(booking.updated_at))} />
          <DetailRow label={t("bookings.detail.timing.expires")} value={dateFormatter.format(new Date(booking.expires_at))} />
        </div>
      </section>
    </div>
  );
}

interface TicketGroup {
  ticket_class_id: number;
  ticket_class_name: string;
  price: number;
  count: number;
}

/** Collapses the flat per-unit tickets array into one row per ticket class — the booking's single QR covers all of them together. */
function groupTickets(tickets: Ticket[]): TicketGroup[] {
  const groups = new Map<number, TicketGroup>();
  for (const ticket of tickets) {
    const existing = groups.get(ticket.ticket_class_id);
    if (existing) {
      existing.count += 1;
    } else {
      groups.set(ticket.ticket_class_id, {
        ticket_class_id: ticket.ticket_class_id,
        ticket_class_name: ticket.ticket_class_name,
        price: ticket.price,
        count: 1,
      });
    }
  }
  return Array.from(groups.values());
}

function BookingTicketsPanel({ tickets }: { tickets: Ticket[] }) {
  const { t } = useTranslation();

  if (!tickets.length) {
    return <p className="pt-4 text-sm text-muted-foreground">{t("bookings.detail.tickets.empty")}</p>;
  }

  const groups = groupTickets(tickets);

  return (
    <div className="flex flex-col gap-3 pt-4">
      {groups.map((group) => (
        <div key={group.ticket_class_id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
          <div className="flex flex-col">
            <span className="font-medium">
              {group.count}× {group.ticket_class_name}
            </span>
            <span className="text-sm text-muted-foreground">
              {currencyFormatter.format(group.price)} {t("bookings.detail.tickets.each")}
            </span>
          </div>
          <span className="text-sm font-medium">{currencyFormatter.format(group.price * group.count)}</span>
        </div>
      ))}
    </div>
  );
}
