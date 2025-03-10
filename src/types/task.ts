import { z } from "zod";
import { Frequency } from "@prisma/client";

// Helper function to handle date fields that can be strings or Date objects
const dateSchema = z.preprocess((arg) => {
  if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
  return arg;
}, z.date().optional().nullable());

export const TaskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional().nullable(),
  priority: z.number().int().min(1).default(3),
  frequency: z.nativeEnum(Frequency).default("ONCE"),
  order: z.number().int().default(0),
  completed: z.boolean().default(false),
  isCompletedToday: z.boolean().default(false),
  lastCompletedAt: dateSchema,
  dailyStreak: z.number().int().default(0),
  weeklyStreak: z.number().int().default(0),
  monthlyStreak: z.number().int().default(0),
  categoryId: z.string({ required_error: "Category ID is required" }),
  userId: z.string({ required_error: "User ID is required" }),
  dueDate: dateSchema,
  // Optional fields from Prisma schema
  isRecurring: z.boolean().default(false).optional(),
  nextDueDate: dateSchema,
  repeatConfig: z.any().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TaskType = z.infer<typeof TaskSchema>;
