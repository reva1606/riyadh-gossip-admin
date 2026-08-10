/** Envelope shape returned by the backend for every successful response. */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/** Shape returned by the backend on error (validation, auth, server, etc). */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
