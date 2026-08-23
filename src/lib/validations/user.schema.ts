import { z } from "zod";

export const editUserSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type EditUserFormValues = z.infer<typeof editUserSchema>;
