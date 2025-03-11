import { db } from "~/server/db";
import { analyticsService } from "./analytics";
import { HabitType, HabitSchema } from "../types/habit";

class HabitService {
  /**
   * Create a new habit
   * @param data HabitType data
   * @returns Created habit
   */
  async createHabit(data: HabitType) {
    try {
      console.log("Creating habit with data:", JSON.stringify(data, null, 2));

      if (!data.userId) {
        throw new Error("User ID is required");
      }

      // Check if the category exists
      const categoryExists = await db.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!categoryExists) {
        throw new Error(`Category with ID ${data.categoryId} not found`);
      }

      const habit = await db.habit.create({
        data: {
          title: data.title,
          description: data.description || "",
          targetCompletions: data.targetCompletions || 1,
          completedToday: 0,
          isCompletedToday: false,
          active: data.active !== undefined ? data.active : true,
          dailyStreak: 0,
          longestStreak: 0,
          categoryId: data.categoryId,
          userId: data.userId,
          order: data.order || 0,
          color: data.color,
        },
        include: {
          category: true,
        },
      });

      return habit;
    } catch (error) {
      console.error("Failed to create habit:", error);
      throw error;
    }
  }

  /**
   * Get a habit by ID
   * @param id Habit ID
   * @param userId User ID for authorization check
   * @returns Habit if found and belongs to user
   */
  async getHabitById(id: string, userId: string) {
    try {
      return await db.habit.findUnique({
        where: { 
          id,
          userId, // Add user check for security
        },
        include: {
          category: true,
          routines: true, // Include related routines
        },
      });
    } catch (error) {
      console.error(`Error fetching habit ${id} for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update a habit
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
   * Delete a habit
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
   * @param userId User's clerk ID
   * @returns Array of habits
   */
  async getHabitsByUserId(userId: string) {
    try {
      return await db.habit.findMany({
        where: { userId },
        include: {
          category: true,
        },
        orderBy: {
          order: "asc",
        },
      });
    } catch (error) {
      console.error(`Failed to get habits for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get habits by category
   * @param categoryId Category ID
   * @param userId User ID for authorization check
   * @returns Array of habits in the category
   */
  async getHabitsByCategory(categoryId: string, userId: string) {
    try {
      console.log(`Fetching habits for category ${categoryId} and user ${userId}`);
      
      return await db.habit.findMany({
        where: {
          categoryId,
          userId,
        },
        include: {
          category: true,
          routines: true,
        },
        orderBy: {
          order: 'asc',
        },
      });
    } catch (error) {
      console.error(`Error fetching habits for category ${categoryId}:`, error);
      throw error;
    }
  }

  /**
   * Get habits that are associated with a specific routine
   * @param routineId Routine ID
   * @param userId User ID for authorization check
   * @returns Array of habits in the routine
   */
  async getHabitsByRoutineId(routineId: string, userId: string) {
    try {
      console.log(`Fetching habits for routine ${routineId} and user ${userId}`);
      
      const routine = await db.routine.findUnique({
        where: {
          id: routineId,
          userId,
        },
        include: {
          habits: {
            include: {
              category: true,
            },
          },
        },
      });
      
      return routine?.habits || [];
    } catch (error) {
      console.error(`Error fetching habits for routine ${routineId}:`, error);
      throw error;
    }
  }

  /**
   * Complete a habit (increment completion count)
   * @param id Habit ID
   * @param userId User ID
   * @returns Updated habit
   */
  async completeHabit(id: string, userId: string) {
    try {
      // Get the current habit
      const habit = await db.habit.findUnique({
        where: { id, userId },
      });

      if (!habit) {
        throw new Error("Habit not found");
      }

      // Check if already completed target for today
      if (habit.completedToday >= habit.targetCompletions) {
        return habit; // Already completed
      }

      // Increment completed count
      const newCompletedCount = habit.completedToday + 1;
      const isCompletedToday = newCompletedCount >= habit.targetCompletions;

      // Determine if we should update the streak
      let newDailyStreak = habit.dailyStreak;
      let newLongestStreak = habit.longestStreak;

      // Only update streak if this completion reaches the target
      if (isCompletedToday && !habit.isCompletedToday) {
        newDailyStreak += 1;
        if (newDailyStreak > newLongestStreak) {
          newLongestStreak = newDailyStreak;
        }
      }

      // Update the habit
      const updatedHabit = await db.habit.update({
        where: { id },
        data: {
          completedToday: newCompletedCount,
          isCompletedToday,
          lastCompletedAt: new Date(),
          dailyStreak: newDailyStreak,
          longestStreak: newLongestStreak,
        },
        include: {
          category: true,
        },
      });

      // Track completion in analytics if this is the first time reaching the target today
      if (isCompletedToday && !habit.isCompletedToday) {
        await analyticsService.trackHabitCompletion(userId, id);
      }

      return updatedHabit;
    } catch (error) {
      console.error(`Failed to complete habit with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Reset daily habits (called by cron job)
   */
  async resetDailyHabits() {
    try {
      // Reset all habits' daily completion status
      const result = await db.habit.updateMany({
        where: {
          isCompletedToday: true,
        },
        data: {
          isCompletedToday: false,
          completedToday: 0,
        },
      });

      console.log(`Reset ${result.count} habits`);
      return result;
    } catch (error) {
      console.error("Failed to reset daily habits:", error);
      throw error;
    }
  }
}

export const habitService = new HabitService();
// Re-export the schema for use in API routes
export { HabitSchema };
