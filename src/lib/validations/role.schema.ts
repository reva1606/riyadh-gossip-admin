import { z } from "zod";

export const roleFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Keep it under 50 characters"),
  description: z.string().max(255, "Keep it under 255 characters").optional(),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;
