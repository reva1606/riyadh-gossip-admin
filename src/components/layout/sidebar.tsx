"use client";

import { ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/store/auth-context";
import { useSidebar } from "@/store/sidebar-context";
import { useTranslation } from "@/lib/i18n/language-provider";
import { Logo } from "@/components/shared/logo";
import { NavList } from "@/components/layout/nav-list";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/** Fixed desktop nav rail. Hidden below `lg`, where `MobileSidebar` takes over. */
export function Sidebar() {
  const { isCollapsed, toggleCollapsed } = useSidebar();
  const { logout } = useAuth();
  const { t } = useTranslation();

  return (
    <aside
      className={cn(
        "glass-sidebar fixed inset-y-0 inset-s-0 z-30 hidden flex-col border-e border-sidebar-border transition-[width] duration-200 lg:flex",
        isCollapsed ? "w-[76px]" : "w-64",
      )}
    >
      <div className={cn("flex h-16 items-center px-5", isCollapsed && "justify-center px-0")}>
        <Logo collapsed={isCollapsed} />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin py-4">
        <NavList collapsed={isCollapsed} />
      </div>

      <div className="flex flex-col gap-1 border-t border-sidebar-border p-3">
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => void logout()}
                className="text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                <LogOut className="size-4.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{t("common.logout")}</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            onClick={() => void logout()}
            className="justify-start gap-3 px-3 text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="size-4.5" />
            {t("common.logout")}
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapsed}
          className={cn(
            "text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
            isCollapsed ? "" : "self-end",
          )}
          aria-label={isCollapsed ? t("common.expandSidebar") : t("common.collapseSidebar")}
        >
          {isCollapsed ? (
            <ChevronsRight className="size-4.5 rtl:-scale-x-100" />
          ) : (
            <ChevronsLeft className="size-4.5 rtl:-scale-x-100" />
          )}
        </Button>
      </div>
    </aside>
  );
}
