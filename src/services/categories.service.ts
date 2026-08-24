import { CORE_ENDPOINTS } from "@/lib/api/endpoints";
import { coreApiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api.types";
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from "@/types/category.types";

export const categoriesService = {
  list: () =>
    coreApiClient
      .get<ApiResponse<Category[]>>(CORE_ENDPOINTS.categories.list)
      .then((res) => res.data),

  create: (payload: CreateCategoryPayload) =>
    coreApiClient
      .post<ApiResponse<Category>>(CORE_ENDPOINTS.categories.list, payload)
      .then((res) => res.data),

  update: (id: number, payload: UpdateCategoryPayload) =>
    coreApiClient
      .patch<ApiResponse<Category>>(CORE_ENDPOINTS.categories.detail(id), payload)
      .then((res) => res.data),

  remove: (id: number) =>
    coreApiClient.delete<ApiResponse<null>>(CORE_ENDPOINTS.categories.detail(id)),
};
