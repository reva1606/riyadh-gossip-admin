import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
} from "@/types/auth.types";
import type { ApiResponse } from "@/types/api.types";
import type { User } from "@/types/user.types";

export const authService = {
  login: (payload: LoginRequest) =>
    apiClient
      .post<ApiResponse<LoginResponse>>(API_ENDPOINTS.auth.login, payload)
      .then((res) => res.data),

  logout: () => apiClient.post<ApiResponse<null>>(API_ENDPOINTS.auth.logout),

  forgotPassword: (payload: ForgotPasswordRequest) =>
    apiClient.post<ApiResponse<null>>(API_ENDPOINTS.auth.forgotPassword, payload),

  resetPassword: (payload: ResetPasswordRequest) =>
    apiClient.post<ApiResponse<null>>(API_ENDPOINTS.auth.resetPassword, payload),

  getCurrentUser: () =>
    apiClient.get<ApiResponse<User>>(API_ENDPOINTS.auth.me).then((res) => res.data),
};
