import { z } from "zod";

export const createStaffSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  role_ids: z.array(z.number()).min(1, "Select at least one role"),
});

export type CreateStaffFormValues = z.infer<typeof createStaffSchema>;
