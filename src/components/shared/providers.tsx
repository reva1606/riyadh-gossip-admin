"use client";

import * as React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

import { getQueryClient } from "@/lib/query-client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/store/auth-context";
import type { Locale } from "@/lib/i18n/config";
import { LanguageProvider } from "@/lib/i18n/language-provider";

export function Providers({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const queryClient = getQueryClient();

  return (
    <LanguageProvider initialLocale={initialLocale}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "var(--card)",
                    color: "var(--card-foreground)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.75rem",
                    fontSize: "0.875rem",
                  },
                  success: { iconTheme: { primary: "var(--success)", secondary: "var(--card)" } },
                  error: { iconTheme: { primary: "var(--danger)", secondary: "var(--card)" } },
                }}
              />
            </TooltipProvider>
          </AuthProvider>
          {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
