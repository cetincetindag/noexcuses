import { z } from 'zod';
import { HabitUnit } from '@prisma/client';


const habitSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  category: z.string().default("General"),
  units: z.nativeEnum(HabitUnit),
  customUnit: z.string().optional(),
  amountRequired: z.number(),
  amountDone: z.number(),
  dailyStreak: z.number().optional(),
  isCompletedToday: z.boolean().optional(),
  userId: z.string(),
})


export type habitDataType = z.infer<typeof habitSchema>;
