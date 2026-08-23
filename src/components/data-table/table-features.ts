import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_equalsString,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  tableFeatures,
} from "@tanstack/react-table";

/**
 * One shared TanStack Table v9 feature registry used by every `DataTable`
 * instance in the app — both server-mode (Users) and client-mode
 * (Roles/Permissions) tables register the exact same features so
 * `createColumnHelper`/`ColumnDef` stay consistent across every page.
 *
 * Server-mode tables set `manualPagination`/`manualSorting`/`manualFiltering`
 * so these row-model factories are simply bypassed (the server already
 * paginated/sorted the page), but the features must still be registered for
 * column/header APIs like `column.toggleSorting()` to exist at all.
 */
export const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString, equalsString: filterFn_equalsString },
  sortFns: { alphanumeric: sortFn_alphanumeric, datetime: sortFn_datetime },
});

export type DataTableFeatures = typeof dataTableFeatures;
