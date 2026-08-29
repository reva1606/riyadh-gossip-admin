import { AxiosError } from "axios";

import { CORE_ENDPOINTS } from "@/lib/api/endpoints";
import { coreApiClient } from "@/lib/api/client";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type { Booking, BookingsListParams } from "@/types/booking.types";

// With `responseType: "blob"`, a non-2xx response also arrives as a Blob
// (axios doesn't know it's JSON until read) — swap it back to parsed JSON
// so toApiError can still pull out the backend's `message`.
async function parseBlobError(error: unknown): Promise<never> {
  if (error instanceof AxiosError && error.response?.data instanceof Blob) {
    try {
      error.response.data = JSON.parse(await error.response.data.text());
    } catch {
      // Non-JSON body — leave as-is, toApiError falls back to axios's own message.
    }
  }
  throw error;
}

/** Read-only — bookings are created by customers through the mobile app, never from the admin panel. */
export const bookingsService = {
  list: (params: BookingsListParams) =>
    coreApiClient.get<PaginatedResponse<Booking>>(CORE_ENDPOINTS.bookings.list, { params }),

  detail: (id: number) =>
    coreApiClient
      .get<ApiResponse<Booking>>(CORE_ENDPOINTS.bookings.detail(id))
      .then((res) => res.data),

  downloadInvoice: (id: number, locale: "en" | "ar" = "en") =>
    coreApiClient
      .get<Blob>(CORE_ENDPOINTS.bookings.invoice(id), {
        params: { locale },
        responseType: "blob",
      })
      .catch(parseBlobError),
};
