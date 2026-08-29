export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    logoutAll: "/auth/logout-all",
    forgotPassword: "/auth/forgot-password",
    verifyResetOtp: "/auth/verify-reset-otp",
    resetPassword: "/auth/reset-password",
    changePassword: "/auth/change-password",
    profile: "/auth/profile",
  },
  users: {
    list: "/users",
    me: "/users/me",
    detail: (id: number | string) => `/users/${id}`,
    activate: (id: number | string) => `/users/${id}/activate`,
    deactivate: (id: number | string) => `/users/${id}/deactivate`,
    roles: (id: number | string) => `/users/${id}/roles`,
    removeRole: (id: number | string, roleId: number | string) => `/users/${id}/roles/${roleId}`,
  },
  uploads: {
    single: "/uploads/single",
  },
  roles: {
    list: "/roles",
    detail: (id: number | string) => `/roles/${id}`,
    permissions: (id: number | string) => `/roles/${id}/permissions`,
    removePermission: (id: number | string, permissionId: number | string) =>
      `/roles/${id}/permissions/${permissionId}`,
  },
  // Only account creation goes through /staff now — see staff.service.ts.
  staff: {
    list: "/staff",
  },
  permissions: {
    list: "/permissions",
  },
} as const;

/** Event management — served by the "core" sub-app (its own port), see coreApiClient. */
export const CORE_ENDPOINTS = {
  categories: {
    list: "/categories",
    detail: (id: number | string) => `/categories/${id}`,
  },
  events: {
    list: "/events",
    detail: (id: number | string) => `/events/${id}`,
  },
  bookings: {
    list: "/bookings",
    detail: (id: number | string) => `/bookings/${id}`,
    invoice: (id: number | string) => `/bookings/${id}/invoice`,
  },
  promoCodes: {
    list: "/promo-codes",
    detail: (id: number | string) => `/promo-codes/${id}`,
    activate: (id: number | string) => `/promo-codes/${id}/activate`,
    deactivate: (id: number | string) => `/promo-codes/${id}/deactivate`,
    validate: "/promo-codes/validate",
  },
} as const;

/** Requests that must never carry a stale Authorization header or trigger a refresh loop. */
export const PUBLIC_ENDPOINTS: string[] = [
  API_ENDPOINTS.auth.login,
  API_ENDPOINTS.auth.refresh,
  API_ENDPOINTS.auth.forgotPassword,
  API_ENDPOINTS.auth.verifyResetOtp,
  API_ENDPOINTS.auth.resetPassword,
];
