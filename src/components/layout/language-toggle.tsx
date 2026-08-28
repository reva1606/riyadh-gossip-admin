"use client";

import { Check, Languages } from "lucide-react";

import { cn } from "@/lib/utils";
import { LOCALES, LOCALE_LABEL } from "@/lib/i18n/config";
import { useTranslation } from "@/lib/i18n/language-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageToggle() {
  const { locale, setLocale, t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("common.language")}>
          <Languages className="size-4.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map((option) => (
          <DropdownMenuItem key={option} onClick={() => setLocale(option)}>
            <span className={cn("flex-1", option === "ar" && "font-arabic")}>
              {LOCALE_LABEL[option]}
            </span>
            {option === locale && <Check className="size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
