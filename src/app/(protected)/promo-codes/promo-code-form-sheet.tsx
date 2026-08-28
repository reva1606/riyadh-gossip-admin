"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useEventsQuery } from "@/hooks/use-events";
import { useUsersQuery } from "@/hooks/use-users";
import { useCreatePromoCodeMutation, useUpdatePromoCodeMutation } from "@/hooks/use-promo-codes";
import { promoCodeFormSchema, type PromoCodeFormValues } from "@/lib/validations/promo-code.schema";
import { useTranslation } from "@/lib/i18n/language-provider";
import { DateTimePicker } from "@/components/shared/date-time-picker";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { PromoCode } from "@/types/promo-code.types";

import { RestrictionMultiSelect, type RestrictionOption } from "./restriction-multi-select";

interface PromoCodeFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** `null`/`undefined` renders the "Create promo code" form; a promo code renders the "Edit" form. */
  promoCode?: PromoCode | null;
}

const EMPTY_DEFAULTS: PromoCodeFormValues = {
  name: "",
  code: "",
  description: "",
  valid_from: "",
  valid_until: "",
  type: "PERCENTAGE",
  value: 0,
  max_uses: "",
  is_active: true,
};

function toDefaultValues(promoCode: PromoCode | null | undefined): PromoCodeFormValues {
  if (!promoCode) return EMPTY_DEFAULTS;
  return {
    name: promoCode.name,
    code: promoCode.code,
    description: promoCode.description ?? "",
    valid_from: promoCode.valid_from ?? "",
    valid_until: promoCode.valid_until ?? "",
    type: promoCode.type,
    value: promoCode.value,
    max_uses: promoCode.max_uses ?? "",
    is_active: promoCode.is_active,
  };
}

function toUserOptions(promoCode: PromoCode | null | undefined): RestrictionOption[] {
  return (promoCode?.users ?? []).map((user) => ({
    id: user.id,
    label: `${user.first_name} ${user.last_name}`,
    sublabel: user.email,
  }));
}

function toEventOptions(promoCode: PromoCode | null | undefined): RestrictionOption[] {
  return (promoCode?.events ?? []).map((event) => ({ id: event.id, label: event.title }));
}

