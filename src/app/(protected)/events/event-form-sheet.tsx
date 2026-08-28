"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { useCategoriesQuery } from "@/hooks/use-categories";
import { useCreateEventMutation, useUpdateEventMutation } from "@/hooks/use-events";
import { eventFormSchema, type EventFormValues } from "@/lib/validations/event.schema";
import { useTranslation } from "@/lib/i18n/language-provider";
import { DateTimePicker } from "@/components/shared/date-time-picker";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { Event } from "@/types/event.types";

import { TicketClassesFieldArray } from "./ticket-classes-field-array";
import { EventImageUpload } from "./event-image-upload";

// The dynamic-import loading fallback is rendered by React as part of the
// tree, so it can call hooks (useTranslation) even though `dynamic()` itself
// is invoked at module scope.
function MapLoadingFallback() {
  const { t } = useTranslation();
  return (
    <div className="flex h-64 w-full items-center justify-center rounded-lg border border-border text-sm text-muted-foreground">
      {t("events.form.loadingMap")}
    </div>
  );
}

// Leaflet touches `window` on import, so it can only ever run client-side —
// ssr:false keeps it out of the server render entirely.
const LocationMapPicker = dynamic(
  () => import("./location-map-picker").then((mod) => mod.LocationMapPicker),
  {
    ssr: false,
    loading: MapLoadingFallback,
  },
);

interface EventFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** `null`/`undefined` renders the "Create event" form; an event renders the "Edit event" form. */
  event?: Event | null;
}

const EMPTY_DEFAULTS: EventFormValues = {
  title: "",
  description: "",
  start_date: "",
  end_date: "",
  category_id: "",
  location: "",
  latitude: undefined,
  longitude: undefined,
  how_to_get_there: "",
  ticket_classes: [{ name: "", price: 0, count: 0 }],
};

function toDefaultValues(event: Event | null | undefined): EventFormValues {
  if (!event) return EMPTY_DEFAULTS;
  return {
    title: event.title,
    description: event.description,
    start_date: event.start_date,
    end_date: event.end_date,
    category_id: String(event.category_id),
    location: event.location,
    latitude: event.latitude,
    longitude: event.longitude,
    how_to_get_there: event.how_to_get_there,
    ticket_classes: event.ticket_classes.map((tc) => ({
      id: tc.id,
      name: tc.name,
      price: tc.price,
      count: tc.count,
    })),
  };
}

