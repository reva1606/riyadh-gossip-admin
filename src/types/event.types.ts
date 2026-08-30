import type { Category } from "./category.types";

export type EventStatus = "SCHEDULED" | "CANCELLED";

/** Mirrors the core app's `EventTicketClass` entity as returned nested on an event. */
export interface TicketClass {
  id: number;
  event_id: number;
  name: string;
  price: number;
  count: number;
  created_at: string;
  updated_at: string;
}

/** Mirrors the core app's `EventImage` entity as returned nested on an event. */
export interface EventImage {
  id: number;
  event_id: number;
  /** Relative URL under the main API's /uploads/ static prefix — prefix with env.apiUrl to render. */
  url: string;
  created_at: string;
}

/** Mirrors the core app's `EventDto` (GET/POST/PATCH /events, port 4001). */
export interface Event {
  id: number;
  title: string;
  title_ar: string | null;
  description: string;
  description_ar: string | null;
  start_date: string;
  end_date: string;
  category_id: number;
  category: Category;
  location: string;
  location_ar: string | null;
  latitude: number;
  longitude: number;
  how_to_get_there: string;
  how_to_get_there_ar: string | null;
  ticket_classes: TicketClass[];
  images: EventImage[];
  status: EventStatus;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Mirrors the core app's `CancelEventResultDto` (POST /events/:id/cancel). */
export interface CancelEventResult {
  event: Event;
  cancelled_bookings_count: number;
  refunded_bookings_count: number;
  total_refund_amount: number;
}

/** `id` present means "update this existing ticket class", absent means "insert new". */
export interface TicketClassPayload {
  id?: number;
  name: string;
  price: number;
  count: number;
}

export interface CreateEventPayload {
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  start_date: string;
  end_date: string;
  category_id: number;
  location: string;
  location_ar?: string;
  latitude: number;
  longitude: number;
  how_to_get_there: string;
  how_to_get_there_ar?: string;
  ticket_classes: TicketClassPayload[];
  image_urls?: string[];
}

/** If provided, `ticket_classes`/`image_urls` replace the event's full set — see the core app's EventsService. */
export interface UpdateEventPayload {
  title?: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  start_date?: string;
  end_date?: string;
  category_id?: number;
  location?: string;
  location_ar?: string;
  latitude?: number;
  longitude?: number;
  how_to_get_there?: string;
  how_to_get_there_ar?: string;
  ticket_classes?: TicketClassPayload[];
  image_urls?: string[];
}

export interface EventsListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "id" | "title" | "start_date" | "created_at";
  sortOrder?: "ASC" | "DESC";
  category_id?: number;
}
