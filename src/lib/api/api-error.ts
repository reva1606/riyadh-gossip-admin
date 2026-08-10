import { AxiosError } from "axios";

import type { ApiErrorResponse } from "@/types/api.types";

/** Normalized shape every failed request surfaces as, regardless of cause. */
export class ApiError extends Error {
  readonly statusCode?: number;
  readonly fieldErrors: Record<string, string[]>;

  constructor(message: string, statusCode?: number, fieldErrors: Record<string, string[]> = {}) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
  }

  get isUnauthorized() {
    return this.statusCode === 401;
  }

  get isValidation() {
    return this.statusCode === 422 || this.statusCode === 400;
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof AxiosError) {
    if (error.code === "ECONNABORTED" || error.message === "Network Error") {
      return new ApiError("Unable to reach the server. Check your connection.");
    }

    const body = error.response?.data as ApiErrorResponse | undefined;
    const message = body?.message ?? error.message ?? "Something went wrong. Please try again.";
    return new ApiError(message, error.response?.status, body?.errors ?? {});
  }

  if (error instanceof Error) return new ApiError(error.message);

  return new ApiError("Something went wrong. Please try again.");
}
