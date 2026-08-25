import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/config/constants";
import { bookingsService } from "@/services/bookings.service";
import type { BookingsListParams } from "@/types/booking.types";

/** Read-only — bookings are created by customers through the mobile app, never from the admin panel. */
export function useBookingsQuery(params: BookingsListParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.bookings, params],
    queryFn: () => bookingsService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useBookingQuery(id: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.bookingDetail(id ?? 0),
    queryFn: () => bookingsService.detail(id as number),
    enabled: id !== null,
  });
}
