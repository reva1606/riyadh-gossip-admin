import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/**
 * True once the client has hydrated. Prefer this over a manual
 * `useState` + `useEffect(() => setMounted(true), [])` pair — React
 * already re-renders once server/client snapshots disagree, so this
 * gets the same "flip after hydration" behavior without an effect.
 */
export function useHasMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
