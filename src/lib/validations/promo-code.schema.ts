import { z } from "zod";

export const promoCodeFormSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(150, "Keep it under 150 characters"),
    code: z.string().trim().min(1, "Code is required").max(50, "Keep it under 50 characters"),
    description: z.string().max(1000, "Keep it under 1000 characters").optional(),
    // ISO datetime string, or "" for unset — same convention as EventFormValues.
    valid_from: z.string().optional(),
    valid_until: z.string().optional(),
    type: z.enum(["FIXED", "PERCENTAGE"]),
    value: z.coerce
      .number({ invalid_type_error: "Value is required" })
      .positive("Value must be greater than 0"),
    // "" means unlimited — same "" -> undefined convention as valid_from/valid_until.
    max_uses: z.union([
      z.literal(""),
      z.coerce.number().int("Must be a whole number").positive("Must be greater than 0"),
    ]),
    is_active: z.boolean(),
  })
  .refine((values) => values.type !== "PERCENTAGE" || values.value <= 100, {
    message: "Percentage value cannot exceed 100",
    path: ["value"],
  })
  .refine(
    (values) =>
      !values.valid_from || !values.valid_until || new Date(values.valid_until) > new Date(values.valid_from),
    { message: "Valid until must be after valid from", path: ["valid_until"] },
  );

export type PromoCodeFormValues = z.infer<typeof promoCodeFormSchema>;
