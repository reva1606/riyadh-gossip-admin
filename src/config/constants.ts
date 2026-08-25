export const APP_NAME = "MBFshow" as const;

/** localStorage/sessionStorage keys used by the token manager. */
export const STORAGE_KEYS = {
  refreshToken: "glitch404_refresh_token",
  rememberMe: "glitch404_remember_me",
} as const;

/** Non-sensitive cookie read by `proxy.ts` for optimistic route redirects only. */
export const SESSION_COOKIE = "glitch404_session";

export const QUERY_KEYS = {
  currentUser: ["auth", "current-user"] as const,
  users: ["users"] as const,
  userRoles: (userId: number) => ["users", userId, "roles"] as const,
  roles: ["roles"] as const,
  rolePermissions: (roleId: number) => ["roles", roleId, "permissions"] as const,
  permissions: ["permissions"] as const,
  categories: ["categories"] as const,
  events: ["events"] as const,
  eventDetail: (eventId: number) => ["events", eventId] as const,
  bookings: ["bookings"] as const,
  bookingDetail: (bookingId: number) => ["bookings", bookingId] as const,
};
