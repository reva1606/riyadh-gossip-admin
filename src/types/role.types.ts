/**
 * Baseline role set for the admin panel. The full Roles & Permissions module
 * (custom roles, a permission matrix) lands separately — this is the minimal
 * shape auth/RBAC needs now: a role name plus the granular permission keys
 * it carries.
 */
export type RoleName = "super_admin" | "admin" | "manager" | "staff";

export type Permission =
  | "staff:read"
  | "staff:write"
  | "staff:delete"
  | "roles:read"
  | "roles:write"
  | "events:read"
  | "events:write"
  | "bookings:read"
  | "bookings:write"
  | "tickets:read"
  | "tickets:write"
  | "settings:read"
  | "settings:write";

export interface Role {
  id: string;
  name: RoleName;
  label: string;
  permissions: Permission[];
}
