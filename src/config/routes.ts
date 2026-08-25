/** Central route path constants — the single source of truth for `href`s, redirects, and proxy matchers. */
export const ROUTES = {
  login: "/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",

  dashboard: "/dashboard",
  users: "/users",
  roles: "/roles",
  permissions: "/permissions",
  categories: "/categories",
  events: "/events",
  promoCodes: "/promo-codes",
  bookings: "/bookings",
  settings: "/settings",
} as const;

/** Routes reachable without a session. Everything else requires auth. */
export const PUBLIC_ROUTES: string[] = [
  ROUTES.login,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
];

export const DEFAULT_AUTHENTICATED_ROUTE = ROUTES.dashboard;