export function EventFormSheet({ open, onOpenChange, event }: EventFormSheetProps) {
  const isEdit = !!event;
  const { t } = useTranslation();
  const categoriesQuery = useCategoriesQuery();
  const createMutation = useCreateEventMutation();
  const updateMutation = useUpdateEventMutation();
  const mutation = isEdit ? updateMutation : createMutation;

  // This component is rendered unconditionally by the page (only `open`
  // toggles), so it does NOT remount on its own — the page passes a `key`
  // that changes on every open, forcing a real remount so useForm()'s
  // defaultValues and this lazy initializer re-evaluate against the new
  // `event`. Without that key, editing a second event would keep showing
  // whatever the form last held (see
  // https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes).
  const [imageUrls, setImageUrls] = React.useState<string[]>(
    () => event?.images.map((image) => image.url) ?? [],
  );

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: toDefaultValues(event),
  });

  // useWatch (not form.watch()) — the latter returns a plain function call
  // React Compiler can't safely memoize.
  const latitude = useWatch({ control: form.control, name: "latitude" });
  const longitude = useWatch({ control: form.control, name: "longitude" });

  function onSubmit(values: EventFormValues) {
    const payload = {
      title: values.title,
      description: values.description,
      start_date: values.start_date,
      end_date: values.end_date,
      category_id: Number(values.category_id),
      location: values.location,
      // Guaranteed set by the form's "pick a location" refinement before
      // handleSubmit ever calls this.
      latitude: values.latitude as number,
      longitude: values.longitude as number,
      how_to_get_there: values.how_to_get_there,
      ticket_classes: values.ticket_classes,
      image_urls: imageUrls,
    };

    if (isEdit && event) {
      updateMutation.mutate({ id: event.id, payload }, { onSuccess: () => onOpenChange(false) });
    } else {
      createMutation.mutate(payload, { onSuccess: () => onOpenChange(false) });
    }
  }

  const sheetTitle =
    isEdit && event ? t("events.form.editTitle", { title: event.title }) : t("events.form.createTitle");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" title={sheetTitle} className="w-full gap-0 sm:max-w-2xl">
        <SheetHeader className="border-b border-border">
          <h2 className="text-lg font-semibold">{sheetTitle}</h2>
          <p className="text-sm text-muted-foreground">
            {isEdit ? t("events.form.editDescription") : t("events.form.createDescription")}
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("events.form.titleLabel")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("events.form.titlePlaceholder")} {...field} />
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
                    <FormLabel>{t("events.form.descriptionLabel")}</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder={t("events.form.descriptionPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("events.form.startsLabel")}</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t("events.form.startsPlaceholder")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("events.form.endsLabel")}</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t("events.form.endsPlaceholder")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("events.form.categoryLabel")}</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("events.form.categoryPlaceholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoriesQuery.data?.map((category) => (
                            <SelectItem key={category.id} value={String(category.id)}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("events.form.locationLabel")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("events.form.locationPlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Label>{t("events.form.mapLocationLabel")}</Label>
                <p className="mb-2 text-xs text-muted-foreground">{t("events.form.mapLocationHelp")}</p>
                <LocationMapPicker
                  latitude={latitude ?? null}
                  longitude={longitude ?? null}
                  onChange={(lat, lng) => {
                    // The "pick a location" error is pathed to "latitude"
                    // (see event.schema.ts's cross-field refine) — setValue's
                    // own shouldValidate only re-triggers the field it was
                    // called on, so setting longitude alone never re-checks
                    // (and clears) that error. Set both, then explicitly
                    // trigger both paths once.
                    form.setValue("latitude", lat);
                    form.setValue("longitude", lng);
                    void form.trigger(["latitude", "longitude"]);
                  }}
                />
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude-input" className="text-xs text-muted-foreground">
                      {t("events.form.latitudeLabel")}
                    </Label>
                    <Input
                      id="latitude-input"
                      type="number"
                      step="any"
                      value={latitude ?? ""}
                      onChange={(event) => {
                        form.setValue(
                          "latitude",
                          event.target.value === "" ? undefined : Number(event.target.value),
                        );
                        void form.trigger(["latitude", "longitude"]);
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude-input" className="text-xs text-muted-foreground">
                      {t("events.form.longitudeLabel")}
                    </Label>
                    <Input
                      id="longitude-input"
                      type="number"
                      step="any"
                      value={longitude ?? ""}
                      onChange={(event) => {
                        form.setValue(
                          "longitude",
                          event.target.value === "" ? undefined : Number(event.target.value),
                        );
                        void form.trigger(["latitude", "longitude"]);
                      }}
                    />
                  </div>
                </div>
                {form.formState.errors.latitude && (
                  <p className="mt-2 text-sm text-danger">{form.formState.errors.latitude.message}</p>
                )}
              </div>

              <FormField
                control={form.control}
                name="how_to_get_there"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("events.form.howToGetThereLabel")}</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder={t("events.form.howToGetTherePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label>{t("events.form.ticketClassesLabel")}</Label>
                <div className="mt-2">
                  <TicketClassesFieldArray control={form.control} />
                </div>
                {form.formState.errors.ticket_classes?.root && (
                  <p className="mt-2 text-sm text-danger">{form.formState.errors.ticket_classes.root.message}</p>
                )}
              </div>

              <div>
                <Label>{t("events.form.imagesLabel")}</Label>
                <div className="mt-2">
                  <EventImageUpload value={imageUrls} onChange={setImageUrls} />
                </div>
              </div>

              <Button type="submit" disabled={mutation.isPending} className="mt-2 self-start">
                {mutation.isPending
                  ? t("common.saving")
                  : isEdit
                    ? t("events.form.saveChanges")
                    : t("events.createButton")}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
