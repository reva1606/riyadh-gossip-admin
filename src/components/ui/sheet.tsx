import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

const sheetVariants = cva(
  "fixed z-50 flex flex-col gap-4 bg-card text-card-foreground shadow-xl border-border " +
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        // "left"/"right" name which screen edge the sheet docks to in LTR; the
        // position/border are logical (start/end) so they mirror automatically
        // under dir="rtl", and the slide transforms — which can't be logical,
        // since CSS transforms don't respect `dir` — are flipped via `rtl:`.
        left: "inset-y-0 inset-s-0 h-full w-3/4 border-e data-[state=closed]:slide-out-to-left rtl:data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-left rtl:data-[state=open]:slide-in-from-right sm:max-w-sm",
        right:
          "inset-y-0 inset-e-0 h-full w-3/4 border-s data-[state=closed]:slide-out-to-right rtl:data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-right rtl:data-[state=open]:slide-in-from-left sm:max-w-sm",
      },
    },
    defaultVariants: { side: "right" },
  },
);

function SheetContent({
  className,
  children,
  side = "left",
  title,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof sheetVariants> & { title: string }) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content className={cn(sheetVariants({ side }), className)} {...props}>
        <VisuallyHidden asChild>
          <DialogPrimitive.Title>{title}</DialogPrimitive.Title>
        </VisuallyHidden>
        {children}
        <DialogPrimitive.Close className="absolute top-4 inset-e-4 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 p-4", className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />;
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter };
