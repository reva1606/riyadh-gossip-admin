"use client";

import * as React from "react";

import { useAuth } from "@/store/auth-context";
import { usePermissionsQuery } from "@/hooks/use-permissions";
import {
  useAssignRolePermissionMutation,
  useRemoveRolePermissionMutation,
  useRolePermissionsQuery,
} from "@/hooks/use-roles";
import { useTranslation } from "@/lib/i18n/language-provider";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import type { PermissionDto, RoleDto } from "@/types/role.types";

interface RolePermissionsSheetProps {
  role: RoleDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RolePermissionsSheet({
  role,
  open,
  onOpenChange,
}: RolePermissionsSheetProps) {
  const { t } = useTranslation();
  const { hasPermission, user: currentUser } = useAuth();
  // Backend-enforced (see RolePermissionsService.assertNotOwnRole): editing a
  // role's permissions changes what everyone holding it can do, including
  // yourself — letting someone edit a role they hold is a self-privilege-
  // escalation path, so it's blocked here too regardless of role.update.
  const isOwnRole = !!role && !!currentUser?.roles.includes(role.name);
  const canManage =
    hasPermission("role.update") && !role?.is_system && !isOwnRole;

  const allPermissionsQuery = usePermissionsQuery();
  const rolePermissionsQuery = useRolePermissionsQuery(role?.id ?? null);
  const assignMutation = useAssignRolePermissionMutation();
  const removeMutation = useRemoveRolePermissionMutation();

  const assignedIds = new Set(
    (rolePermissionsQuery.data ?? []).map((permission) => permission.id),
  );

  const groupedByModule = React.useMemo(() => {
    const groups = new Map<string, PermissionDto[]>();
    for (const permission of allPermissionsQuery.data ?? []) {
      const list = groups.get(permission.module) ?? [];
      list.push(permission);
      groups.set(permission.module, list);
    }
    return groups;
  }, [allPermissionsQuery.data]);

  function handleToggle(permissionId: number, checked: boolean) {
    if (!role) return;
    if (checked) {
      assignMutation.mutate({
        id: role.id,
        payload: { permission_id: permissionId },
      });
    } else {
      removeMutation.mutate({ id: role.id, permissionId });
    }
  }

  const isLoading =
    allPermissionsQuery.isLoading || rolePermissionsQuery.isLoading;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        title={
          role
            ? t("roles.permissionsSheet.title", { name: role.name })
            : t("roles.permissionsSheet.fallbackTitle")
        }
        className="w-full gap-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border">
          <h2 className="text-lg font-semibold">
            {role?.name ?? t("roles.permissionsSheet.fallbackHeading")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {role?.is_system
              ? t("roles.permissionsSheet.systemHint")
              : isOwnRole
                ? t("roles.permissionsSheet.ownRoleHint")
                : t("roles.permissionsSheet.toggleHint")}
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {Array.from(groupedByModule.entries()).map(
                ([module, permissions]) => (
                  <div key={module}>
                    <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      {module}
                    </p>
                    <div className="flex flex-col gap-2">
                      {permissions.map((permission) => (
                        <label
                          key={permission.id}
                          className="flex items-start gap-2.5 rounded-md px-1 py-1 text-sm hover:bg-muted/50"
                        >
                          <Checkbox
                            checked={assignedIds.has(permission.id)}
                            disabled={!canManage}
                            onCheckedChange={(checked) =>
                              handleToggle(permission.id, checked === true)
                            }
                            className="mt-0.5"
                          />
                          <span>
                            <span className="font-medium">
                              {permission.name}
                            </span>
                            {permission.description && (
                              <span className="block text-xs text-muted-foreground">
                                {permission.description}
                              </span>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
