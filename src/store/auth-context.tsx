"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { SESSION_COOKIE } from "@/config/constants";
import { ROUTES } from "@/config/routes";
import { authService } from "@/services/auth.service";
import { tokenManager } from "@/lib/api/token-manager";
import { toApiError } from "@/lib/api/api-error";
import type { AuthenticatedUser } from "@/types/user.types";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

/** Any role in this set bypasses every permission check, mirroring the backend's own bypass. */
const SUPER_ADMIN_ROLE = "SUPER_ADMIN";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<AuthenticatedUser>;
  logout: () => Promise<void>;
  hasRole: (...roles: string[]) => boolean;
  hasPermission: (...permissions: string[]) => boolean;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = React.useState<AuthStatus>("loading");
  const [user, setUser] = React.useState<AuthenticatedUser | null>(null);

  const handleSessionEnd = React.useCallback(() => {
    setUser(null);
    setStatus("unauthenticated");
    Cookies.remove(SESSION_COOKIE);
  }, []);

  // Reactive: fires if a refresh attempt fails at any point during the session
  // (e.g. the refresh token itself expired), not just on the initial load.
  React.useEffect(() => {
    const unsubscribe = tokenManager.onSessionExpired(handleSessionEnd);
    return () => {
      unsubscribe();
    };
  }, [handleSessionEnd]);

  // Bootstrap: if a refresh token survived a hard reload, use it to silently
  // re-authenticate. `getCurrentUser()` goes out with no access token, gets a
  // 401, and the ApiClient's own interceptor performs the refresh + retry —
  // so this reuses the exact same refresh path a mid-session 401 would.
  React.useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!tokenManager.getRefreshToken()) {
        setStatus("unauthenticated");
        return;
      }
      try {
        const currentUser = await authService.getCurrentUser();
        if (cancelled) return;
        setUser(currentUser);
        setStatus("authenticated");
        Cookies.set(SESSION_COOKIE, "1", { sameSite: "lax", expires: 30 });
      } catch {
        if (cancelled) return;
        handleSessionEnd();
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [handleSessionEnd]);

  const login = React.useCallback(async (email: string, password: string, rememberMe: boolean) => {
    // Login itself only returns the bare profile (no roles/permissions) — fetch
    // the full authenticated profile right after so hasRole/hasPermission work.
    const { access_token, refresh_token } = await authService.login({ email, password });
    tokenManager.setSession(access_token, refresh_token, rememberMe);

    const fullUser = await authService.getCurrentUser();
    Cookies.set(SESSION_COOKIE, "1", {
      sameSite: "lax",
      expires: rememberMe ? 30 : undefined,
    });
    setUser(fullUser);
    setStatus("authenticated");
    return fullUser;
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Local session teardown proceeds regardless of whether the server call succeeds.
      void toApiError(error);
    } finally {
      tokenManager.clearSession();
      handleSessionEnd();
      router.replace(ROUTES.login);
    }
  }, [handleSessionEnd, router]);

  const hasRole = React.useCallback((...roles: string[]) => !!user && roles.some((role) => user.roles.includes(role)), [
    user,
  ]);

  const hasPermission = React.useCallback(
    (...permissions: string[]) =>
      !!user &&
      (user.roles.includes(SUPER_ADMIN_ROLE) ||
        permissions.some((permission) => user.permissions.includes(permission))),
    [user],
  );

  const value = React.useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      isAuthenticated: status === "authenticated",
      isLoading: status === "loading",
      login,
      logout,
      hasRole,
      hasPermission,
    }),
    [status, user, login, logout, hasRole, hasPermission],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
