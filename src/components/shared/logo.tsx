import Image from "next/image";

import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/logo.png"
        alt="MBFshow"
        width={36}
        height={36}
        priority
        className="size-9 shrink-0 rounded-lg shadow-lg shadow-primary/30"
      />
      {!collapsed && (
        <span className="text-base font-semibold tracking-tight text-sidebar-foreground">
          MBFshow
        </span>
      )}
    </div>
  );
}
