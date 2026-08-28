"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useTranslation } from "@/lib/i18n/language-provider";

export interface DataTableFilterOption {
  label: string;
  value: string;
}

export interface DataTableFilterConfig {
  /** Column id (server mode) or filter key (client mode) this dropdown drives. */
  id: string;
  label: string;
  options: DataTableFilterOption[];
  placeholder?: string;
}

const ALL_VALUE = "__all__";

interface DataTableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters: DataTableFilterConfig[];
  getFilterValue: (id: string) => string;
  setFilterValue: (id: string, value: string) => void;
  actions?: React.ReactNode;
}

/** Search box (debounced) + config-driven filter dropdowns + a slot for page-level actions (e.g. "+ Create role"). */
export function DataTableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters,
  getFilterValue,
  setFilterValue,
  actions,
}: DataTableToolbarProps) {
  const { t } = useTranslation();
  const [localSearch, setLocalSearch] = React.useState(searchValue);
  const debouncedSearch = useDebouncedValue(localSearch, 300);

  // Keep the input in sync if the parent resets search externally (e.g.
  // "Clear"), without the extra render an effect-based sync would cost —
  // this is React's documented "adjust state during render" pattern.
  const [prevSearchValue, setPrevSearchValue] = React.useState(searchValue);
  if (searchValue !== prevSearchValue) {
    setPrevSearchValue(searchValue);
    setLocalSearch(searchValue);
  }

  React.useEffect(() => {
    if (debouncedSearch !== searchValue) onSearchChange(debouncedSearch);
    // Only the debounced value should retrigger this — onSearchChange/searchValue are read, not depended on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const activeFilterCount = filters.filter((filter) => getFilterValue(filter.id)).length;
  const hasActiveState = activeFilterCount > 0 || searchValue.length > 0;

  function clearAll() {
    setLocalSearch("");
    onSearchChange("");
    filters.forEach((filter) => setFilterValue(filter.id, ""));
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 inset-s-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={localSearch}
            onChange={(event) => setLocalSearch(event.target.value)}
            placeholder={searchPlaceholder ?? t("common.searchPlaceholder")}
            className="ps-8"
          />
        </div>

        {filters.map((filter) => (
          <Select
            key={filter.id}
            value={getFilterValue(filter.id) || ALL_VALUE}
            onValueChange={(value) => setFilterValue(filter.id, value === ALL_VALUE ? "" : value)}
          >
            <SelectTrigger className="h-10 w-[160px]">
              <SelectValue placeholder={filter.placeholder ?? filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>
                {t("common.all")} {filter.label}
              </SelectItem>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        {hasActiveState && (
          <Button type="button" variant="ghost" size="sm" onClick={clearAll} className="gap-1.5 text-muted-foreground">
            <X className="size-3.5" />
            {t("common.clear")}
          </Button>
        )}
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
