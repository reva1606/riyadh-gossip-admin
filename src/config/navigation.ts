import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Ticket,
  Users,
} from "lucide-react";

import { ROUTES } from "@/config/routes";
import type { Permission } from "@/types/role.types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: Permission;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Staff", href: ROUTES.staff, icon: Users, permission: "staff:read" },
  { label: "Roles & Permissions", href: ROUTES.roles, icon: ShieldCheck, permission: "roles:read" },
  { label: "Events", href: ROUTES.events, icon: CalendarDays, permission: "events:read" },
  { label: "Bookings", href: ROUTES.bookings, icon: ClipboardList, permission: "bookings:read" },
  { label: "Tickets", href: ROUTES.tickets, icon: Ticket, permission: "tickets:read" },
  { label: "Settings", href: ROUTES.settings, icon: Settings, permission: "settings:read" },
];
