import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import { tokenManager } from "@/lib/api/token-manager";
import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  ProfileResponse,
  ResetPasswordRequest,
  VerifyResetOtpRequest,
  VerifyResetOtpResponse,
} from "@/types/auth.types";
import type { ApiMessageResponse, ApiResponse } from "@/types/api.types";

export const authService = {
  login: (payload: LoginRequest) =>
    apiClient
      .post<ApiResponse<LoginResponse>>(API_ENDPOINTS.auth.login, payload)
      .then((res) => res.data),

  /** Reads the current refresh token itself so callers never have to thread it through. */
  logout: () =>
    apiClient.post<ApiMessageResponse>(API_ENDPOINTS.auth.logout, {
      refresh_token: tokenManager.getRefreshToken(),
    }),

  logoutAll: () => apiClient.post<ApiMessageResponse>(API_ENDPOINTS.auth.logoutAll),

  forgotPassword: (payload: ForgotPasswordRequest) =>
    apiClient.post<ApiMessageResponse>(API_ENDPOINTS.auth.forgotPassword, payload),

  verifyResetOtp: (payload: VerifyResetOtpRequest) =>
    apiClient
      .post<ApiResponse<VerifyResetOtpResponse>>(API_ENDPOINTS.auth.verifyResetOtp, payload)
      .then((res) => res.data),

  resetPassword: (payload: ResetPasswordRequest) =>
    apiClient.post<ApiMessageResponse>(API_ENDPOINTS.auth.resetPassword, payload),

  changePassword: (payload: ChangePasswordRequest) =>
    apiClient.post<ApiMessageResponse>(API_ENDPOINTS.auth.changePassword, payload),

  getCurrentUser: () =>
    apiClient.get<ApiResponse<ProfileResponse>>(API_ENDPOINTS.auth.profile).then((res) => res.data),
};
