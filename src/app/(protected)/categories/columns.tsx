"use client";

import { createDataTableColumnHelper } from "@/components/data-table/columns";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { dictionaries } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { Category } from "@/types/category.types";

const columnHelper = createDataTableColumnHelper<Category>();

/** Column defs are built once per locale (outside React) — `useTranslation` isn't available here. */
export function getCategoryColumns(locale: Locale) {
  const t = dictionaries[locale].categories.table;

  return columnHelper.columns([
    columnHelper.accessor("name", {
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.name} />,
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    }),
    columnHelper.accessor("description", {
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.description} />,
      cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() || "—"}</span>,
      enableSorting: false,
    }),
  ]);
}
