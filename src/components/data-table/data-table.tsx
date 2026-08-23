"use client";

import * as React from "react";
import { useTable } from "@tanstack/react-table";
import type { OnChangeFn, PaginationState, RowData, SortingState } from "@tanstack/react-table";

import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { DataTableColumnDef } from "./columns";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar, type DataTableFilterConfig } from "./data-table-toolbar";
import { dataTableFeatures } from "./table-features";

interface DataTableCommonProps<TData extends RowData> {
  columns: DataTableColumnDef<TData, unknown>[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  filters?: DataTableFilterConfig[];
  emptyTitle?: string;
  emptyDescription?: string;
  toolbarActions?: React.ReactNode;
  /** Renders a trailing "actions" column (dropdown menu, etc) for each row. */
  renderRowActions?: (row: TData) => React.ReactNode;
  getRowId?: (row: TData) => string;
  pageSizeOptions?: number[];
  totalLabel?: string;
}

interface ServerDataTableProps<TData extends RowData> extends DataTableCommonProps<TData> {
  mode: "server";
  data: TData[];
  pageCount: number;
  rowCount: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  search: string;
  onSearchChange: (value: string) => void;
  filterValues?: Record<string, string>;
  onFilterChange?: (filterId: string, value: string) => void;
}

interface ClientDataTableProps<TData extends RowData> extends DataTableCommonProps<TData> {
  mode: "client";
  data: TData[];
}

export type DataTableProps<TData extends RowData> = ServerDataTableProps<TData> | ClientDataTableProps<TData>;

const ACTIONS_COLUMN_ID = "actions";
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

/**
 * One reusable table for the whole admin panel, built on TanStack Table v9.
 *
 * - `mode: "server"` — the caller (a React Query hook) owns pagination/sorting
 *   and search/filter values; this component only renders the given page and
 *   fires the `on*Change` callbacks. Used for the Users list.
 * - `mode: "client"` — pass the full array once; pagination/sorting/filtering
 *   run entirely inside the table. Used for Roles/Permissions (small catalogs).
 *
 * Either way, callers only define columns + a data source — search, column
 * filters, sortable headers, pagination, loading and empty states are built in.
 */
export function DataTable<TData extends RowData>(props: DataTableProps<TData>) {
  const {
    columns,
    isLoading = false,
    searchPlaceholder,
    filters = [],
    emptyTitle = "No results",
    emptyDescription = "Try adjusting your search or filters.",
    toolbarActions,
    renderRowActions,
    getRowId,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    totalLabel,
  } = props;

  const isServer = props.mode === "server";

  const finalColumns = React.useMemo<DataTableColumnDef<TData, unknown>[]>(() => {
    if (!renderRowActions) return columns;
    const actionsColumn: DataTableColumnDef<TData, unknown> = {
      id: ACTIONS_COLUMN_ID,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => <div className="flex justify-end">{renderRowActions(row.original)}</div>,
      enableSorting: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    };
    return [...columns, actionsColumn];
  }, [columns, renderRowActions]);

  // Server-mode-only options (state/onPaginationChange/onSortingChange) are
  // spread in conditionally rather than set to `undefined` — `useTable`
  // merges options with `{...prev, ...tableOptions}` on every render, and an
  // explicit `undefined` value for a key overwrites (rather than falls back
  // to) the library's default internal state updater, which silently breaks
  // uncontrolled client-mode pagination/sorting.
  const table = useTable({
    features: dataTableFeatures,
    columns: finalColumns,
    data: props.data,
    getRowId: getRowId ? (row) => getRowId(row) : undefined,
    manualPagination: isServer,
    manualSorting: isServer,
    manualFiltering: isServer,
    ...(isServer
      ? {
          pageCount: props.pageCount,
          rowCount: props.rowCount,
          state: { pagination: props.pagination, sorting: props.sorting },
          onPaginationChange: props.onPaginationChange,
          onSortingChange: props.onSortingChange,
        }
      : {
          initialState: { pagination: { pageIndex: 0, pageSize: pageSizeOptions[0] ?? 10 } },
        }),
  });

  const searchValue = isServer ? props.search : (table.state.globalFilter as string | undefined) ?? "";
  const onSearchChange = isServer
    ? props.onSearchChange
    : (value: string) => table.setGlobalFilter(value);

  const getFilterValue = React.useCallback(
    (id: string) => {
      if (isServer) return props.filterValues?.[id] ?? "";
      return (table.getColumn(id)?.getFilterValue() as string | undefined) ?? "";
    },
    [isServer, props, table],
  );

  const setFilterValue = React.useCallback(
    (id: string, value: string) => {
      if (isServer) {
        props.onFilterChange?.(id, value);
      } else {
        table.getColumn(id)?.setFilterValue(value || undefined);
      }
    },
    [isServer, props, table],
  );

  const rows = table.getRowModel().rows;

  return (
    <div className="flex flex-col gap-4">
      <DataTableToolbar
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        getFilterValue={getFilterValue}
        setFilterValue={setFilterValue}
        actions={toolbarActions}
      />

      <div className="rounded-xl border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`}>
                  {finalColumns.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-5 w-full max-w-40" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={finalColumns.length} className="h-32 text-center">
                  <p className="font-medium">{emptyTitle}</p>
                  <p className="text-sm text-muted-foreground">{emptyDescription}</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} totalLabel={totalLabel} />
    </div>
  );
}
