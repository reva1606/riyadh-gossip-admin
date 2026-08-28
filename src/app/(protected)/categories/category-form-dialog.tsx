"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useCreateCategoryMutation, useUpdateCategoryMutation } from "@/hooks/use-categories";
import { categoryFormSchema, type CategoryFormValues } from "@/lib/validations/category.schema";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/types/category.types";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** `null`/`undefined` renders the "Create category" form; a category renders the "Edit category" form. */
  category?: Category | null;
}

export function CategoryFormDialog({ open, onOpenChange, category }: CategoryFormDialogProps) {
  const isEdit = !!category;
  const { t } = useTranslation();
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const mutation = isEdit ? updateMutation : createMutation;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: "", description: "" },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({ name: category?.name ?? "", description: category?.description ?? "" });
    }
  }, [open, category, form]);

  function onSubmit(values: CategoryFormValues) {
    const payload = { name: values.name, description: values.description || undefined };
    if (isEdit && category) {
      updateMutation.mutate({ id: category.id, payload }, { onSuccess: () => onOpenChange(false) });
    } else {
      createMutation.mutate(payload, { onSuccess: () => onOpenChange(false) });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? t("categories.form.editTitle") : t("categories.form.createTitle")}</DialogTitle>
          <DialogDescription>
            {isEdit ? t("categories.form.editDescription") : t("categories.form.createDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("categories.form.nameLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("categories.form.namePlaceholder")} {...field} />
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
                  <FormLabel>{t("categories.form.descriptionLabel")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t("categories.form.descriptionPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending
                  ? t("common.saving")
                  : isEdit
                    ? t("categories.form.saveChanges")
                    : t("categories.createButton")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
