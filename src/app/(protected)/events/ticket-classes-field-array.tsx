"use client";

import { useFieldArray, type Control } from "react-hook-form";
import { Plus, X } from "lucide-react";

import type { EventFormValues } from "@/lib/validations/event.schema";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/lib/i18n/language-provider";

interface TicketClassesFieldArrayProps {
  control: Control<EventFormValues>;
}

/** Repeater for an event's ticket classes — name/price/count rows, add/remove. */
export function TicketClassesFieldArray({ control }: TicketClassesFieldArrayProps) {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({ control, name: "ticket_classes" });

  return (
    <div className="flex flex-col gap-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-2">
          <FormField
            control={control}
            name={`ticket_classes.${index}.name`}
            render={({ field: nameField }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder={t("events.ticketClasses.namePlaceholder")} {...nameField} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`ticket_classes.${index}.price`}
            render={({ field: priceField }) => (
              <FormItem className="w-28">
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder={t("events.ticketClasses.pricePlaceholder")}
                    {...priceField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`ticket_classes.${index}.count`}
            render={({ field: countField }) => (
              <FormItem className="w-24">
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="1"
                    placeholder={t("events.ticketClasses.countPlaceholder")}
                    {...countField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mt-0.5 shrink-0"
            disabled={fields.length <= 1}
            onClick={() => remove(index)}
            aria-label={t("events.ticketClasses.removeAria")}
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start gap-1.5"
        onClick={() => append({ name: "", price: 0, count: 0 })}
      >
        <Plus className="size-4" />
        {t("events.ticketClasses.addButton")}
      </Button>
    </div>
  );
}
