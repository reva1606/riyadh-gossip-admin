"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

import { useAuth } from "@/store/auth-context";
import {
  useAssignUserRoleMutation,
  useRemoveUserRoleMutation,
  useUpdateUserMutation,
  useUserRolesQuery,
} from "@/hooks/use-users";
import { useRolesQuery } from "@/hooks/use-roles";
import {
  editUserSchema,
  type EditUserFormValues,
} from "@/lib/validations/user.schema";
import { useTranslation } from "@/lib/i18n/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User } from "@/types/user.types";

// The backend rejects assigning/removing these roles via the role-assignment
// endpoints (see UserRolesService's NON_ASSIGNABLE_ROLES guard) — USER is the
// default role the app itself grants on signup, and SUPER_ADMIN is granted
// only outside this panel. Both are kept out of the UI so it can never be
// used to attempt either.
const NON_ASSIGNABLE_ROLE_NAMES = new Set(["USER", "SUPER_ADMIN"]);

interface UserEditSheetProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserEditSheet({
  user,
  open,
  onOpenChange,
}: UserEditSheetProps) {
  const { hasPermission, user: currentUser } = useAuth();
  const canUpdate = hasPermission("user.update");
  const isSelf = user?.id === currentUser?.id;
  const canAssignRole = hasPermission("user.role.assign") && !isSelf;
  const { t } = useTranslation();

  const updateMutation = useUpdateUserMutation();

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      status: "ACTIVE",
    },
  });

  React.useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        status: user.status,
      });
    }
  }, [user, form]);

  function onSubmit(values: EditUserFormValues) {
    if (!user) return;
    updateMutation.mutate(
      { id: user.id, payload: values },
      { onSuccess: () => onOpenChange(false) },
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        title={
          user
            ? t("users.editSheet.editUserTitle", {
                name: `${user.first_name} ${user.last_name}`,
              })
            : t("users.editSheet.fallbackTitle")
        }
        className="w-full gap-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border">
          <h2 className="text-lg font-semibold">
            {user
              ? `${user.first_name} ${user.last_name}`
              : t("users.editSheet.fallbackTitle")}
          </h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <Tabs defaultValue="profile" className="pt-4">
            <TabsList className="w-full">
              <TabsTrigger value="profile" className="flex-1">
                {t("users.editSheet.profileTab")}
              </TabsTrigger>
              <TabsTrigger value="roles" className="flex-1">
                {t("users.editSheet.rolesTab")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("users.editSheet.firstNameLabel")}
                        </FormLabel>
                        <FormControl>
                          <Input disabled={!canUpdate} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("users.editSheet.lastNameLabel")}
                        </FormLabel>
                        <FormControl>
                          <Input disabled={!canUpdate} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("users.editSheet.emailLabel")}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            disabled={!canUpdate}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("users.editSheet.statusLabel")}
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!canUpdate}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ACTIVE">
                              {t("common.active")}
                            </SelectItem>
                            <SelectItem value="INACTIVE">
                              {t("common.inactive")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {canUpdate && (
                    <Button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="mt-2"
                    >
                      {updateMutation.isPending
                        ? t("common.saving")
                        : t("users.editSheet.saveChanges")}
                    </Button>
                  )}
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="roles">
              <UserRolesPanel
                userId={user?.id ?? null}
                canAssignRole={canAssignRole}
                isSelf={isSelf}
              />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function UserRolesPanel({
  userId,
  canAssignRole,
  isSelf,
}: {
  userId: number | null;
  canAssignRole: boolean;
  isSelf: boolean;
}) {
  const { t } = useTranslation();
  const rolesQuery = useUserRolesQuery(userId);
  const allRolesQuery = useRolesQuery();
  const assignMutation = useAssignUserRoleMutation();
  const removeMutation = useRemoveUserRoleMutation();
  const [selectedRoleId, setSelectedRoleId] = React.useState<string>("");

  const assignedIds = new Set((rolesQuery.data ?? []).map((role) => role.id));
  const availableRoles = (allRolesQuery.data ?? []).filter(
    (role) =>
      !assignedIds.has(role.id) && !NON_ASSIGNABLE_ROLE_NAMES.has(role.name),
  );

  function handleAssign() {
    if (!userId || !selectedRoleId) return;
    assignMutation.mutate(
      { id: userId, payload: { role_id: Number(selectedRoleId) } },
      { onSuccess: () => setSelectedRoleId("") },
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-sm font-medium">
          {t("users.editSheet.currentRoles")}
        </p>
        {rolesQuery.isLoading ? (
          <Skeleton className="h-8 w-full" />
        ) : rolesQuery.data?.length ? (
          <div className="flex flex-wrap gap-2">
            {rolesQuery.data.map((role) => (
              <Badge
                key={role.id}
                variant="secondary"
                className="gap-1.5 py-1 pe-1"
              >
                {role.name}
                {canAssignRole && !NON_ASSIGNABLE_ROLE_NAMES.has(role.name) && (
                  <button
                    type="button"
                    onClick={() =>
                      userId &&
                      removeMutation.mutate({ id: userId, roleId: role.id })
                    }
                    className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                    aria-label={t("users.editSheet.removeRoleLabel", {
                      role: role.name,
                    })}
                  >
                    <X className="size-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("users.editSheet.noRolesAssigned")}
          </p>
        )}
      </div>

      {isSelf && (
        <p className="text-sm text-muted-foreground">
          {t("users.editSheet.cannotChangeOwnRoles")}
        </p>
      )}

      {canAssignRole && (
        <div>
          <p className="mb-2 text-sm font-medium">
            {t("users.editSheet.assignRole")}
          </p>
          <div className="flex gap-2">
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger className="flex-1">
                <SelectValue
                  placeholder={t("users.editSheet.selectRolePlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role.id} value={String(role.id)}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={handleAssign}
              disabled={!selectedRoleId || assignMutation.isPending}
            >
              {t("users.editSheet.addButton")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
