import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type {
  AssignUserRolePayload,
  UpdateUserPayload,
  User,
  UserRoleSummary,
  UsersListParams,
} from "@/types/user.types";

export const usersService = {
  list: (params: UsersListParams) =>
    apiClient.get<PaginatedResponse<User>>(API_ENDPOINTS.users.list, { params }),

  detail: (id: number) =>
    apiClient.get<ApiResponse<User>>(API_ENDPOINTS.users.detail(id)).then((res) => res.data),

  update: (id: number, payload: UpdateUserPayload) =>
    apiClient
      .patch<ApiResponse<User>>(API_ENDPOINTS.users.detail(id), payload)
      .then((res) => res.data),

  remove: (id: number) => apiClient.delete<ApiResponse<null>>(API_ENDPOINTS.users.detail(id)),

  activate: (id: number) =>
    apiClient
      .patch<ApiResponse<User>>(API_ENDPOINTS.users.activate(id))
      .then((res) => res.data),

  deactivate: (id: number) =>
    apiClient
      .patch<ApiResponse<User>>(API_ENDPOINTS.users.deactivate(id))
      .then((res) => res.data),

  listRoles: (id: number) =>
    apiClient
      .get<ApiResponse<UserRoleSummary[]>>(API_ENDPOINTS.users.roles(id))
      .then((res) => res.data),

  assignRole: (id: number, payload: AssignUserRolePayload) =>
    apiClient
      .post<ApiResponse<UserRoleSummary[]>>(API_ENDPOINTS.users.roles(id), payload)
      .then((res) => res.data),

  removeRole: (id: number, roleId: number) =>
    apiClient
      .delete<ApiResponse<UserRoleSummary[]>>(API_ENDPOINTS.users.removeRole(id, roleId))
      .then((res) => res.data),
};
