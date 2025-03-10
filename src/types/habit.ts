import { z } from "zod";

// Define the Habit schema for validation
export const HabitSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  userId: z.string().min(1),
  categoryId: z.string().min(1),
  targetCompletions: z.number().int().min(1).default(1),
  active: z.boolean().default(true),
  isCompletedToday: z.boolean().default(false),
  dailyStreak: z.number().int().min(0).default(0),
  lastCompletedAt: z.date().nullable().optional(),
  completedToday: z.number().int().min(0).default(0),
  color: z.string().optional(),
  longestStreak: z.number().int().min(0).default(0),
  order: z.number().int().min(0).default(0),
});

// Add the .partial() method to the schema
HabitSchema.partial = () => HabitSchema.extend({}).partial();

export type HabitType = z.infer<typeof HabitSchema>;
