"use client";

import Link from "next/link";
import { LogOut, Settings, User as UserIcon } from "lucide-react";

import { ROUTES } from "@/config/routes";
import { env } from "@/config/env";
import { useAuth } from "@/store/auth-context";
import { useTranslation } from "@/lib/i18n/language-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getInitials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";
}

export function UserMenu() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const primaryRole = user?.roles[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 gap-2 px-1.5">
          <Avatar>
            {user?.avatar_url && <AvatarImage src={`${env.apiUrl}${user.avatar_url}`} alt="" />}
            <AvatarFallback>{getInitials(user?.first_name, user?.last_name)}</AvatarFallback>
          </Avatar>
          <div className="hidden text-start leading-tight md:block">
            <p className="text-sm font-medium">
              {user ? `${user.first_name} ${user.last_name}` : "—"}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {primaryRole ? primaryRole.replace(/_/g, " ").toLowerCase() : ""}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">{user ? `${user.first_name} ${user.last_name}` : ""}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={ROUTES.settings}>
            <UserIcon /> {t("common.myProfile")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={ROUTES.settings}>
            <Settings /> {t("common.settings")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => void logout()}>
          <LogOut /> {t("common.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
