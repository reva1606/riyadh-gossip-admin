"use client";

import Link from "next/link";
import { LogOut, Settings, User as UserIcon } from "lucide-react";

import { ROUTES } from "@/config/routes";
import { useAuth } from "@/store/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  const primaryRole = user?.roles[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 gap-2 px-1.5">
          <Avatar>
            <AvatarFallback>{getInitials(user?.first_name, user?.last_name)}</AvatarFallback>
          </Avatar>
          <div className="hidden text-left leading-tight md:block">
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
            <UserIcon /> My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={ROUTES.settings}>
            <Settings /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => void logout()}>
          <LogOut /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
