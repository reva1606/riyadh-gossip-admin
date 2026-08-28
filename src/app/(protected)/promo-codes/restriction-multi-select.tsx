"use client";

import * as React from "react";
import { ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";

export interface RestrictionOption {
  id: number;
  label: string;
  sublabel?: string;
}

interface RestrictionMultiSelectProps {
  selectedOptions: RestrictionOption[];
  onChange: (options: RestrictionOption[]) => void;
  search: string;
  onSearchChange: (value: string) => void;
  options: RestrictionOption[];
  isLoading: boolean;
  placeholder: string;
  searchPlaceholder: string;
  emptyLabel: string;
  disabled?: boolean;
}

/**
 * Generic id multi-picker backed by a live search query — used for a promo
 * code's optional user/event restrictions (no ids selected means
 * unrestricted). Keeps each selection's display label alongside its id so
 * chosen rows still render correctly once they scroll out of the current
 * search results.
 */
export function RestrictionMultiSelect({
  selectedOptions,
  onChange,
  search,
  onSearchChange,
  options,
  isLoading,
  placeholder,
  searchPlaceholder,
  emptyLabel,
  disabled,
}: RestrictionMultiSelectProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const selectedIds = React.useMemo(() => new Set(selectedOptions.map((option) => option.id)), [selectedOptions]);

  const visibleOptions = React.useMemo(() => {
    const byId = new Map(options.map((option) => [option.id, option]));
    for (const option of selectedOptions) {
      if (!byId.has(option.id)) byId.set(option.id, option);
    }
    return Array.from(byId.values());
  }, [options, selectedOptions]);

  function toggle(option: RestrictionOption) {
    if (selectedIds.has(option.id)) {
      onChange(selectedOptions.filter((selected) => selected.id !== option.id));
    } else {
      onChange([...selectedOptions, option]);
    }
  }

  function remove(id: number) {
    onChange(selectedOptions.filter((option) => option.id !== id));
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className="w-full justify-between font-normal"
          >
            <span className={cn(selectedOptions.length === 0 && "text-muted-foreground")}>
              {selectedOptions.length > 0
                ? t("promoCodes.restrictionSelect.selectedCount", { count: selectedOptions.length })
                : placeholder}
            </span>
            <ChevronsUpDown className="size-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="border-b border-border p-2">
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-2">
            {isLoading ? (
              <div className="flex flex-col gap-2 p-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            ) : visibleOptions.length === 0 ? (
              <p className="p-2 text-sm text-muted-foreground">{emptyLabel}</p>
            ) : (
              visibleOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50"
                >
                  <Checkbox checked={selectedIds.has(option.id)} onCheckedChange={() => toggle(option)} className="mt-0.5" />
                  <span>
                    <span className="font-medium">{option.label}</span>
                    {option.sublabel && (
                      <span className="block text-xs text-muted-foreground">{option.sublabel}</span>
                    )}
                  </span>
                </label>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>

      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedOptions.map((option) => (
            <Badge key={option.id} variant="secondary" className="gap-1 pe-1">
              {option.label}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => remove(option.id)}
                  className="rounded-full p-0.5 hover:bg-background/60"
                  aria-label={t("promoCodes.restrictionSelect.removeAria", { label: option.label })}
                >
                  <X className="size-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
