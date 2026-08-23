import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api.types";
import type { PermissionDto } from "@/types/role.types";
import type {
  AssignRolePermissionPayload,
  CreateRolePayload,
  RoleDto,
  UpdateRolePayload,
} from "@/types/role.types";

export const rolesService = {
  list: () => apiClient.get<ApiResponse<RoleDto[]>>(API_ENDPOINTS.roles.list).then((res) => res.data),

  detail: (id: number) =>
    apiClient.get<ApiResponse<RoleDto>>(API_ENDPOINTS.roles.detail(id)).then((res) => res.data),

  create: (payload: CreateRolePayload) =>
    apiClient.post<ApiResponse<RoleDto>>(API_ENDPOINTS.roles.list, payload).then((res) => res.data),

  update: (id: number, payload: UpdateRolePayload) =>
    apiClient
      .patch<ApiResponse<RoleDto>>(API_ENDPOINTS.roles.detail(id), payload)
      .then((res) => res.data),

  remove: (id: number) => apiClient.delete<ApiResponse<null>>(API_ENDPOINTS.roles.detail(id)),

  listPermissions: (id: number) =>
    apiClient
      .get<ApiResponse<PermissionDto[]>>(API_ENDPOINTS.roles.permissions(id))
      .then((res) => res.data),

  assignPermission: (id: number, payload: AssignRolePermissionPayload) =>
    apiClient
      .post<ApiResponse<PermissionDto[]>>(API_ENDPOINTS.roles.permissions(id), payload)
      .then((res) => res.data),

  removePermission: (id: number, permissionId: number) =>
    apiClient
      .delete<ApiResponse<PermissionDto[]>>(API_ENDPOINTS.roles.removePermission(id, permissionId))
      .then((res) => res.data),
};
