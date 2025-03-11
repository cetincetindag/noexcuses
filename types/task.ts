import { z } from "zod";
import { Frequency } from "@prisma/client";

// Define Priority enum if it's not in Prisma
export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

// Define the Task schema for validation
export const TaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.date().nullable().optional(),
  completed: z.boolean().default(false),
  isCompletedToday: z.boolean().default(false),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  frequency: z.nativeEnum(Frequency).default(Frequency.DAILY),
  dailyStreak: z.number().int().min(0).default(0),
  weeklyStreak: z.number().int().min(0).default(0),
  monthlyStreak: z.number().int().min(0).default(0),
  categoryId: z.string().min(1, "Category is required"),
  userId: z.string().min(1, "User ID is required"),
  lastCompletedAt: z.date().nullable().optional(),
  color: z.string().optional(),
  order: z.number().int().default(0),
});

export type TaskType = z.infer<typeof TaskSchema>;
