export const APP_NAME = "Glitch404" as const;

/** localStorage/sessionStorage keys used by the token manager. */
export const STORAGE_KEYS = {
  refreshToken: "glitch404_refresh_token",
  rememberMe: "glitch404_remember_me",
} as const;

/** Non-sensitive cookie read by `proxy.ts` for optimistic route redirects only. */
export const SESSION_COOKIE = "glitch404_session";

export const QUERY_KEYS = {
  currentUser: ["auth", "current-user"] as const,
};
