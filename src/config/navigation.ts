import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  ClipboardList,
  KeyRound,
  LayoutDashboard,
  Percent,
  Settings,
  ShieldCheck,
  Tags,
  Users,
} from "lucide-react";

import { ROUTES } from "@/config/routes";
import type { TranslationKey } from "@/lib/i18n/types";

export interface NavItem {
  labelKey: TranslationKey;
  href: string;
  icon: LucideIcon;
  /** Dot-separated backend permission name (e.g. "user.view"). Omit to always show the item. */
  permission?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { labelKey: "nav.dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { labelKey: "nav.users", href: ROUTES.users, icon: Users, permission: "user.view" },
  { labelKey: "nav.rolesPermissions", href: ROUTES.roles, icon: ShieldCheck, permission: "role.view" },
  { labelKey: "nav.permissions", href: ROUTES.permissions, icon: KeyRound, permission: "permission.view" },
  { labelKey: "nav.categories", href: ROUTES.categories, icon: Tags, permission: "category.view" },
  { labelKey: "nav.events", href: ROUTES.events, icon: CalendarDays, permission: "event.view" },
  { labelKey: "nav.bookings", href: ROUTES.bookings, icon: ClipboardList, permission: "booking.view" },
  { labelKey: "nav.promoCodes", href: ROUTES.promoCodes, icon: Percent, permission: "promocode.view" },
  { labelKey: "nav.settings", href: ROUTES.settings, icon: Settings },
];
