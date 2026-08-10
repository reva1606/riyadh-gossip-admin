import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[#8e7cff] text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/30">
        G4
      </div>
      {!collapsed && (
        <span className="text-base font-semibold tracking-tight text-sidebar-foreground">
          Glitch404
        </span>
      )}
    </div>
  );
}
