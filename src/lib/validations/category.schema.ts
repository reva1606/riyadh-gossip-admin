import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(150, "Keep it under 150 characters"),
  description: z.string().max(1000, "Keep it under 1000 characters").optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
