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

function createBaseInstance(): AxiosInstance {
  return axios.create({
    baseURL: env.apiUrl,
    timeout: 15_000,
    headers: { "Content-Type": "application/json" },
  });
}

const http = createBaseInstance();
// A bare client with no interceptors, used only to call /auth/refresh so a
// failed refresh never re-enters this same interceptor chain.
const refreshHttp = createBaseInstance();

function isPublicPath(url?: string) {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some((path) => url.includes(path));
}

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!isPublicPath(config.url)) {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return config;
});

/**
 * Shared refresh promise so a burst of parallel 401s only triggers one
 * network call — every caller awaits the same in-flight refresh.
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

http.interceptors.response.use(
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
    return http.request(config);
  },
);

/** Thin wrapper so callers never import axios directly — swapping HTTP clients later stays contained here. */
export const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    http.get<T>(url, config).then((res) => res.data),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    http.post<T>(url, data, config).then((res) => res.data),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    http.put<T>(url, data, config).then((res) => res.data),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    http.patch<T>(url, data, config).then((res) => res.data),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    http.delete<T>(url, config).then((res) => res.data),
};
