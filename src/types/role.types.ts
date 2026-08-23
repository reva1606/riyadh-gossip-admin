/** Mirrors the backend's `RoleDto`. Roles are a dynamic catalog, not a fixed union. */
export interface RoleDto {
  id: number;
  name: string;
  description: string | null;
  is_system: boolean;
}

export interface CreateRolePayload {
  name: string;
  description?: string;
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
}

/** Mirrors the backend's `PermissionDto`. Read-only seeded catalog. */
export interface PermissionDto {
  id: number;
  name: string;
  module: string;
  description: string | null;
}

export interface AssignRolePermissionPayload {
  permission_id: number;
}
