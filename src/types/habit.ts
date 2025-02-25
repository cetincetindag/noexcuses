import { z } from 'zod';
import { HabitUnit } from '@prisma/client';


const habitSchema = z.object({
  id: z.string(),
  title: z.string(),
  units: z.nativeEnum(HabitUnit),
  customUnit: z.string().optional(),
  amountRequired: z.number(),
  amountDone: z.number(),
  dailyStreak: z.number(),
  isCompletedToday: z.boolean(),
})


export type habitDataType = z.infer<typeof habitSchema>;
