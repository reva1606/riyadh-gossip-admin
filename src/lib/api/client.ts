import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import { env } from "@/config/env";
import type { ApiResponse } from "@/types/api.types";
import type { RefreshTokenResponse } from "@/types/auth.types";

import { API_ENDPOINTS, PUBLIC_ENDPOINTS } from "./endpoints";
import { toApiError } from "./api-error";
import { tokenManager } from "./token-manager";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retried?: boolean;
  }
}

function createBaseInstance(baseURL: string): AxiosInstance {
  return axios.create({
    baseURL,
    timeout: 15_000,
    headers: { "Content-Type": "application/json" },
  });
}

// A bare client with no interceptors, used only to call /auth/refresh so a
// failed refresh never re-enters this same interceptor chain. Refresh
// always happens against the main API regardless of which client
// (main or core) triggered the 401 — there is only one login/session.
const refreshHttp = createBaseInstance(env.apiUrl);

function isPublicPath(url?: string) {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some((path) => url.includes(path));
}

/**
 * Shared refresh promise so a burst of parallel 401s — from either the main
 * or core client — only triggers one network call — every caller awaits the
 * same in-flight refresh.
 */
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const { data } = await refreshHttp.post<ApiResponse<RefreshTokenResponse>>(
        API_ENDPOINTS.auth.refresh,
        { refresh_token: refreshToken },
      );
      const { access_token, refresh_token } = data.data;
      if (!access_token) return false;

      tokenManager.setSession(access_token, refresh_token ?? refreshToken, tokenManager.isRemembered());
      return true;
    } catch {
      return false;
    }
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

/** Bearer injection + 401-refresh-and-retry — identical for every backend this admin panel calls. */
function attachAuthInterceptors(instance: AxiosInstance): void {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (!isPublicPath(config.url)) {
      const token = tokenManager.getAccessToken();
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config as InternalAxiosRequestConfig | undefined;
      const status = error.response?.status;

      const shouldAttemptRefresh =
        status === 401 && config && !config._retried && !isPublicPath(config.url);

      if (!shouldAttemptRefresh) {
        throw toApiError(error);
      }

      const refreshed = await refreshAccessToken();
      if (!refreshed) {
        tokenManager.notifySessionExpired();
        throw toApiError(error);
      }

      config._retried = true;
      const token = tokenManager.getAccessToken();
      if (token) config.headers.set("Authorization", `Bearer ${token}`);
      return instance.request(config);
    },
  );
}

function createClient(instance: AxiosInstance) {
  return {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
      instance.get<T>(url, config).then((res) => res.data),
    post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      instance.post<T>(url, data, config).then((res) => res.data),
    put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      instance.put<T>(url, data, config).then((res) => res.data),
    patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      instance.patch<T>(url, data, config).then((res) => res.data),
    delete: <T>(url: string, config?: AxiosRequestConfig) =>
      instance.delete<T>(url, config).then((res) => res.data),
  };
}

const http = createBaseInstance(env.apiUrl);
attachAuthInterceptors(http);

const coreHttp = createBaseInstance(env.coreApiUrl);
attachAuthInterceptors(coreHttp);

/** Thin wrapper so callers never import axios directly — swapping HTTP clients later stays contained here. */
export const apiClient = createClient(http);

/** Same auth/refresh behavior as apiClient, pointed at the core (event management) service on its own port. */
export const coreApiClient = createClient(coreHttp);
