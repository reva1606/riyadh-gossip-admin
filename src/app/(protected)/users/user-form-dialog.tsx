"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRolesQuery } from "@/hooks/use-roles";
import { useCreateStaffMutation } from "@/hooks/use-staff";
import { createStaffSchema, type CreateStaffFormValues } from "@/lib/validations/staff.schema";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// The default USER role can never be assigned here (the backend rejects it —
// see StaffService.assertAssignableRoles), and SUPER_ADMIN can't be granted
// through role assignment at all (see UserRolesService.assignRole) — both are
// filtered out of the picker rather than left in for the admin to hit an error.
const DEFAULT_ROLE_NAME = "USER";
const SUPER_ADMIN_ROLE_NAME = "SUPER_ADMIN";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_VALUES: CreateStaffFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  role_ids: [],
};

/** Creates a privileged (role-bearing) account — customers self-register from the app instead. */
export function UserFormDialog({ open, onOpenChange }: UserFormDialogProps) {
  const rolesQuery = useRolesQuery();
  const createMutation = useCreateStaffMutation();

  const assignableRoles = (rolesQuery.data ?? []).filter(
    (role) => role.name !== DEFAULT_ROLE_NAME && role.name !== SUPER_ADMIN_ROLE_NAME,
  );

  const form = useForm<CreateStaffFormValues>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: DEFAULT_VALUES,
  });

  React.useEffect(() => {
    if (open) form.reset(DEFAULT_VALUES);
  }, [open, form]);

  function onSubmit(values: CreateStaffFormValues) {
    createMutation.mutate(values, { onSuccess: () => onOpenChange(false) });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create user account</DialogTitle>
          <DialogDescription>
            A temporary password will be emailed to them, and they&apos;ll be asked to change it on
            first login.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2 rounded-md border border-border p-3">
                      {rolesQuery.isLoading ? (
                        <p className="text-sm text-muted-foreground">Loading roles…</p>
                      ) : assignableRoles.length ? (
                        assignableRoles.map((role) => {
                          const checked = field.value.includes(role.id);
                          return (
                            <label key={role.id} className="flex items-center gap-2.5 text-sm">
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(value) => {
                                  field.onChange(
                                    value === true
                                      ? [...field.value, role.id]
                                      : field.value.filter((id) => id !== role.id),
                                  );
                                }}
                              />
                              {role.name}
                            </label>
                          );
                        })
                      ) : (
                        <p className="text-sm text-muted-foreground">No assignable roles yet.</p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating…" : "Create account"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
