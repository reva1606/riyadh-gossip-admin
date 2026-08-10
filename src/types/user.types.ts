import type { Permission, RoleName } from "./role.types";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: RoleName;
  permissions: Permission[];
  isActive: boolean;
  createdAt: string;
}

export type AuthenticatedUser = Pick<
  User,
  "id" | "firstName" | "lastName" | "email" | "avatarUrl" | "role" | "permissions"
>;
