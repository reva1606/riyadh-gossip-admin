import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef, RowData } from "@tanstack/react-table";

import { dataTableFeatures, type DataTableFeatures } from "./table-features";

/** Column-def type alias bound to the shared feature registry — use this instead of the bare `ColumnDef`. */
export type DataTableColumnDef<TData extends RowData, TValue = unknown> = ColumnDef<
  DataTableFeatures,
  TData,
  TValue
>;

/** Typed `createColumnHelper` pre-bound to the shared feature registry. */
export function createDataTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<typeof dataTableFeatures, TData>();
}
