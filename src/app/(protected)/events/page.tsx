"use client";

import * as React from "react";
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { Ban, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { PermissionGuard } from "@/components/layout/permission-guard";
import { DataTable } from "@/components/data-table/data-table";
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
import { useCancelEventMutation, useDeleteEventMutation, useEventsQuery } from "@/hooks/use-events";
import { useTranslation } from "@/lib/i18n/language-provider";
import type { Event, EventsListParams } from "@/types/event.types";

import { getEventColumns } from "./columns";
import { EventFormSheet } from "./event-form-sheet";

const SORTABLE_COLUMN_IDS = new Set(["title", "start_date", "created_at"]);

export default function EventsPage() {
  return (
    <PermissionGuard permission="event.view">
      <EventsPageContent />
    </PermissionGuard>
  );
}

function EventsPageContent() {
  const { hasPermission } = useAuth();
  const canCreate = hasPermission("event.create");
  const canUpdate = hasPermission("event.update");
  const canDelete = hasPermission("event.delete");
  const canCancel = hasPermission("event.cancel");
  const { t, locale } = useTranslation();
  const eventColumns = React.useMemo(() => getEventColumns(locale), [locale]);

  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState("");

  // `formKey` forces EventFormSheet to remount on every open — it's rendered
  // unconditionally below (only its `open` prop toggles), so without a key
  // change its useForm()/useState() would never re-initialize from a new
  // `event`, and editing a second event would keep showing the first one's
  // (or the create form's) stale data.
  const [formState, setFormState] = React.useState<{ open: boolean; event: Event | null; formKey: number }>({
    open: false,
    event: null,
    formKey: 0,
  });
  const [deletingEvent, setDeletingEvent] = React.useState<Event | null>(null);
  const [cancellingEvent, setCancellingEvent] = React.useState<Event | null>(null);

  const sort = sorting[0];
  const params: EventsListParams = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: search || undefined,
    sortBy: sort && SORTABLE_COLUMN_IDS.has(sort.id) ? (sort.id as EventsListParams["sortBy"]) : undefined,
    sortOrder: sort ? (sort.desc ? "DESC" : "ASC") : undefined,
  };

  const eventsQuery = useEventsQuery(params);
  const deleteMutation = useDeleteEventMutation();
  const cancelMutation = useCancelEventMutation();

  const events = eventsQuery.data?.data ?? [];

  function handleSearchChange(value: string) {
    setSearch(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  async function handleConfirmDelete() {
    if (!deletingEvent) return;
    try {
      await deleteMutation.mutateAsync(deletingEvent.id);
      setDeletingEvent(null);
    } catch {
      // Error toast already surfaced by the mutation's onError.
    }
  }

  async function handleConfirmCancel() {
    if (!cancellingEvent) return;
    try {
      await cancelMutation.mutateAsync(cancellingEvent.id);
      setCancellingEvent(null);
    } catch {
      // Error toast already surfaced by the mutation's onError.
    }
  }

  return (
    <>
      <PageHeader
        title={t("events.title")}
        description={t("events.description")}
        actions={
          canCreate ? (
            <Button
              onClick={() => setFormState((prev) => ({ open: true, event: null, formKey: prev.formKey + 1 }))}
              className="gap-1.5"
            >
              <Plus className="size-4" />
              {t("events.createButton")}
            </Button>
          ) : undefined
        }
      />

      <DataTable
        mode="server"
        columns={eventColumns}
        data={events}
        pageCount={eventsQuery.data?.meta.totalPages ?? 0}
        rowCount={eventsQuery.data?.meta.total ?? 0}
        isLoading={eventsQuery.isLoading}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder={t("events.searchPlaceholder")}
        getRowId={(row) => String(row.id)}
        totalLabel={t("events.totalLabel")}
        renderRowActions={(event) => {
          const isCancelled = event.status === "CANCELLED";
          // Uses the query's own fetch timestamp rather than Date.now() so this
          // stays a pure render computation — good enough for a UI-only gate
          // since the backend re-validates start_date authoritatively anyway.
          const hasStarted = new Date(event.start_date).getTime() <= eventsQuery.dataUpdatedAt;
          return (
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
                    setFormState((prev) => ({ open: true, event, formKey: prev.formKey + 1 }))
                  }
                >
                  <Pencil /> {t("common.edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  disabled={!canCancel || isCancelled || hasStarted}
                  onClick={() => setCancellingEvent(event)}
                >
                  <Ban /> {t("events.cancelAction")}
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" disabled={!canDelete} onClick={() => setDeletingEvent(event)}>
                  <Trash2 /> {t("common.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }}
      />

      <EventFormSheet
        key={formState.formKey}
        open={formState.open}
        onOpenChange={(open) => setFormState((prev) => ({ ...prev, open }))}
        event={formState.event}
      />

      <Dialog open={!!deletingEvent} onOpenChange={(open) => !open && setDeletingEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("events.delete.title")}</DialogTitle>
            <DialogDescription>
              {t("events.delete.descriptionPrefix")}{" "}
              <span className="font-medium text-foreground">{deletingEvent?.title}</span>{" "}
              {t("events.delete.descriptionSuffix")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingEvent(null)}>
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

      <Dialog open={!!cancellingEvent} onOpenChange={(open) => !open && setCancellingEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("events.cancel.title")}</DialogTitle>
            <DialogDescription>
              {t("events.cancel.descriptionPrefix")}{" "}
              <span className="font-medium text-foreground">{cancellingEvent?.title}</span>{" "}
              {t("events.cancel.descriptionSuffix")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancellingEvent(null)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              disabled={cancelMutation.isPending}
              onClick={() => void handleConfirmCancel()}
            >
              {cancelMutation.isPending ? t("events.cancel.cancelling") : t("events.cancel.confirmButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
