"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DayButton } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root: "w-fit",
        months: "flex flex-col gap-4",
        month: "flex flex-col gap-4",
        month_caption: "flex items-center justify-center h-9 relative",
        caption_label: "text-sm font-medium",
        nav: "flex items-center justify-between absolute inset-x-0 top-0 h-9",
        button_previous: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "size-8 [&_svg]:size-4",
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "size-8 [&_svg]:size-4",
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-muted-foreground w-9 text-xs font-normal text-center",
        week: "flex w-full mt-1",
        day: "size-9 p-0 text-center text-sm relative",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 rounded-md p-0 font-normal aria-selected:opacity-100",
        ),
        range_start: "day-range-start rounded-l-md bg-accent",
        range_end: "day-range-end rounded-r-md bg-accent",
        selected: "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary/90",
        today: "[&>button]:border [&>button]:border-ring",
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...chevronProps }) =>
          orientation === "left" ? (
            <ChevronLeft className="size-4" {...chevronProps} />
          ) : (
            <ChevronRight className="size-4" {...chevronProps} />
          ),
        // `day`/`modifiers` are react-day-picker-only props that must not
        // reach the underlying native <button>, so they're destructured out
        // and intentionally left unused.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        DayButton: ({ className: dayButtonClassName, day, modifiers, ...dayButtonProps }: React.ComponentProps<typeof DayButton>) => (
          <Button
            variant="ghost"
            className={cn(dayButtonClassName, "size-9 rounded-md p-0 font-normal")}
            {...dayButtonProps}
          />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
