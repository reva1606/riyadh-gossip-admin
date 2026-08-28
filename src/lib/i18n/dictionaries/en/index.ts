import { auth } from "./auth";
import { bookings } from "./bookings";
import { categories } from "./categories";
import { common } from "./common";
import { dashboard } from "./dashboard";
import { events } from "./events";
import { nav } from "./nav";
import { permissions } from "./permissions";
import { promoCodes } from "./promoCodes";
import { roles } from "./roles";
import { settings } from "./settings";
import { users } from "./users";

export const en = {
  common,
  nav,
  auth,
  dashboard,
  users,
  categories,
  roles,
  permissions,
  promoCodes,
  events,
  bookings,
  settings,
} as const;
