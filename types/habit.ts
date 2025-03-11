import { z } from "zod";

// Define the Habit schema for validation
export const HabitSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  targetCompletions: z.number().int().min(1).default(1),
  completedToday: z.number().int().min(0).default(0),
  isCompletedToday: z.boolean().default(false),
  active: z.boolean().default(true),
  dailyStreak: z.number().int().min(0).default(0),
  longestStreak: z.number().int().min(0).default(0),
  categoryId: z.string().min(1, "Category is required"),
  userId: z.string().min(1, "User ID is required"),
  order: z.number().int().default(0),
  lastCompletedAt: z.date().nullable().optional(),
  color: z.string().optional(),
});

export type HabitType = z.infer<typeof HabitSchema>;
