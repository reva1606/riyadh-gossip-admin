import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api.types";
import type { CreateStaffPayload, StaffDetail } from "@/types/staff.types";

// Creating a role-bearing account still goes through `/staff` (the only
// endpoint that accepts roles, generates a temp password, and sends a
// welcome email) — see `useCreateStaffMutation`. There's no separate staff
// listing/update/delete anymore; the Users page and its mutations cover
// every account, staff or not, via the plain `/users/:id` endpoints.
export const staffService = {
  create: (payload: CreateStaffPayload) =>
    apiClient
      .post<ApiResponse<StaffDetail>>(API_ENDPOINTS.staff.list, payload)
      .then((res) => res.data),
};
