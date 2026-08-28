"use client";

import * as React from "react";
import { useQueries } from "@tanstack/react-query";
import {
  MoreHorizontal,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";

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
import { useDeleteRoleMutation, useRolesQuery } from "@/hooks/use-roles";
import { QUERY_KEYS } from "@/config/constants";
import { rolesService } from "@/services/roles.service";
import { useTranslation } from "@/lib/i18n/language-provider";
import type { RoleDto } from "@/types/role.types";

import { createRoleColumns } from "./columns";
import { RoleFormDialog } from "./role-form-dialog";
import { RolePermissionsSheet } from "./role-permissions-sheet";

// Stable reference so a `data ?? EMPTY_ROLES` fallback doesn't invalidate
// memoized work on every render.
const EMPTY_ROLES: never[] = [];

export default function RolesPage() {
  return (
    <PermissionGuard permission="role.view">
      <RolesPageContent />
    </PermissionGuard>
  );
}

function RolesPageContent() {
  const { hasPermission } = useAuth();
  const canCreate = hasPermission("role.create");
  const canUpdate = hasPermission("role.update");
  const canDelete = hasPermission("role.delete");
  const { t, locale } = useTranslation();

  const rolesQuery = useRolesQuery();
  const deleteMutation = useDeleteRoleMutation();

  const [formState, setFormState] = React.useState<{
    open: boolean;
    role: RoleDto | null;
  }>({
    open: false,
    role: null,
  });
  const [permissionsRole, setPermissionsRole] = React.useState<RoleDto | null>(
    null,
  );
  const [deletingRole, setDeletingRole] = React.useState<RoleDto | null>(null);

  const roles = rolesQuery.data ?? EMPTY_ROLES;

  // Roles is a small catalog (dozens of rows), so one permissions request per
  // role to drive the "permission count" column is cheap and simple.
  const permissionCountQueries = useQueries({
    queries: roles.map((role) => ({
      queryKey: QUERY_KEYS.rolePermissions(role.id),
      queryFn: () => rolesService.listPermissions(role.id),
      staleTime: 30_000,
    })),
  });

  const permissionCounts = React.useMemo(() => {
    const counts: Record<number, number | undefined> = {};
    roles.forEach((role, index) => {
      counts[role.id] = permissionCountQueries[index]?.data?.length;
    });
    return counts;
  }, [roles, permissionCountQueries]);

  const columns = React.useMemo(
    () => createRoleColumns(locale, permissionCounts),
    [locale, permissionCounts],
  );

  async function handleConfirmDelete() {
    if (!deletingRole) return;
    try {
      await deleteMutation.mutateAsync(deletingRole.id);
      setDeletingRole(null);
    } catch {
      // Error toast already surfaced by the mutation's onError.
    }
  }

  return (
    <>
      <PageHeader
        title={t("roles.title")}
        description={t("roles.description")}
        actions={
          canCreate ? (
            <Button
              onClick={() => setFormState({ open: true, role: null })}
              className="gap-1.5"
            >
              <Plus className="size-4" />
              {t("roles.createButton")}
            </Button>
          ) : undefined
        }
      />

      <DataTable
        mode="client"
        columns={columns}
        data={roles}
        isLoading={rolesQuery.isLoading}
        searchPlaceholder={t("roles.searchPlaceholder")}
        totalLabel={t("roles.totalLabel")}
        getRowId={(row) => String(row.id)}
        renderRowActions={(role) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">{t("common.rowActions")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setPermissionsRole(role)}>
                <ShieldCheck /> {t("roles.rowActions.permissions")}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!canUpdate}
                onClick={() => setFormState({ open: true, role })}
              >
                <Pencil /> {t("common.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                disabled={!canDelete || role.is_system}
                onClick={() => setDeletingRole(role)}
              >
                <Trash2 /> {t("common.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <RoleFormDialog
        open={formState.open}
        onOpenChange={(open) => setFormState((prev) => ({ ...prev, open }))}
        role={formState.role}
      />

      <RolePermissionsSheet
        role={permissionsRole}
        open={!!permissionsRole}
        onOpenChange={(open) => !open && setPermissionsRole(null)}
      />

      <Dialog
        open={!!deletingRole}
        onOpenChange={(open) => !open && setDeletingRole(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("roles.delete.title")}</DialogTitle>
            <DialogDescription>
              {t("roles.delete.descriptionPrefix")}{" "}
              <span className="font-medium text-foreground">
                {deletingRole?.name}
              </span>{" "}
              {t("roles.delete.descriptionSuffix")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingRole(null)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => void handleConfirmDelete()}
            >
              {deleteMutation.isPending
                ? t("common.deleting")
                : t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
