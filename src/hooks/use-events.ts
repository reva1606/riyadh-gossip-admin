import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { QUERY_KEYS } from "@/config/constants";
import { toApiError } from "@/lib/api/api-error";
import { eventsService } from "@/services/events.service";
import type { CreateEventPayload, EventsListParams, UpdateEventPayload } from "@/types/event.types";

export function useEventsQuery(params: EventsListParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.events, params],
    queryFn: () => eventsService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useEventQuery(id: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.eventDetail(id ?? 0),
    queryFn: () => eventsService.detail(id as number),
    enabled: id !== null,
  });
}

export function useCreateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEventPayload) => eventsService.create(payload),
    onSuccess: () => {
      toast.success("Event created.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}

export function useUpdateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateEventPayload }) =>
      eventsService.update(id, payload),
    onSuccess: () => {
      toast.success("Event updated.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}

export function useDeleteEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eventsService.remove(id),
    onSuccess: () => {
      toast.success("Event deleted.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}

export function useCancelEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eventsService.cancel(id),
    onSuccess: (result) => {
      toast.success(
        result.refunded_bookings_count > 0
          ? `Event cancelled. ${result.refunded_bookings_count} booking(s) refunded (${result.total_refund_amount.toFixed(2)} SAR).`
          : "Event cancelled.",
      );
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookings });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}
