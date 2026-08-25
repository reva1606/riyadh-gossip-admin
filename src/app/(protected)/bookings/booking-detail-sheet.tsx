"use client";

import * as React from "react";

import { env } from "@/config/env";
import { useBookingQuery } from "@/hooks/use-bookings";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
  const bookingQuery = useBookingQuery(bookingId);
  const booking = bookingQuery.data;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        title={booking ? `Booking #${booking.id}` : "Booking details"}
        className="w-full gap-0 sm:max-w-lg"
      >
        <SheetHeader className="border-b border-border">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">
              {booking ? `Booking #${booking.id}` : "Booking details"}
            </h2>
            {booking && (
              <Badge variant={BOOKING_STATUS_BADGE_VARIANT[booking.status]}>{booking.status}</Badge>
            )}
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
            <p className="pt-4 text-sm text-danger">Failed to load this booking. Please try again.</p>
          ) : booking ? (
            <Tabs defaultValue="details" className="pt-4">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">
                  Details
                </TabsTrigger>
                <TabsTrigger value="tickets" className="flex-1">
                  Tickets ({booking.tickets.length})
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

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
}

function BookingDetailsPanel({ booking }: { booking: Booking }) {
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const qrUrl = booking.qr_code_url ? `${env.apiUrl}${booking.qr_code_url}` : null;

  return (
    <div className="flex flex-col gap-6">
      <section>
        <p className="mb-1 text-sm font-medium">Customer</p>
        <div className="rounded-lg border border-border p-3">
          <DetailRow
            label="Name"
            value={`${booking.user.first_name} ${booking.user.last_name}`}
          />
          <DetailRow label="Email" value={booking.user.email} />
        </div>
      </section>

      <section>
        <p className="mb-1 text-sm font-medium">Event</p>
        <div className="rounded-lg border border-border p-3">
          <DetailRow label="Title" value={booking.event.title} />
          <DetailRow label="Starts" value={dateFormatter.format(new Date(booking.event.start_date))} />
          <DetailRow label="Location" value={booking.event.location} />
        </div>
      </section>

      <section>
        <p className="mb-1 text-sm font-medium">Payment</p>
        <div className="rounded-lg border border-border p-3">
          <DetailRow
            label="Status"
            value={
              <Badge variant={PAYMENT_STATUS_BADGE_VARIANT[booking.payment.status]}>
                {booking.payment.status}
              </Badge>
            }
          />
          <DetailRow label="Method" value={booking.payment.method ?? "—"} />
          <DetailRow
            label="Paid at"
            value={booking.payment.paid_at ? dateFormatter.format(new Date(booking.payment.paid_at)) : "—"}
          />
        </div>
      </section>

      <section>
        <p className="mb-1 text-sm font-medium">Amounts</p>
        <div className="rounded-lg border border-border p-3">
          <DetailRow label="Subtotal" value={currencyFormatter.format(booking.subtotal)} />
          <DetailRow label="Discount" value={currencyFormatter.format(booking.discount_amount)} />
          <DetailRow label="Total" value={currencyFormatter.format(booking.total_amount)} />
          <DetailRow label="Promo code" value={booking.promo_code_snapshot ?? "—"} />
        </div>
      </section>

      <section>
        <p className="mb-1 text-sm font-medium">Entry</p>
        <div className="flex items-center gap-3 rounded-lg border border-border p-3">
          {qrUrl ? (
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="shrink-0 overflow-hidden rounded-md border border-border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- external, dynamic uploads URL */}
              <img src={qrUrl} alt={`QR code for booking #${booking.id}`} className="size-14 object-cover" />
            </button>
          ) : (
            <div className="flex size-14 shrink-0 items-center justify-center rounded-md border border-dashed border-border text-[10px] text-muted-foreground">
              No QR
            </div>
          )}

          <div className="flex flex-1 flex-col">
            <DetailRow
              label="Checked in"
              value={
                booking.checked_in_at
                  ? `Checked in — ${dateFormatter.format(new Date(booking.checked_in_at))}`
                  : "Not checked in yet"
              }
            />
          </div>
        </div>

        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="flex max-w-sm flex-col items-center gap-4">
            <VisuallyHidden asChild>
              <DialogTitle>Booking QR code</DialogTitle>
            </VisuallyHidden>
            {qrUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- external, dynamic uploads URL
              <img src={qrUrl} alt="Booking QR code" className="w-full rounded-md" />
            )}
          </DialogContent>
        </Dialog>
      </section>

      <section>
        <p className="mb-1 text-sm font-medium">Timing</p>
        <div className="rounded-lg border border-border p-3">
          <DetailRow label="Created" value={dateFormatter.format(new Date(booking.created_at))} />
          <DetailRow label="Updated" value={dateFormatter.format(new Date(booking.updated_at))} />
          <DetailRow label="Expires" value={dateFormatter.format(new Date(booking.expires_at))} />
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
  if (!tickets.length) {
    return <p className="pt-4 text-sm text-muted-foreground">This booking has no tickets.</p>;
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
              {currencyFormatter.format(group.price)} each
            </span>
          </div>
          <span className="text-sm font-medium">{currencyFormatter.format(group.price * group.count)}</span>
        </div>
      ))}
    </div>
  );
}
