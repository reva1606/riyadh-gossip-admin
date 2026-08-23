import { AxiosError } from "axios";

import type { ApiErrorResponse } from "@/types/api.types";

/** Normalized shape every failed request surfaces as, regardless of cause. */
export class ApiError extends Error {
  readonly statusCode?: number;
  /** The backend's `error` field (e.g. "Bad Request"), when present. */
  readonly errorCode?: string;

  constructor(message: string, statusCode?: number, errorCode?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }

  get isUnauthorized() {
    return this.statusCode === 401;
  }

  get isValidation() {
    return this.statusCode === 400;
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof AxiosError) {
    if (error.code === "ECONNABORTED" || error.message === "Network Error") {
      return new ApiError("Unable to reach the server. Check your connection.");
    }

    const body = error.response?.data as ApiErrorResponse | undefined;
    const rawMessage = body?.message ?? error.message ?? "Something went wrong. Please try again.";
    // Validation failures (400s from class-validator) come back as string[].
    const message = Array.isArray(rawMessage) ? rawMessage.join(" ") : rawMessage;
    return new ApiError(message, error.response?.status ?? body?.statusCode, body?.error);
  }

  if (error instanceof Error) return new ApiError(error.message);

  return new ApiError("Something went wrong. Please try again.");
}
