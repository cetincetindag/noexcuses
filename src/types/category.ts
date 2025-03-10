import { z } from "zod";

// Schema for category validation
export const CategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
  icon: z.string().min(1, "Icon is required"),
  priority: z.number().int().positive(),
  order: z.number().int().positive(),
  description: z.string().optional().nullable(),
});

// Add the .partial() method to the schema
CategorySchema.partial = () => CategorySchema.extend({}).partial();

export type CategoryType = z.infer<typeof CategorySchema>;
