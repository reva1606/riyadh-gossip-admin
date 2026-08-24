"use client";

import * as React from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";

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
import { useCategoriesQuery, useDeleteCategoryMutation } from "@/hooks/use-categories";
import type { Category } from "@/types/category.types";

import { categoryColumns } from "./columns";
import { CategoryFormDialog } from "./category-form-dialog";

const EMPTY_CATEGORIES: never[] = [];

export default function CategoriesPage() {
  return (
    <PermissionGuard permission="category.view">
      <CategoriesPageContent />
    </PermissionGuard>
  );
}

function CategoriesPageContent() {
  const { hasPermission } = useAuth();
  const canCreate = hasPermission("category.create");
  const canUpdate = hasPermission("category.update");
  const canDelete = hasPermission("category.delete");

  const categoriesQuery = useCategoriesQuery();
  const deleteMutation = useDeleteCategoryMutation();

  const [formState, setFormState] = React.useState<{ open: boolean; category: Category | null }>({
    open: false,
    category: null,
  });
  const [deletingCategory, setDeletingCategory] = React.useState<Category | null>(null);

  const categories = categoriesQuery.data ?? EMPTY_CATEGORIES;

  async function handleConfirmDelete() {
    if (!deletingCategory) return;
    try {
      await deleteMutation.mutateAsync(deletingCategory.id);
      setDeletingCategory(null);
    } catch {
      // Error toast already surfaced by the mutation's onError (e.g. still in use by an event).
    }
  }

  return (
    <>
      <PageHeader
        title="Categories"
        description="Manage the categories events can be organized under."
        actions={
          canCreate ? (
            <Button onClick={() => setFormState({ open: true, category: null })} className="gap-1.5">
              <Plus className="size-4" />
              Create category
            </Button>
          ) : undefined
        }
      />

      <DataTable
        mode="client"
        columns={categoryColumns}
        data={categories}
        isLoading={categoriesQuery.isLoading}
        searchPlaceholder="Search categories…"
        totalLabel="Categories"
        getRowId={(row) => String(row.id)}
        renderRowActions={(category) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Row actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled={!canUpdate} onClick={() => setFormState({ open: true, category })}>
                <Pencil /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                disabled={!canDelete}
                onClick={() => setDeletingCategory(category)}
              >
                <Trash2 /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <CategoryFormDialog
        open={formState.open}
        onOpenChange={(open) => setFormState((prev) => ({ ...prev, open }))}
        category={formState.category}
      />

      <Dialog open={!!deletingCategory} onOpenChange={(open) => !open && setDeletingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete category</DialogTitle>
            <DialogDescription>
              This permanently deletes the{" "}
              <span className="font-medium text-foreground">{deletingCategory?.name}</span> category. Categories
              still used by an event can&apos;t be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingCategory(null)}>
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
