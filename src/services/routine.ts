import { db } from "~/server/db";
import { z } from "zod";
import { Frequency } from "@prisma/client";
import { analyticsService } from "./analytics";

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

class RoutineService {
  /**
   * Create a new routine
   * @param data Routine data
   * @returns Created routine
   */
  async createRoutine(data: RoutineType) {
    try {
      const { taskIds, habitIds, ...routineData } = data;

      // Create the routine
      const routine = await db.routine.create({
        data: {
          title: routineData.title,
          description: routineData.description || "",
          userId: routineData.userId,
          categoryId: routineData.categoryId,
          frequency: routineData.frequency,
          isCompletedToday: false,
          streak: 0,
          color: routineData.color,

          // Connect tasks if provided
          tasks:
            taskIds && taskIds.length > 0
              ? {
                  connect: taskIds.map((id) => ({ id })),
                }
              : undefined,

          // Connect habits if provided
          habits:
            habitIds && habitIds.length > 0
              ? {
                  connect: habitIds.map((id) => ({ id })),
                }
              : undefined,
        },
        include: {
          category: true,
          tasks: true,
          habits: true,
        },
      });

      return routine;
    } catch (error) {
      console.error("Failed to create routine:", error);
      throw error;
    }
  }

  /**
   * Get a routine by ID
   * @param id Routine ID
   * @returns Routine with related data
   */
  async getRoutineById(id: string) {
    try {
      return await db.routine.findUnique({
        where: { id },
        include: {
          category: true,
          tasks: true,
          habits: true,
        },
      });
    } catch (error) {
      console.error(`Failed to get routine with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update a routine
   * @param id Routine ID
   * @param data Updated routine data
   * @returns Updated routine
   */
  async updateRoutine(id: string, data: Partial<RoutineType>) {
    try {
      const { taskIds, habitIds, ...routineData } = data;

      // Update the routine
      return await db.routine.update({
        where: { id },
        data: {
          ...routineData,

          // Update task connections if provided
          tasks: taskIds
            ? {
                set: taskIds.map((id) => ({ id })),
              }
            : undefined,

          // Update habit connections if provided
          habits: habitIds
            ? {
                set: habitIds.map((id) => ({ id })),
              }
            : undefined,
        },
        include: {
          category: true,
          tasks: true,
          habits: true,
        },
      });
    } catch (error) {
      console.error(`Failed to update routine with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a routine
   * @param id Routine ID
   * @returns Deleted routine
   */
  async deleteRoutine(id: string) {
    try {
      return await db.routine.delete({
        where: { id },
        include: {
          tasks: true,
          habits: true,
        },
      });
    } catch (error) {
      console.error(`Failed to delete routine with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all routines for a user
   * @param userId User ID (Clerk ID)
   * @returns Array of routines with related data
   */
  async getRoutinesByUserId(userId: string) {
    try {
      return await db.routine.findMany({
        where: { userId },
        include: {
          category: true,
          tasks: true,
          habits: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error(`Failed to get routines for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Complete a routine and all associated tasks and habits
   * @param id Routine ID
   * @param userId User ID (Clerk ID)
   * @returns Updated routine
   */
  async completeRoutine(id: string, userId: string) {
    try {
      // Get the routine with its tasks and habits
      const routine = await db.routine.findUnique({
        where: { id, userId },
        include: {
          tasks: true,
          habits: true,
        },
      });

      if (!routine) {
        throw new Error("Routine not found");
      }

      // Start a transaction to ensure all operations succeed or fail together
      return await db.$transaction(async (tx) => {
        const now = new Date();

        // Determine if we should update the streak
        let newStreak = routine.streak;
        let shouldUpdateStreak = !routine.isCompletedToday;

        if (shouldUpdateStreak) {
          const oneDayInMs = 24 * 60 * 60 * 1000;
          // For DAILY frequency
          if (routine.frequency === "DAILY") {
            const wasYesterday =
              routine.lastCompletedAt &&
              now.getTime() - routine.lastCompletedAt.getTime() <
                oneDayInMs * 2 &&
              new Date(routine.lastCompletedAt).getDate() !== now.getDate();
            newStreak = wasYesterday ? routine.streak + 1 : 1;
          }
          // For WEEKLY frequency
          else if (routine.frequency === "WEEKLY") {
            const oneWeekInMs = 7 * oneDayInMs;
            const wasLastWeek =
              routine.lastCompletedAt &&
              now.getTime() - routine.lastCompletedAt.getTime() <
                oneWeekInMs * 2 &&
              new Date(routine.lastCompletedAt).getDay() < now.getDay();
            newStreak = wasLastWeek ? routine.streak + 1 : 1;
          }
          // For MONTHLY frequency
          else if (routine.frequency === "MONTHLY") {
            const wasLastMonth =
              routine.lastCompletedAt &&
              new Date(routine.lastCompletedAt).getMonth() !== now.getMonth();
            newStreak = wasLastMonth ? routine.streak + 1 : 1;
          }
        }

        // Update the routine
        const updatedRoutine = await tx.routine.update({
          where: { id },
          data: {
            isCompletedToday: true,
            lastCompletedAt: now,
            streak: newStreak,
          },
          include: {
            category: true,
            tasks: true,
            habits: true,
          },
        });

        // Mark all tasks as completed
        for (const task of routine.tasks) {
          if (!task.completed) {
            await tx.task.update({
              where: { id: task.id },
              data: {
                completed: true,
                isCompletedToday: true,
                lastCompletedAt: now,
                // Update appropriate streak based on frequency
                ...(task.frequency === "DAILY"
                  ? { dailyStreak: task.dailyStreak + 1 }
                  : {}),
                ...(task.frequency === "WEEKLY"
                  ? { weeklyStreak: task.weeklyStreak + 1 }
                  : {}),
                ...(task.frequency === "MONTHLY"
                  ? { monthlyStreak: task.monthlyStreak + 1 }
                  : {}),
              },
            });
          }
        }

        // Mark all habits as completed by reaching their target
        for (const habit of routine.habits) {
          if (!habit.isCompletedToday) {
            await tx.habit.update({
              where: { id: habit.id },
              data: {
                completedToday: habit.targetCompletions, // Set to target to ensure marked complete
                isCompletedToday: true,
                lastCompletedAt: now,
                dailyStreak: habit.dailyStreak + 1,
              },
            });
          }
        }

        // Track completion in analytics if this is the first completion today
        if (shouldUpdateStreak) {
          await analyticsService.trackRoutineCompletion(userId, id);
        }

        return updatedRoutine;
      });
    } catch (error) {
      console.error(`Failed to complete routine with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Reset daily completion status for all routines based on frequency
   * To be called by cron job
   */
  async resetRoutines() {
    try {
      const now = new Date();
      const today = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const isFirstDayOfMonth = now.getDate() === 1;

      // Reset daily routines every day
      await db.routine.updateMany({
        where: {
          frequency: "DAILY",
          isCompletedToday: true,
        },
        data: {
          isCompletedToday: false,
        },
      });

      // Reset weekly routines on Mondays (day 1)
      if (today === 1) {
        await db.routine.updateMany({
          where: {
            frequency: "WEEKLY",
            isCompletedToday: true,
          },
          data: {
            isCompletedToday: false,
          },
        });
      }

      // Reset monthly routines on the first day of the month
      if (isFirstDayOfMonth) {
        await db.routine.updateMany({
          where: {
            frequency: "MONTHLY",
            isCompletedToday: true,
          },
          data: {
            isCompletedToday: false,
          },
        });
      }

      return {
        success: true,
        message: "Routines reset based on their frequencies",
      };
    } catch (error) {
      console.error("Failed to reset routines:", error);
      throw error;
    }
  }
}

export const routineService = new RoutineService();
