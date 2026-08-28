"use client";

import { createDataTableColumnHelper } from "@/components/data-table/columns";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { interpolate } from "@/lib/i18n/utils";
import type { Locale } from "@/lib/i18n/config";
import type { PromoCode } from "@/types/promo-code.types";

const columnHelper = createDataTableColumnHelper<PromoCode>();

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

function formatDate(value: string | null) {
  return value ? dateFormatter.format(new Date(value)) : "—";
}

/** Column defs are built once per locale (outside React) — `useTranslation` isn't available here. */
export function getPromoCodeColumns(locale: Locale) {
  const dict = dictionaries[locale];
  const t = dict.promoCodes.table;
  const common = dict.common;

  return columnHelper.columns([
    columnHelper.accessor("code", {
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.code} />,
      cell: ({ row }) => (
        <div>
          <span className="font-medium">{row.original.code}</span>
          <span className="block text-xs text-muted-foreground">{row.original.name}</span>
        </div>
      ),
    }),
    columnHelper.display({
      id: "discount",
      header: t.discount,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Badge variant="outline">{row.original.type === "PERCENTAGE" ? t.typePercentage : t.typeFixed}</Badge>
          <span className="text-muted-foreground">
            {row.original.type === "PERCENTAGE" ? `${row.original.value}%` : row.original.value}
          </span>
        </div>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("valid_from", {
      id: "valid_from",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.validFrom} />,
      cell: ({ getValue }) => <span className="text-muted-foreground">{formatDate(getValue())}</span>,
    }),
    columnHelper.accessor("valid_until", {
      id: "valid_until",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.validUntil} />,
      cell: ({ getValue }) => <span className="text-muted-foreground">{formatDate(getValue())}</span>,
    }),
    columnHelper.display({
      id: "usage",
      header: t.usage,
      cell: ({ row }) =>
        row.original.max_uses == null ? (
          <span className="text-muted-foreground">
            {interpolate(t.usageUnlimited, { count: row.original.used_count })}
          </span>
        ) : (
          <Badge variant={row.original.used_count >= row.original.max_uses ? "secondary" : "outline"}>
            {row.original.used_count} / {row.original.max_uses}
          </Badge>
        ),
      enableSorting: false,
    }),
    columnHelper.accessor("is_active", {
      id: "is_active",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.status} />,
      cell: ({ getValue }) => (
        <Badge variant={getValue() ? "success" : "secondary"}>{getValue() ? common.active : common.inactive}</Badge>
      ),
    }),
    columnHelper.display({
      id: "users",
      header: t.users,
      cell: ({ row }) =>
        row.original.users.length === 0 ? (
          <span className="text-muted-foreground">{t.allUsers}</span>
        ) : (
          <Badge variant="secondary">{interpolate(t.userCount, { count: row.original.users.length })}</Badge>
        ),
      enableSorting: false,
    }),
    columnHelper.display({
      id: "events",
      header: t.events,
      cell: ({ row }) =>
        row.original.events.length === 0 ? (
          <span className="text-muted-foreground">{t.allEvents}</span>
        ) : (
          <Badge variant="secondary">{interpolate(t.eventCount, { count: row.original.events.length })}</Badge>
        ),
      enableSorting: false,
    }),
  ]);
}
