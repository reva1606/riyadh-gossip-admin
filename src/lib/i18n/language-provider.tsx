"use client";

import * as React from "react";
import Cookies from "js-cookie";

import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_DIR, type Locale } from "./config";
import { dictionaries } from "./dictionaries";
import type { TranslationKey } from "./types";
import { getByPath, interpolate } from "./utils";

interface LanguageContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

interface LanguageProviderProps {
  children: React.ReactNode;
  /** Locale resolved server-side (from the `rg_locale` cookie) so the first paint already matches. */
  initialLocale?: Locale;
}

export function LanguageProvider({ children, initialLocale = DEFAULT_LOCALE }: LanguageProviderProps) {
  const [locale, setLocaleState] = React.useState<Locale>(initialLocale);

  const setLocale = React.useCallback((next: Locale) => {
    setLocaleState(next);
    Cookies.set(LOCALE_COOKIE, next, { expires: 365, sameSite: "lax" });
  }, []);

  React.useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = LOCALE_DIR[locale];
  }, [locale]);

  const dict = dictionaries[locale];

  const t = React.useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      const value = getByPath(dict, key);
      if (typeof value !== "string") return key;
      return interpolate(value, vars);
    },
    [dict],
  );

  const value = React.useMemo<LanguageContextValue>(
    () => ({ locale, dir: LOCALE_DIR[locale], setLocale, t }),
    [locale, setLocale, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
  const context = React.useContext(LanguageContext);
  if (!context) throw new Error("useTranslation must be used within a LanguageProvider");
  return context;
}
