/** Mirrors the core app's `BookingStatus` enum (GET /bookings, port 4001). */
export type BookingStatus = "PENDING_PAYMENT" | "PAID" | "CANCELLED" | "EXPIRED";

/** Mirrors the core app's `PaymentStatus` enum, as returned nested on a booking. */
export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED";

/** Minimal user snapshot the booking endpoints nest — not the full `User` shape from user.types.ts. */
export interface BookingUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

/** Minimal event snapshot the booking endpoints nest — not the full `Event` shape from event.types.ts. */
export interface BookingEvent {
  id: number;
  title: string;
  start_date: string;
  location: string;
}

/** Mirrors the core app's `TicketDto` — one entry per individual admission unit on a booking (class/price snapshot only; check-in and QR now live on the booking as a whole). */
export interface Ticket {
  id: number;
  ticket_class_id: number;
  ticket_class_name: string;
  price: number;
  created_at: string;
}

/** Mirrors the core app's `PaymentDto`, as returned nested on a booking. */
export interface Payment {
  id: number;
  amount: number;
  status: PaymentStatus;
  method: string | null;
  paid_at: string | null;
}

/** Mirrors the core app's `BookingDto` (GET /bookings, GET /bookings/:id, port 4001). Read-only in the admin panel. */
export interface Booking {
  id: number;
  user: BookingUser;
  event: BookingEvent;
  promo_code_snapshot: string | null;
  subtotal: number;
  discount_amount: number;
  total_amount: number;
  status: BookingStatus;
  expires_at: string;
  /** Relative URL under the main API's /uploads/ static prefix — prefix with env.apiUrl to render. Null until the booking is paid. */
  qr_code_url: string | null;
  /** Timestamp the booking (all its tickets, as one unit) was scanned in at the door. Null if not yet checked in. */
  checked_in_at: string | null;
  tickets: Ticket[];
  payment: Payment;
  created_at: string;
  updated_at: string;
}

export interface BookingsListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "id" | "status" | "total_amount" | "created_at";
  sortOrder?: "ASC" | "DESC";
  status?: BookingStatus;
  event_id?: number;
}
