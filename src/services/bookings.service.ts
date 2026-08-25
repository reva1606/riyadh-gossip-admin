import { CORE_ENDPOINTS } from "@/lib/api/endpoints";
import { coreApiClient } from "@/lib/api/client";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type { Booking, BookingsListParams } from "@/types/booking.types";

/** Read-only — bookings are created by customers through the mobile app, never from the admin panel. */
export const bookingsService = {
  list: (params: BookingsListParams) =>
    coreApiClient.get<PaginatedResponse<Booking>>(CORE_ENDPOINTS.bookings.list, { params }),

  detail: (id: number) =>
    coreApiClient
      .get<ApiResponse<Booking>>(CORE_ENDPOINTS.bookings.detail(id))
      .then((res) => res.data),
};
