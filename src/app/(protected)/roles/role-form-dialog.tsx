"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  useCreateRoleMutation,
  useUpdateRoleMutation,
} from "@/hooks/use-roles";
import {
  roleFormSchema,
  type RoleFormValues,
} from "@/lib/validations/role.schema";
import { useTranslation } from "@/lib/i18n/language-provider";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { RoleDto } from "@/types/role.types";

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** `null`/`undefined` renders the "Create role" form; a role renders the "Edit role" form. */
  role?: RoleDto | null;
}

export function RoleFormDialog({
  open,
  onOpenChange,
  role,
}: RoleFormDialogProps) {
  const isEdit = !!role;
  const { t } = useTranslation();
  const createMutation = useCreateRoleMutation();
  const updateMutation = useUpdateRoleMutation();
  const mutation = isEdit ? updateMutation : createMutation;

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: { name: "", description: "" },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: role?.name ?? "",
        description: role?.description ?? "",
      });
    }
  }, [open, role, form]);

  function onSubmit(values: RoleFormValues) {
    const payload = {
      name: values.name,
      description: values.description || undefined,
    };
    if (isEdit && role) {
      updateMutation.mutate(
        { id: role.id, payload },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMutation.mutate(payload, { onSuccess: () => onOpenChange(false) });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("roles.form.editTitle") : t("roles.form.createTitle")}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t("roles.form.editDescription")
              : t("roles.form.createDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("roles.form.nameLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("roles.form.namePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("roles.form.descriptionLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("roles.form.descriptionPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending
                  ? t("common.saving")
                  : isEdit
                    ? t("roles.form.saveChanges")
                    : t("roles.createButton")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
