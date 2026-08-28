"use client";

import * as React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/lib/i18n/language-provider";

/** Password field with a visibility toggle — every password input in the app should use this. */
function PasswordInput({ className, ...props }: React.ComponentProps<"input">) {
  const [visible, setVisible] = React.useState(false);
  const { t } = useTranslation();

  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute top-1/2 inset-s-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type={visible ? "text" : "password"}
        className={cn("ps-9 pe-9", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute top-1/2 inset-e-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        tabIndex={-1}
        aria-label={visible ? t("common.hidePassword") : t("common.showPassword")}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export { PasswordInput };
