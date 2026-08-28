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
import { useTranslation } from "@/lib/i18n/language-provider";
import type { PromoCode, PromoCodesListParams } from "@/types/promo-code.types";

import { getPromoCodeColumns } from "./columns";
import { PromoCodeFormSheet } from "./promo-code-form-sheet";

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
  const { t, locale } = useTranslation();
  const promoCodeColumns = React.useMemo(() => getPromoCodeColumns(locale), [locale]);

  const typeFilter: DataTableFilterConfig = {
    id: "type",
    label: t("promoCodes.filters.typeLabel"),
    options: [
      { label: t("promoCodes.filters.percentage"), value: "PERCENTAGE" },
      { label: t("promoCodes.filters.fixed"), value: "FIXED" },
    ],
  };

  const statusFilter: DataTableFilterConfig = {
    id: "is_active",
    label: t("promoCodes.filters.statusLabel"),
    options: [
      { label: t("common.active"), value: "true" },
      { label: t("common.inactive"), value: "false" },
    ],
  };

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
        title={t("promoCodes.title")}
        description={t("promoCodes.description")}
        actions={
          canCreate ? (
            <Button
              onClick={() =>
                setFormState((prev) => ({ open: true, promoCode: null, formKey: prev.formKey + 1 }))
              }
              className="gap-1.5"
            >
              <Plus className="size-4" />
              {t("promoCodes.createButton")}
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
        searchPlaceholder={t("promoCodes.searchPlaceholder")}
        filters={[typeFilter, statusFilter]}
        getRowId={(row) => String(row.id)}
        totalLabel={t("promoCodes.totalLabel")}
        renderRowActions={(promoCode) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">{t("common.rowActions")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                disabled={!canUpdate}
                onClick={() =>
                  setFormState((prev) => ({ open: true, promoCode, formKey: prev.formKey + 1 }))
                }
              >
                <Pencil /> {t("common.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem disabled={!canUpdate} onClick={() => void handleToggleStatus(promoCode)}>
                {promoCode.is_active ? (
                  <>
                    <PowerOff /> {t("promoCodes.actions.deactivate")}
                  </>
                ) : (
                  <>
                    <Power /> {t("promoCodes.actions.activate")}
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                disabled={!canDelete}
                onClick={() => setDeletingPromoCode(promoCode)}
              >
                <Trash2 /> {t("common.delete")}
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
            <DialogTitle>{t("promoCodes.delete.title")}</DialogTitle>
            <DialogDescription>
              {t("promoCodes.delete.descriptionPrefix")}{" "}
              <span className="font-medium text-foreground">{deletingPromoCode?.code}</span>{" "}
              {t("promoCodes.delete.descriptionSuffix")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingPromoCode(null)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => void handleConfirmDelete()}
            >
              {deleteMutation.isPending ? t("common.deleting") : t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
