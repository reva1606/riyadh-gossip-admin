/**
 * Typed access to `NEXT_PUBLIC_*` env vars. These are inlined at build time,
 * so only read them through this module — never `process.env` directly —
 * to keep the fallback and naming consistent everywhere they're used.
 */
export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  /** The "core" sub-app (event management: categories/events) — separate service, separate port. */
  coreApiUrl: process.env.NEXT_PUBLIC_CORE_API_URL ?? "http://localhost:4001",
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "MBFshow Admin",
  isProduction: process.env.NODE_ENV === "production",
} as const;