export function PromoCodeFormSheet({ open, onOpenChange, promoCode }: PromoCodeFormSheetProps) {
  const isEdit = !!promoCode;
  const { t } = useTranslation();
  const createMutation = useCreatePromoCodeMutation();
  const updateMutation = useUpdatePromoCodeMutation();
  const mutation = isEdit ? updateMutation : createMutation;

  // Restrictions are kept as plain state (id + display label), same as
  // EventFormSheet's `imageUrls` — they aren't zod-validated fields, just
  // synced into the payload on submit. This component is rendered
  // unconditionally by the page (only `open` toggles) with a `key` that
  // changes on every open, so this re-initializes correctly per promo code.
  const [selectedUsers, setSelectedUsers] = React.useState<RestrictionOption[]>(() => toUserOptions(promoCode));
  const [selectedEvents, setSelectedEvents] = React.useState<RestrictionOption[]>(() => toEventOptions(promoCode));

  const [userSearch, setUserSearch] = React.useState("");
  const [eventSearch, setEventSearch] = React.useState("");
  const debouncedUserSearch = useDebouncedValue(userSearch, 300);
  const debouncedEventSearch = useDebouncedValue(eventSearch, 300);

  const usersQuery = useUsersQuery({ page: 1, limit: 20, search: debouncedUserSearch || undefined });
  const eventsQuery = useEventsQuery({ page: 1, limit: 20, search: debouncedEventSearch || undefined });

  const userOptions: RestrictionOption[] = (usersQuery.data?.data ?? []).map((user) => ({
    id: user.id,
    label: `${user.first_name} ${user.last_name}`,
    sublabel: user.email,
  }));
  const eventOptions: RestrictionOption[] = (eventsQuery.data?.data ?? []).map((event) => ({
    id: event.id,
    label: event.title,
  }));

  const form = useForm<PromoCodeFormValues>({
    resolver: zodResolver(promoCodeFormSchema),
    defaultValues: toDefaultValues(promoCode),
  });

  // useWatch (not form.watch()) — the latter returns a plain function call
  // React Compiler can't safely memoize (see EventFormSheet).
  const typeValue = useWatch({ control: form.control, name: "type" });

  function onSubmit(values: PromoCodeFormValues) {
    const payload = {
      name: values.name,
      code: values.code,
      description: values.description?.trim() ? values.description.trim() : undefined,
      valid_from: values.valid_from || undefined,
      valid_until: values.valid_until || undefined,
      type: values.type,
      value: values.value,
      max_uses: values.max_uses === "" ? null : values.max_uses,
      user_ids: selectedUsers.map((user) => user.id),
      event_ids: selectedEvents.map((event) => event.id),
      is_active: values.is_active,
    };

    if (isEdit && promoCode) {
      updateMutation.mutate({ id: promoCode.id, payload }, { onSuccess: () => onOpenChange(false) });
    } else {
      createMutation.mutate(payload, { onSuccess: () => onOpenChange(false) });
    }
  }

  const sheetTitle =
    isEdit && promoCode
      ? t("promoCodes.form.editTitle", { name: promoCode.name })
      : t("promoCodes.form.createTitle");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" title={sheetTitle} className="w-full gap-0 sm:max-w-2xl">
        <SheetHeader className="border-b border-border">
          <h2 className="text-lg font-semibold">{sheetTitle}</h2>
          <p className="text-sm text-muted-foreground">
            {isEdit ? t("promoCodes.form.editDescription") : t("promoCodes.form.createDescription")}
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("promoCodes.form.nameLabel")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("promoCodes.form.namePlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("promoCodes.form.codeLabel")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("promoCodes.form.codePlaceholder")} className="uppercase" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("promoCodes.form.descriptionLabel")}</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder={t("promoCodes.form.descriptionPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("promoCodes.form.typeLabel")}</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("promoCodes.form.typePlaceholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PERCENTAGE">{t("promoCodes.form.typePercentage")}</SelectItem>
                          <SelectItem value="FIXED">{t("promoCodes.form.typeFixed")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {typeValue === "PERCENTAGE"
                          ? t("promoCodes.form.valueLabelPercentage")
                          : t("promoCodes.form.valueLabel")}
                      </FormLabel>
                      <FormControl>
                        <Input type="number" step="any" min={0} placeholder={t("promoCodes.form.valuePlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="max_uses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("promoCodes.form.maxUsesLabel")}</FormLabel>
                    <FormControl>
                      <Input type="number" step={1} min={1} placeholder={t("promoCodes.form.maxUsesPlaceholder")} {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">{t("promoCodes.form.maxUsesHelp")}</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="valid_from"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>{t("promoCodes.form.validFromLabel")}</FormLabel>
                        {field.value && (
                          <button
                            type="button"
                            onClick={() => field.onChange("")}
                            className="text-xs text-muted-foreground hover:text-foreground"
                          >
                            {t("common.clear")}
                          </button>
                        )}
                      </div>
                      <FormControl>
                        <DateTimePicker
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          placeholder={t("promoCodes.form.validFromPlaceholder")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="valid_until"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>{t("promoCodes.form.validUntilLabel")}</FormLabel>
                        {field.value && (
                          <button
                            type="button"
                            onClick={() => field.onChange("")}
                            className="text-xs text-muted-foreground hover:text-foreground"
                          >
                            {t("common.clear")}
                          </button>
                        )}
                      </div>
                      <FormControl>
                        <DateTimePicker
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          placeholder={t("promoCodes.form.validUntilPlaceholder")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Label>{t("promoCodes.form.restrictUsersLabel")}</Label>
                <p className="mb-2 text-xs text-muted-foreground">{t("promoCodes.form.restrictUsersHelp")}</p>
                <RestrictionMultiSelect
                  selectedOptions={selectedUsers}
                  onChange={setSelectedUsers}
                  search={userSearch}
                  onSearchChange={setUserSearch}
                  options={userOptions}
                  isLoading={usersQuery.isLoading}
                  placeholder={t("promoCodes.form.restrictUsersPlaceholder")}
                  searchPlaceholder={t("promoCodes.form.restrictUsersSearchPlaceholder")}
                  emptyLabel={t("promoCodes.form.restrictUsersEmpty")}
                />
              </div>

              <div>
                <Label>{t("promoCodes.form.restrictEventsLabel")}</Label>
                <p className="mb-2 text-xs text-muted-foreground">{t("promoCodes.form.restrictEventsHelp")}</p>
                <RestrictionMultiSelect
                  selectedOptions={selectedEvents}
                  onChange={setSelectedEvents}
                  search={eventSearch}
                  onSearchChange={setEventSearch}
                  options={eventOptions}
                  isLoading={eventsQuery.isLoading}
                  placeholder={t("promoCodes.form.restrictEventsPlaceholder")}
                  searchPlaceholder={t("promoCodes.form.restrictEventsSearchPlaceholder")}
                  emptyLabel={t("promoCodes.form.restrictEventsEmpty")}
                />
              </div>

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                      <div>
                        <FormLabel className="text-sm">{t("common.active")}</FormLabel>
                        <p className="text-xs text-muted-foreground">{t("promoCodes.form.activeHelp")}</p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={mutation.isPending} className="mt-2 self-start">
                {mutation.isPending
                  ? t("common.saving")
                  : isEdit
                    ? t("promoCodes.form.saveChanges")
                    : t("promoCodes.createButton")}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
