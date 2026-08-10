import { QueryClient } from "@tanstack/react-query";

import { toApiError } from "@/lib/api/api-error";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        onError: (error) => {
          // Keep raw errors out of the console in normal operation; callers
          // surface `toApiError(error).message` via toast themselves.
          if (process.env.NODE_ENV === "development") {
            console.error(toApiError(error));
          }
        },
      },
    },
  });
}

// This app is purely client-rendered (no server prefetch/hydration), so a
// single browser-side singleton is all `getQueryClient` needs to return.
let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === "undefined") return createQueryClient();
  if (!browserQueryClient) browserQueryClient = createQueryClient();
  return browserQueryClient;
}
