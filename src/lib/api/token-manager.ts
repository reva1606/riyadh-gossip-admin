import { STORAGE_KEYS } from "@/config/constants";

/**
 * Owns JWT storage for the whole app.
 *
 * - Access token lives in memory only (never touches disk) — it's short
 *   lived and re-derived from the refresh token on boot, which keeps it out
 *   of localStorage/sessionStorage entirely.
 * - Refresh token persists in `localStorage` when "Remember me" was checked,
 *   or `sessionStorage` (cleared when the tab closes) otherwise.
 *
 * `ApiClient`'s interceptors and `AuthProvider` both depend on this module
 * instead of each other, which keeps token storage decoupled from both HTTP
 * plumbing and React state.
 */
class TokenManager {
  private accessToken: string | null = null;
  private sessionExpiredListeners = new Set<() => void>();

  private get store(): Storage | null {
    if (typeof window === "undefined") return null;
    const remember = window.localStorage.getItem(STORAGE_KEYS.rememberMe) === "true";
    return remember ? window.localStorage : window.sessionStorage;
  }

  getAccessToken() {
    return this.accessToken;
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  isRemembered(): boolean {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEYS.rememberMe) === "true";
  }

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return (
      window.localStorage.getItem(STORAGE_KEYS.refreshToken) ??
      window.sessionStorage.getItem(STORAGE_KEYS.refreshToken) ??
      null
    );
  }

  setSession(accessToken: string, refreshToken: string, rememberMe: boolean) {
    this.accessToken = accessToken;
    if (typeof window === "undefined") return;

    window.localStorage.setItem(STORAGE_KEYS.rememberMe, String(rememberMe));
    // Clear both stores first so switching "remember me" between logins
    // never leaves a stale refresh token behind in the other one.
    window.localStorage.removeItem(STORAGE_KEYS.refreshToken);
    window.sessionStorage.removeItem(STORAGE_KEYS.refreshToken);
    this.store?.setItem(STORAGE_KEYS.refreshToken, refreshToken);
  }

  clearSession() {
    this.accessToken = null;
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEYS.refreshToken);
    window.sessionStorage.removeItem(STORAGE_KEYS.refreshToken);
    window.localStorage.removeItem(STORAGE_KEYS.rememberMe);
  }

  /** Fired when a refresh attempt fails so the UI can react (e.g. redirect to /login). */
  onSessionExpired(listener: () => void) {
    this.sessionExpiredListeners.add(listener);
    return () => this.sessionExpiredListeners.delete(listener);
  }

  notifySessionExpired() {
    this.clearSession();
    this.sessionExpiredListeners.forEach((listener) => listener());
  }
}

export const tokenManager = new TokenManager();
