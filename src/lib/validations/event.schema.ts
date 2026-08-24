import { z } from "zod";

export const ticketClassSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required").max(100, "Keep it under 100 characters"),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  count: z.coerce.number().int("Count must be a whole number").min(0, "Count must be 0 or more"),
});

export const eventFormSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(200, "Keep it under 200 characters"),
    description: z.string().min(1, "Description is required"),
    start_date: z.string().min(1, "Start date & time is required"),
    end_date: z.string().min(1, "End date & time is required"),
    category_id: z.string().min(1, "Category is required"),
    location: z.string().min(1, "Location is required").max(500, "Keep it under 500 characters"),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    how_to_get_there: z.string().min(1, "This field is required"),
    ticket_classes: z.array(ticketClassSchema).min(1, "Add at least one ticket class"),
  })
  .refine((values) => new Date(values.end_date) > new Date(values.start_date), {
    message: "End must be after start",
    path: ["end_date"],
  })
  .refine((values) => values.latitude != null && values.longitude != null, {
    message: "Pick a location on the map",
    path: ["latitude"],
  });

export type TicketClassFormValues = z.infer<typeof ticketClassSchema>;
export type EventFormValues = z.infer<typeof eventFormSchema>;
