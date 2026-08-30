import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(150, "Keep it under 150 characters"),
  name_ar: z.string().max(150, "Keep it under 150 characters").optional(),
  description: z.string().max(1000, "Keep it under 1000 characters").optional(),
  description_ar: z.string().max(1000, "Keep it under 1000 characters").optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
