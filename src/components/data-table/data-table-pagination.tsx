"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import type { ReactTable } from "@tanstack/react-table";
import type { RowData } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/lib/i18n/language-provider";

import type { DataTableFeatures } from "./table-features";

interface DataTablePaginationProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
  pageSizeOptions?: number[];
  totalLabel?: string;
}

export function DataTablePagination<TData extends RowData>({
  table,
  pageSizeOptions = [10, 20, 50, 100],
  totalLabel,
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation();
  const { pageIndex, pageSize } = table.state.pagination;
  const pageCount = table.getPageCount();
  const rowCount = table.getRowCount();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {rowCount > 0 ? (
          <>
            {totalLabel ?? t("common.total")}:{" "}
            <span className="font-medium text-foreground">{rowCount}</span>
          </>
        ) : (
          t("common.noResults")
        )}
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t("common.rowsPerPage")}</span>
          <Select value={String(pageSize)} onValueChange={(value) => table.setPageSize(Number(value))}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground">
          {t("common.pageOf", { current: pageCount === 0 ? 0 : pageIndex + 1, total: Math.max(pageCount, 1) })}
        </p>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label={t("common.firstPage")}
          >
            <ChevronsLeft className="size-4 rtl:-scale-x-100" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label={t("common.previousPage")}
          >
            <ChevronLeft className="size-4 rtl:-scale-x-100" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label={t("common.nextPage")}
          >
            <ChevronRight className="size-4 rtl:-scale-x-100" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
            aria-label={t("common.lastPage")}
          >
            <ChevronsRight className="size-4 rtl:-scale-x-100" />
          </Button>
        </div>
      </div>
    </div>
  );
}
