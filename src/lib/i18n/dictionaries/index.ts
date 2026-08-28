import type { Locale } from "../config";
import type { DeepString } from "../types";
import { ar } from "./ar";
import { en } from "./en";

export const dictionaries: Record<Locale, DeepString<typeof en>> = { en, ar };
