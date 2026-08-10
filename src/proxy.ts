import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/config/constants";
import { DEFAULT_AUTHENTICATED_ROUTE, PUBLIC_ROUTES, ROUTES } from "@/config/routes";

/**
 * Optimistic-only redirect based on a non-sensitive "a session might exist"
 * cookie — it never carries the JWT itself, and it is not the real access
 * check. The actual authorization happens client-side against the in-memory
 * access token (see `ProtectedGuard`/`GuestGuard`) and, ultimately, on the
 * API for every request. This just avoids a flash of the wrong screen on a
 * hard navigation, per the documented Proxy authorization pattern.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isProtectedRoute = !isPublicRoute && pathname !== "/";

  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(new URL(ROUTES.login, request.url));
  }

  if (isPublicRoute && hasSession) {
    return NextResponse.redirect(new URL(DEFAULT_AUTHENTICATED_ROUTE, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
