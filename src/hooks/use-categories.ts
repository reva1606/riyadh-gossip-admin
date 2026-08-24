import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { QUERY_KEYS } from "@/config/constants";
import { toApiError } from "@/lib/api/api-error";
import { categoriesService } from "@/services/categories.service";
import type { CreateCategoryPayload, UpdateCategoryPayload } from "@/types/category.types";

export function useCategoriesQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: () => categoriesService.list(),
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => categoriesService.create(payload),
    onSuccess: () => {
      toast.success("Category created.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCategoryPayload }) =>
      categoriesService.update(id, payload),
    onSuccess: () => {
      toast.success("Category updated.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoriesService.remove(id),
    onSuccess: () => {
      toast.success("Category deleted.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}
