import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  ClipboardList,
  KeyRound,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Tags,
  Users,
} from "lucide-react";

import { ROUTES } from "@/config/routes";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Dot-separated backend permission name (e.g. "user.view"). Omit to always show the item. */
  permission?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Users", href: ROUTES.users, icon: Users, permission: "user.view" },
  { label: "Roles & Permissions", href: ROUTES.roles, icon: ShieldCheck, permission: "role.view" },
  { label: "Permissions", href: ROUTES.permissions, icon: KeyRound, permission: "permission.view" },
  { label: "Categories", href: ROUTES.categories, icon: Tags, permission: "category.view" },
  { label: "Events", href: ROUTES.events, icon: CalendarDays, permission: "event.view" },
  { label: "Bookings", href: ROUTES.bookings, icon: ClipboardList, permission: "booking.view" },
  { label: "Settings", href: ROUTES.settings, icon: Settings },
];
