import { useCallback, useSyncExternalStore } from "react";

/** SSR-safe media query hook, backed by `useSyncExternalStore` so it subscribes to `matchMedia` directly instead of polling it from an effect. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", onChange);
      return () => mediaQueryList.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const MOBILE_BREAKPOINT = "(max-width: 767px)";
const TABLET_BREAKPOINT = "(max-width: 1023px)";

export function useIsMobile() {
  return useMediaQuery(MOBILE_BREAKPOINT);
}

export function useIsTablet() {
  return useMediaQuery(TABLET_BREAKPOINT);
}
