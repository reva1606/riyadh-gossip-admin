/**
 * Typed access to `NEXT_PUBLIC_*` env vars. These are inlined at build time,
 * so only read them through this module — never `process.env` directly —
 * to keep the fallback and naming consistent everywhere they're used.
 */
export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Glitch404 Admin",
  isProduction: process.env.NODE_ENV === "production",
} as const;
