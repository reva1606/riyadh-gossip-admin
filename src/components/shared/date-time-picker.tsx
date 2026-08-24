"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DateTimePickerProps {
  /** ISO datetime string, or "" for unset. */
  value: string;
  onChange: (iso: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

/** A calendar popover for the date, paired with a plain time input — replaces the native datetime-local input. */
export function DateTimePicker({ value, onChange, placeholder = "Pick a date", disabled }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const date = value ? new Date(value) : undefined;

  function handleDateSelect(selected: Date | undefined) {
    if (!selected) return;
    const next = new Date(selected);
    if (date) {
      next.setHours(date.getHours(), date.getMinutes(), 0, 0);
    } else {
      next.setHours(0, 0, 0, 0);
    }
    onChange(next.toISOString());
    setOpen(false);
  }

  function handleTimeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const [hours, minutes] = event.target.value.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return;
    const next = new Date(date ?? new Date());
    next.setHours(hours, minutes, 0, 0);
    onChange(next.toISOString());
  }

  const timeValue = date
    ? `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
    : "";

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn("flex-1 justify-start gap-2 font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="size-4" />
            {date ? format(date, "PPP") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} autoFocus />
        </PopoverContent>
      </Popover>
      <Input
        type="time"
        value={timeValue}
        onChange={handleTimeChange}
        disabled={disabled || !date}
        className="w-28"
        aria-label="Time"
      />
    </div>
  );
}
