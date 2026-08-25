"use client";

import * as React from "react";
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Plus, Power, PowerOff, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { PermissionGuard } from "@/components/layout/permission-guard";
import { DataTable } from "@/components/data-table/data-table";
import type { DataTableFilterConfig } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/store/auth-context";
import {
  useActivatePromoCodeMutation,
  useDeactivatePromoCodeMutation,
  useDeletePromoCodeMutation,
  usePromoCodesQuery,
} from "@/hooks/use-promo-codes";
import type { PromoCode, PromoCodesListParams } from "@/types/promo-code.types";

import { promoCodeColumns } from "./columns";
import { PromoCodeFormSheet } from "./promo-code-form-sheet";

const TYPE_FILTER: DataTableFilterConfig = {
  id: "type",
  label: "Type",
  options: [
    { label: "Percentage", value: "PERCENTAGE" },
    { label: "Fixed", value: "FIXED" },
  ],
};

const STATUS_FILTER: DataTableFilterConfig = {
  id: "is_active",
  label: "Status",
  options: [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ],
};

const SORTABLE_COLUMN_IDS = new Set(["code", "value", "valid_from", "valid_until", "is_active", "created_at"]);

export default function PromoCodesPage() {
  return (
    <PermissionGuard permission="promocode.view">
      <PromoCodesPageContent />
    </PermissionGuard>
  );
}

function PromoCodesPageContent() {
  const { hasPermission } = useAuth();
  const canCreate = hasPermission("promocode.create");
  const canUpdate = hasPermission("promocode.update");
  const canDelete = hasPermission("promocode.delete");

  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState("");
  const [isActive, setIsActive] = React.useState("");

  // `formKey` forces PromoCodeFormSheet to remount on every open — see
  // EventFormSheet's identical rationale for why this key change is needed.
  const [formState, setFormState] = React.useState<{ open: boolean; promoCode: PromoCode | null; formKey: number }>({
    open: false,
    promoCode: null,
    formKey: 0,
  });
  const [deletingPromoCode, setDeletingPromoCode] = React.useState<PromoCode | null>(null);

  const sort = sorting[0];
  const params: PromoCodesListParams = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: search || undefined,
    type: (type || undefined) as PromoCodesListParams["type"],
    is_active: (isActive || undefined) as PromoCodesListParams["is_active"],
    sortBy: sort && SORTABLE_COLUMN_IDS.has(sort.id) ? (sort.id as PromoCodesListParams["sortBy"]) : undefined,
    sortOrder: sort ? (sort.desc ? "DESC" : "ASC") : undefined,
  };

  const promoCodesQuery = usePromoCodesQuery(params);
  const activateMutation = useActivatePromoCodeMutation();
  const deactivateMutation = useDeactivatePromoCodeMutation();
  const deleteMutation = useDeletePromoCodeMutation();

  const promoCodes = promoCodesQuery.data?.data ?? [];

  function handleFilterChange(filterId: string, value: string) {
    if (filterId === "type") setType(value);
    if (filterId === "is_active") setIsActive(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  async function handleToggleStatus(promoCode: PromoCode) {
    try {
      if (promoCode.is_active) {
        await deactivateMutation.mutateAsync(promoCode.id);
      } else {
        await activateMutation.mutateAsync(promoCode.id);
      }
    } catch {
      // Error toast already surfaced by the mutation's onError.
    }
  }

  async function handleConfirmDelete() {
    if (!deletingPromoCode) return;
    try {
      await deleteMutation.mutateAsync(deletingPromoCode.id);
      setDeletingPromoCode(null);
    } catch {
      // Error toast already surfaced by the mutation's onError.
    }
  }

  return (
    <>
      <PageHeader
        title="Promo Codes"
        description="Create and manage discount codes, their validity windows and restrictions."
        actions={
          canCreate ? (
            <Button
              onClick={() =>
                setFormState((prev) => ({ open: true, promoCode: null, formKey: prev.formKey + 1 }))
              }
              className="gap-1.5"
            >
              <Plus className="size-4" />
              Create promo code
            </Button>
          ) : undefined
        }
      />

      <DataTable
        mode="server"
        columns={promoCodeColumns}
        data={promoCodes}
        pageCount={promoCodesQuery.data?.meta.totalPages ?? 0}
        rowCount={promoCodesQuery.data?.meta.total ?? 0}
        isLoading={promoCodesQuery.isLoading}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        search={search}
        onSearchChange={handleSearchChange}
        filterValues={{ type, is_active: isActive }}
        onFilterChange={handleFilterChange}
        searchPlaceholder="Search by name or code…"
        filters={[TYPE_FILTER, STATUS_FILTER]}
        getRowId={(row) => String(row.id)}
        totalLabel="Promo codes"
        renderRowActions={(promoCode) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Row actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                disabled={!canUpdate}
                onClick={() =>
                  setFormState((prev) => ({ open: true, promoCode, formKey: prev.formKey + 1 }))
                }
              >
                <Pencil /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem disabled={!canUpdate} onClick={() => void handleToggleStatus(promoCode)}>
                {promoCode.is_active ? (
                  <>
                    <PowerOff /> Deactivate
                  </>
                ) : (
                  <>
                    <Power /> Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                disabled={!canDelete}
                onClick={() => setDeletingPromoCode(promoCode)}
              >
                <Trash2 /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <PromoCodeFormSheet
        key={formState.formKey}
        open={formState.open}
        onOpenChange={(open) => setFormState((prev) => ({ ...prev, open }))}
        promoCode={formState.promoCode}
      />

      <Dialog open={!!deletingPromoCode} onOpenChange={(open) => !open && setDeletingPromoCode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete promo code</DialogTitle>
            <DialogDescription>
              This permanently deletes{" "}
              <span className="font-medium text-foreground">{deletingPromoCode?.code}</span>. This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingPromoCode(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => void handleConfirmDelete()}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
