"use client";

import { Menu } from "lucide-react";

import { useSidebar } from "@/store/sidebar-context";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { NotificationsMenu } from "@/components/layout/notifications-menu";
import { SearchInput } from "@/components/layout/search-input";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Header() {
  const { setMobileOpen } = useSidebar();

  return (
    <header className="glass-panel sticky top-0 z-20 flex h-16 items-center gap-3 border-x-0 border-t-0 px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </Button>

      <Breadcrumb />

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <SearchInput />
        <Separator orientation="vertical" className="hidden h-6 md:block" />
        <ThemeToggle />
        <NotificationsMenu />
        <Separator orientation="vertical" className="h-6" />
        <UserMenu />
      </div>
    </header>
  );
}
