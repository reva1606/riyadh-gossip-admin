import { Search } from "lucide-react";

import { useTranslation } from "@/lib/i18n/language-provider";
import { Input } from "@/components/ui/input";

/**
 * Global search affordance. Wires up to real data once a search endpoint
 * exists — for now it's the reusable, fully-styled shell every header needs.
 */
export function SearchInput() {
  const { t } = useTranslation();

  return (
    <div className="relative hidden w-full max-w-sm md:block">
      <Search className="pointer-events-none absolute top-1/2 inset-s-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={t("common.searchPlaceholder")}
        className="border-transparent bg-muted/60 ps-9 focus-visible:border-ring"
      />
      <kbd className="pointer-events-none absolute top-1/2 inset-e-3 -translate-y-1/2 rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
        ⌘K
      </kbd>
    </div>
  );
}
