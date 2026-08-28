"use client";

import { LogOut } from "lucide-react";

import { useAuth } from "@/store/auth-context";
import { useSidebar } from "@/store/sidebar-context";
import { useTranslation } from "@/lib/i18n/language-provider";
import { Logo } from "@/components/shared/logo";
import { NavList } from "@/components/layout/nav-list";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";

/** Sheet-based drawer that replaces the fixed sidebar below the `lg` breakpoint. */
export function MobileSidebar() {
  const { isMobileOpen, setMobileOpen } = useSidebar();
  const { logout } = useAuth();
  const { t } = useTranslation();

  return (
    <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent
        side="left"
        title={t("common.navigation")}
        className="glass-sidebar w-72 gap-0 border-sidebar-border p-0 text-sidebar-foreground"
      >
        <SheetHeader className="h-16 flex-row items-center border-b border-sidebar-border">
          <Logo />
        </SheetHeader>

        <div className="flex-1 overflow-y-auto scrollbar-thin py-4">
          <NavList onNavigate={() => setMobileOpen(false)} />
        </div>

        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            onClick={() => void logout()}
            className="w-full justify-start gap-3 px-3 text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="size-4.5" />
            {t("common.logout")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
