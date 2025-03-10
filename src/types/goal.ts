import { z } from "zod";

export const GoalSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.number().int().min(1),
  taskId: z.string().optional(),
  frequency: z.enum(["ONCE", "DAILY", "WEEKLY", "MONTHLY"]).default("ONCE"),
  categoryId: z.string(),
  userId: z.string(),
  order: z.number().int(),
  progress: z.number().int().min(0),
  total: z.number().int().min(1),
  completed: z.boolean().default(false),
  isCompletedToday: z.boolean().default(false),
  lastCompletedAt: z.date().optional(),
  dailyStreak: z.number().int().default(0),
  weeklyStreak: z.number().int().default(0),
  monthlyStreak: z.number().int().default(0),
  dueDate: z.date().optional(),
});

// Add the .partial() method to the schema
GoalSchema.partial = () => GoalSchema.extend({}).partial();

export type GoalType = z.infer<typeof GoalSchema>;
