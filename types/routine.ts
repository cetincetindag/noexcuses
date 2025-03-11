import { z } from "zod";
import { Frequency } from "@prisma/client";

// Define the Routine schema for validation
export const RoutineSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  userId: z.string().min(1),
  categoryId: z.string().min(1),
  frequency: z.nativeEnum(Frequency).default(Frequency.DAILY),
  isCompletedToday: z.boolean().default(false),
  streak: z.number().int().min(0).default(0),
  lastCompletedAt: z.date().nullable().optional(),
  color: z.string().optional(),
  taskIds: z.array(z.string()).optional(),
  habitIds: z.array(z.string()).optional(),
});

export type RoutineType = z.infer<typeof RoutineSchema>;
