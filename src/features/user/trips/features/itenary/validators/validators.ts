import z from "zod";


export const activitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  location: z.string().optional(),
  startTime: z.string().optional(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  durationMinutes: z.string().optional(),
  notes: z.string().optional(),
});

export type ActivityFormValues = z.infer<typeof activitySchema>;

export const daySchema = z.object({
  location: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  summary: z.string().optional(),
});

export type DayFormValues = z.infer<typeof daySchema>;