import type { User } from "./user.types";

/** `POST /staff` additionally includes the assigned role names. */
export interface StaffDetail extends User {
  roles: string[];
}

/** No password field — the backend generates a temporary one and emails it to the new account. */
export interface CreateStaffPayload {
  first_name: string;
  last_name: string;
  email: string;
  /** At least one role id, must not include the default USER role. */
  role_ids: number[];
}
