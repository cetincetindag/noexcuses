import { db } from "~/server/db";
import { z } from "zod";
import { analyticsService } from "./analytics";

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
});

export type HabitType = z.infer<typeof HabitSchema>;

class HabitService {
  /**
   * Create a new habit
   * @param data Habit data
   * @returns Created habit
   */
  async createHabit(data: HabitType) {
    try {
      return await db.habit.create({
        data: {
          title: data.title,
          description: data.description || "",
          userId: data.userId,
          categoryId: data.categoryId,
          targetCompletions: data.targetCompletions,
          active: data.active,
          isCompletedToday: false,
          dailyStreak: 0,
          completedToday: 0,
          color: data.color,
        },
        include: {
          category: true,
        },
      });
    } catch (error) {
      console.error("Failed to create habit:", error);
      throw error;
    }
  }

  /**
   * Retrieve a habit by ID
   * @param id Habit ID
   * @returns Habit with category
   */
  async getHabitById(id: string) {
    try {
      return await db.habit.findUnique({
        where: { id },
        include: {
          category: true,
        },
      });
    } catch (error) {
      console.error(`Failed to get habit with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update a habit by ID
   * @param id Habit ID
   * @param data Updated habit data
   * @returns Updated habit
   */
  async updateHabit(id: string, data: Partial<HabitType>) {
    try {
      return await db.habit.update({
        where: { id },
        data,
        include: {
          category: true,
        },
      });
    } catch (error) {
      console.error(`Failed to update habit with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a habit by ID
   * @param id Habit ID
   * @returns Deleted habit
   */
  async deleteHabit(id: string) {
    try {
      return await db.habit.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Failed to delete habit with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all habits for a user
   * @param userId User ID (Clerk ID)
   * @returns Array of habits with categories
   */
  async getHabitsByUserId(userId: string) {
    try {
      return await db.habit.findMany({
        where: {
          userId,
          active: true,
        },
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error(`Failed to get habits for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Complete a habit (increment completion count for the day)
   * @param id Habit ID
   * @returns Updated habit
   */
  async completeHabit(id: string, userId: string) {
    try {
      // Get the habit
      const habit = await db.habit.findUnique({
        where: { id, userId },
      });

      if (!habit) {
        throw new Error("Habit not found");
      }

      const now = new Date();
      const completedToday = habit.completedToday + 1;
      const targetReached = completedToday >= habit.targetCompletions;

      // Update lastCompletedAt regardless of target
      let updates: any = {
        completedToday,
        lastCompletedAt: now,
      };

      // Only update streak and isCompletedToday if target reached
      if (targetReached && !habit.isCompletedToday) {
        const oneDayInMs = 24 * 60 * 60 * 1000;
        const wasYesterday =
          habit.lastCompletedAt &&
          now.getTime() - habit.lastCompletedAt.getTime() < oneDayInMs * 2 &&
          new Date(habit.lastCompletedAt).getDate() !== now.getDate();

        // Increment streak if completed yesterday or starting new streak
        updates.dailyStreak = wasYesterday ? habit.dailyStreak + 1 : 1;
        updates.isCompletedToday = true;
      }

      // Update the habit in the database
      const updatedHabit = await db.habit.update({
        where: { id },
        data: updates,
        include: {
          category: true,
        },
      });

      // Log this completion in analytics if target reached
      if (targetReached && !habit.isCompletedToday) {
        await analyticsService.trackHabitCompletion(userId, id);
      }

      return updatedHabit;
    } catch (error) {
      console.error(`Failed to complete habit with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Reset completion status for a habit
   * @param id Habit ID
   * @returns Updated habit
   */
  async uncompleteHabit(id: string) {
    try {
      // Get the habit
      const habit = await db.habit.findUnique({
        where: { id },
      });

      if (!habit) {
        throw new Error("Habit not found");
      }

      // Only allow uncompleting if completedToday > 0
      if (habit.completedToday <= 0) {
        throw new Error("Habit has no completions today to remove");
      }

      const completedToday = habit.completedToday - 1;
      const targetNotReached = completedToday < habit.targetCompletions;

      // Base updates - always decrement completedToday
      let updates: any = {
        completedToday,
      };

      // Only update streak if this causes target to no longer be reached
      if (targetNotReached && habit.isCompletedToday) {
        updates.isCompletedToday = false;
        // Note: We don't decrement the streak as that would be confusing to users
        // Just mark as not completed for today
      }

      // Update the habit in the database
      return await db.habit.update({
        where: { id },
        data: updates,
        include: {
          category: true,
        },
      });
    } catch (error) {
      console.error(`Failed to uncomplete habit with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Reset daily habit completions for all users
   * To be called by cron job at midnight
   */
  async resetDailyHabits() {
    try {
      // Reset all habits' daily completion status
      await db.habit.updateMany({
        where: {
          active: true,
        },
        data: {
          isCompletedToday: false,
          completedToday: 0,
        },
      });

      return { success: true, message: "All habits reset for the day" };
    } catch (error) {
      console.error("Failed to reset daily habits:", error);
      throw error;
    }
  }
}

export const habitService = new HabitService();
