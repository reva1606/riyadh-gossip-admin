"use client";

import { Bell } from "lucide-react";

import { useTranslation } from "@/lib/i18n/language-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Notification bell with unread indicator. Wires up to a real feed once the
 * notifications module ships — the shell (badge, panel, empty state) is
 * reusable as-is.
 */
export function NotificationsMenu() {
  const unreadCount = 0;
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={t("common.notifications")}>
          <Bell className="size-4.5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 inset-e-1.5 size-2 rounded-full bg-cta ring-2 ring-background" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>{t("common.notifications")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
          <Bell className="size-8 text-muted-foreground/50" />
          <p className="text-sm font-medium">{t("common.allCaughtUp")}</p>
          <p className="text-xs text-muted-foreground">{t("common.newActivityHere")}</p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
