import { z } from "zod";

// Define the Category schema for validation
export const CategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
  icon: z.string().optional(),
  priority: z.number().int().default(0),
  order: z.number().int().default(0),
});

export type CategoryType = z.infer<typeof CategorySchema>;
