export type UserStatus = "ACTIVE" | "INACTIVE";

/** Mirrors the backend's `UserResponseDto` exactly (snake_case, no role/permission fields). */
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: UserStatus;
  email_verified: boolean;
  /** True for accounts still on a system-generated temporary password (e.g. new staff). */
  must_change_password: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * What `GET /auth/profile` returns — the current user's profile plus the
 * roles/permissions RBAC needs to gate the UI. Login's `data.user` is a plain
 * `User`; the auth store fetches this shape right after login to populate
 * `hasRole`/`hasPermission`.
 */
export interface AuthenticatedUser extends User {
  roles: string[];
  permissions: string[];
}

export interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  status?: UserStatus;
  password?: string;
}

export interface UsersListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "id" | "first_name" | "last_name" | "email" | "status" | "created_at";
  sortOrder?: "ASC" | "DESC";
  status?: UserStatus;
}

/** Minimal role shape returned by `GET/POST/DELETE /users/:id/roles`. */
export interface UserRoleSummary {
  id: number;
  name: string;
}

export interface AssignUserRolePayload {
  role_id: number;
}
