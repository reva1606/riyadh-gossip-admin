"use client";

import * as React from "react";
import { useQueries } from "@tanstack/react-query";
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
import { QUERY_KEYS } from "@/config/constants";
import { usersService } from "@/services/users.service";
import {
  useActivateUserMutation,
  useDeactivateUserMutation,
  useDeleteUserMutation,
  useUsersQuery,
} from "@/hooks/use-users";
import type { User, UsersListParams } from "@/types/user.types";

import { createUserColumns } from "./columns";
import { UserEditSheet } from "./user-edit-sheet";
import { UserFormDialog } from "./user-form-dialog";

const STATUS_FILTER: DataTableFilterConfig = {
  id: "status",
  label: "Status",
  options: [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
  ],
};

const SORTABLE_COLUMN_IDS = new Set(["first_name", "email", "status", "created_at"]);

export default function UsersPage() {
  return (
    <PermissionGuard permission="user.view">
      <UsersPageContent />
    </PermissionGuard>
  );
}

function UsersPageContent() {
  const { hasPermission, user: currentUser } = useAuth();
  const canCreate = hasPermission("user.create");
  const canUpdate = hasPermission("user.update");
  const canDelete = hasPermission("user.delete");

  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("");

  const [isCreateOpen, setCreateOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [deletingUser, setDeletingUser] = React.useState<User | null>(null);

  const sort = sorting[0];
  const params: UsersListParams = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: search || undefined,
    status: (status || undefined) as UsersListParams["status"],
    sortBy: sort && SORTABLE_COLUMN_IDS.has(sort.id) ? (sort.id as UsersListParams["sortBy"]) : undefined,
    sortOrder: sort ? (sort.desc ? "DESC" : "ASC") : undefined,
  };

  const usersQuery = useUsersQuery(params);
  const activateMutation = useActivateUserMutation();
  const deactivateMutation = useDeactivateUserMutation();
  const deleteMutation = useDeleteUserMutation();

  const users = React.useMemo(() => usersQuery.data?.data ?? [], [usersQuery.data]);

  // User list rows don't include roles, so fetch each visible row's roles the
  // same way the Roles page fetches per-role permission counts — one cheap
  // request per row on a small paginated page.
  const roleQueries = useQueries({
    queries: users.map((user) => ({
      queryKey: QUERY_KEYS.userRoles(user.id),
      queryFn: () => usersService.listRoles(user.id),
      staleTime: 30_000,
    })),
  });

  const rolesByUserId = React.useMemo(() => {
    const map: Record<number, (typeof roleQueries)[number]["data"]> = {};
    users.forEach((user, index) => {
      map[user.id] = roleQueries[index]?.data;
    });
    return map;
  }, [users, roleQueries]);

  const columns = React.useMemo(() => createUserColumns(rolesByUserId), [rolesByUserId]);

  function handleFilterChange(filterId: string, value: string) {
    if (filterId === "status") {
      setStatus(value);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  async function handleToggleStatus(user: User) {
    try {
      if (user.status === "ACTIVE") {
        await deactivateMutation.mutateAsync(user.id);
      } else {
        await activateMutation.mutateAsync(user.id);
      }
    } catch {
      // Error toast already surfaced by the mutation's onError.
    }
  }

  async function handleConfirmDelete() {
    if (!deletingUser) return;
    try {
      await deleteMutation.mutateAsync(deletingUser.id);
      setDeletingUser(null);
    } catch {
      // Error toast already surfaced by the mutation's onError.
    }
  }

  return (
    <>
      <PageHeader
        title="Users"
        description="View, edit and manage every account — customers and staff alike."
        actions={
          canCreate ? (
            <Button onClick={() => setCreateOpen(true)} className="gap-1.5">
              <Plus className="size-4" />
              Add user
            </Button>
          ) : undefined
        }
      />

      <DataTable
        mode="server"
        columns={columns}
        data={users}
        pageCount={usersQuery.data?.meta.totalPages ?? 0}
        rowCount={usersQuery.data?.meta.total ?? 0}
        isLoading={usersQuery.isLoading}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        search={search}
        onSearchChange={handleSearchChange}
        filterValues={{ status }}
        onFilterChange={handleFilterChange}
        searchPlaceholder="Search by name or email…"
        filters={[STATUS_FILTER]}
        getRowId={(row) => String(row.id)}
        totalLabel="Users"
        renderRowActions={(user) => {
          const isSelf = user.id === currentUser?.id;
          const isSuperAdmin = (rolesByUserId[user.id] ?? []).some((role) => role.name === "SUPER_ADMIN");
          const blockDeactivate = user.status === "ACTIVE" && (isSelf || isSuperAdmin);
          const blockDelete = isSelf || isSuperAdmin;
          const blockedReason = isSelf
            ? "your own account"
            : isSuperAdmin
              ? "a SUPER_ADMIN account"
              : undefined;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontal className="size-4" />
                  <span className="sr-only">Row actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled={!canUpdate} onClick={() => setEditingUser(user)}>
                  <Pencil /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!canUpdate || blockDeactivate}
                  title={blockDeactivate ? `You cannot deactivate ${blockedReason}` : undefined}
                  onClick={() => void handleToggleStatus(user)}
                >
                  {user.status === "ACTIVE" ? (
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
                  disabled={!canDelete || blockDelete}
                  title={blockDelete ? `You cannot delete ${blockedReason}` : undefined}
                  onClick={() => setDeletingUser(user)}
                >
                  <Trash2 /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }}
      />

      <UserFormDialog open={isCreateOpen} onOpenChange={setCreateOpen} />

      <UserEditSheet
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
      />

      <Dialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
            <DialogDescription>
              This permanently deletes{" "}
              <span className="font-medium text-foreground">
                {deletingUser ? `${deletingUser.first_name} ${deletingUser.last_name}` : "this user"}
              </span>
              . This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingUser(null)}>
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
