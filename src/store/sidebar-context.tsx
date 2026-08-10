"use client";

import * as React from "react";

const COLLAPSE_STORAGE_KEY = "glitch404_sidebar_collapsed";

// Module-level pub/sub over localStorage so `useSyncExternalStore` can read
// the collapsed flag without an effect-driven setState, and every consumer
// re-renders in sync when `toggleCollapsed` writes a new value.
const listeners = new Set<() => void>();

function getCollapsedSnapshot() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(COLLAPSE_STORAGE_KEY) === "true";
}

function getServerSnapshot() {
  return false;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setCollapsed(value: boolean) {
  window.localStorage.setItem(COLLAPSE_STORAGE_KEY, String(value));
  listeners.forEach((listener) => listener());
}

interface SidebarContextValue {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isCollapsed = React.useSyncExternalStore(subscribe, getCollapsedSnapshot, getServerSnapshot);
  const [isMobileOpen, setMobileOpen] = React.useState(false);

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed(!getCollapsedSnapshot());
  }, []);

  const value = React.useMemo(
    () => ({ isCollapsed, toggleCollapsed, isMobileOpen, setMobileOpen }),
    [isCollapsed, toggleCollapsed, isMobileOpen],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider");
  return context;
}
