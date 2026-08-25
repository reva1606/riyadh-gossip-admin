import { CORE_ENDPOINTS } from "@/lib/api/endpoints";
import { coreApiClient } from "@/lib/api/client";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type {
  CreatePromoCodePayload,
  PromoCode,
  PromoCodesListParams,
  PromoCodeValidateResult,
  UpdatePromoCodePayload,
  ValidatePromoCodePayload,
} from "@/types/promo-code.types";

export const promoCodesService = {
  list: (params: PromoCodesListParams) =>
    coreApiClient.get<PaginatedResponse<PromoCode>>(CORE_ENDPOINTS.promoCodes.list, { params }),

  detail: (id: number) =>
    coreApiClient
      .get<ApiResponse<PromoCode>>(CORE_ENDPOINTS.promoCodes.detail(id))
      .then((res) => res.data),

  create: (payload: CreatePromoCodePayload) =>
    coreApiClient
      .post<ApiResponse<PromoCode>>(CORE_ENDPOINTS.promoCodes.list, payload)
      .then((res) => res.data),

  update: (id: number, payload: UpdatePromoCodePayload) =>
    coreApiClient
      .patch<ApiResponse<PromoCode>>(CORE_ENDPOINTS.promoCodes.detail(id), payload)
      .then((res) => res.data),

  remove: (id: number) =>
    coreApiClient.delete<ApiResponse<null>>(CORE_ENDPOINTS.promoCodes.detail(id)),

  activate: (id: number) =>
    coreApiClient
      .patch<ApiResponse<PromoCode>>(CORE_ENDPOINTS.promoCodes.activate(id))
      .then((res) => res.data),

  deactivate: (id: number) =>
    coreApiClient
      .patch<ApiResponse<PromoCode>>(CORE_ENDPOINTS.promoCodes.deactivate(id))
      .then((res) => res.data),

  /**
   * Authenticated-only (no promo-management permission) — the backend takes
   * the user from the JWT. Not wired to any UI yet; see the booking flow
   * once one exists.
   */
  validate: (payload: ValidatePromoCodePayload) =>
    coreApiClient
      .post<ApiResponse<PromoCodeValidateResult>>(CORE_ENDPOINTS.promoCodes.validate, payload)
      .then((res) => res.data),
};
