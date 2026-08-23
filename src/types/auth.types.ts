import type { AuthenticatedUser, User } from "./user.types";

export interface LoginRequest {
  email: string;
  password: string;
}

/** `POST /auth/login` returns the plain `UserResponseDto` — no roles/permissions yet. */
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

/** `GET /auth/profile` — the full authenticated-user shape the auth store keeps. */
export type ProfileResponse = AuthenticatedUser;

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyResetOtpResponse {
  reset_token: string;
}

export interface ResetPasswordRequest {
  reset_token: string;
  password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}
