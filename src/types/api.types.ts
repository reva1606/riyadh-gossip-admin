/** Envelope shape returned by the backend for every successful data response. */
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
}

/** Envelope shape for message-only success responses (e.g. logout, forgot-password). */
export interface ApiMessageResponse {
  statusCode: number;
  message: string;
}

/**
 * Shape returned by the backend on error (validation, auth, server, etc), via
 * the global `HttpExceptionFilter`. `message` is a `string[]` specifically for
 * class-validator DTO validation failures (400s), a plain `string` otherwise.
 */
export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Envelope for paginated list endpoints (e.g. `GET /users`). */
export interface PaginatedResponse<T> {
  statusCode: number;
  data: T[];
  meta: PaginationMeta;
}

export type SortOrder = "ASC" | "DESC";

export interface ListQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
}
