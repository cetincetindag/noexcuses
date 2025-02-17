import { z } from "zod";

export const weightUnitsEnum = z.enum(["lb", "kg"])
export const heightUnitsEnum = z.enum(["in", "cm"])

export const startDataSchema = z.object(
  {
    dailyWaterIntake: z.number().max(2),
    dailyCardio: z.number().max(3),
    dailyWeightTraining: z.number().max(3),
    dailyMeditation: z.number().max(3),
  })


export const userDataSchema = z.object({
  username: z.string().min(5).max(16),
  weightUnit: weightUnitsEnum,
  heightUnit: heightUnitsEnum,
  weight: z.number().max(3),
  height: z.number().max(3),
  startData: startDataSchema,
})

export type weightUnitType = z.infer<typeof weightUnitsEnum>
export type heightUnitType = z.infer<typeof heightUnitsEnum>
export type userDataType = z.infer<typeof userDataSchema>
export type startDataType = z.infer<typeof startDataSchema>
