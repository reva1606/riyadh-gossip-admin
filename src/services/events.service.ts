import { CORE_ENDPOINTS } from "@/lib/api/endpoints";
import { coreApiClient } from "@/lib/api/client";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type {
  CreateEventPayload,
  Event,
  EventsListParams,
  UpdateEventPayload,
} from "@/types/event.types";

export const eventsService = {
  list: (params: EventsListParams) =>
    coreApiClient.get<PaginatedResponse<Event>>(CORE_ENDPOINTS.events.list, { params }),

  detail: (id: number) =>
    coreApiClient
      .get<ApiResponse<Event>>(CORE_ENDPOINTS.events.detail(id))
      .then((res) => res.data),

  create: (payload: CreateEventPayload) =>
    coreApiClient
      .post<ApiResponse<Event>>(CORE_ENDPOINTS.events.list, payload)
      .then((res) => res.data),

  update: (id: number, payload: UpdateEventPayload) =>
    coreApiClient
      .patch<ApiResponse<Event>>(CORE_ENDPOINTS.events.detail(id), payload)
      .then((res) => res.data),

  remove: (id: number) =>
    coreApiClient.delete<ApiResponse<null>>(CORE_ENDPOINTS.events.detail(id)),
};
