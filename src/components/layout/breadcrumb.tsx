"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/config/navigation";
import { ROUTES } from "@/config/routes";
import { useTranslation } from "@/lib/i18n/language-provider";
import type { TranslationKey } from "@/lib/i18n/types";

function labelFor(segment: string, t: (key: TranslationKey) => string) {
  const match = NAV_ITEMS.find((item) => item.href === `/${segment}`);
  if (match) return t(match.labelKey);
  return segment
    .split("-")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const { t } = useTranslation();

  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 text-sm sm:flex">
      <Link
        href={ROUTES.dashboard}
        className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
      >
        <Home className="size-3.5" />
      </Link>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;

        return (
          <span key={href} className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5 text-muted-foreground/50 rtl:-scale-x-100" />
            {isLast ? (
              <span className={cn("font-medium text-foreground")}>{labelFor(segment, t)}</span>
            ) : (
              <Link
                href={href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {labelFor(segment, t)}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
