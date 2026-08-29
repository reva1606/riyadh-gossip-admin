import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { QUERY_KEYS } from "@/config/constants";
import { toApiError } from "@/lib/api/api-error";
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

/** Fetches the invoice PDF and hands it straight to the browser's save flow — nothing to invalidate, it doesn't change booking state. */
export function useDownloadInvoiceMutation() {
  return useMutation({
    mutationFn: ({ id, locale }: { id: number; locale?: "en" | "ar" }) =>
      bookingsService.downloadInvoice(id, locale),
    onSuccess: (blob, { id, locale = "en" }) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${id}-${locale}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}
