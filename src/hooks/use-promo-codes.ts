import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { QUERY_KEYS } from "@/config/constants";
import { toApiError } from "@/lib/api/api-error";
import { promoCodesService } from "@/services/promo-codes.service";
import type {
  CreatePromoCodePayload,
  PromoCodesListParams,
  UpdatePromoCodePayload,
} from "@/types/promo-code.types";

export function usePromoCodesQuery(params: PromoCodesListParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.promoCodes, params],
    queryFn: () => promoCodesService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function usePromoCodeQuery(id: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.promoCodeDetail(id ?? 0),
    queryFn: () => promoCodesService.detail(id as number),
    enabled: id !== null,
  });
}

export function useCreatePromoCodeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePromoCodePayload) => promoCodesService.create(payload),
    onSuccess: () => {
      toast.success("Promo code created.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.promoCodes });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}

export function useUpdatePromoCodeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdatePromoCodePayload }) =>
      promoCodesService.update(id, payload),
    onSuccess: () => {
      toast.success("Promo code updated.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.promoCodes });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}

export function useDeletePromoCodeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => promoCodesService.remove(id),
    onSuccess: () => {
      toast.success("Promo code deleted.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.promoCodes });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}

export function useActivatePromoCodeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => promoCodesService.activate(id),
    onSuccess: () => {
      toast.success("Promo code activated.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.promoCodes });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}

export function useDeactivatePromoCodeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => promoCodesService.deactivate(id),
    onSuccess: () => {
      toast.success("Promo code deactivated.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.promoCodes });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}
