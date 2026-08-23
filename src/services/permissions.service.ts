import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api.types";
import type { PermissionDto } from "@/types/role.types";

export const permissionsService = {
  list: () =>
    apiClient.get<ApiResponse<PermissionDto[]>>(API_ENDPOINTS.permissions.list).then((res) => res.data),
};
