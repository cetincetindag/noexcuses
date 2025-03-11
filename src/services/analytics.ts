import { db } from "~/server/db";
import { AnalyticsData, getInitialAnalyticsData } from "../types/analytics";
import { Prisma } from "@prisma/client";

class AnalyticsService {
  /**
   * Initialize analytics data for a new user
   * @param userId User's clerk ID
   */
  async initializeUserAnalytics(userId: string) {
    try {
      console.log(`Initializing analytics for user ${userId}`);

      const user = await db.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      // Create initial analytics data
      const initialData = getInitialAnalyticsData();

      // Save to user record
      await db.user.update({
        where: { clerkId: userId },
        data: {
          analyticsData: initialData as any,
        },
      });

      return initialData;
    } catch (error) {
      console.error("Failed to initialize user analytics:", error);
      throw error;
    }
  }

  /**
   * Get analytics data for a user
   * @param userId User's clerk ID
   * @returns Analytics data
   */
  async getUserAnalytics(userId: string): Promise<AnalyticsData> {
    try {
      const user = await db.user.findUnique({
        where: { clerkId: userId },
        select: { analyticsData: true },
      });

      if (!user?.analyticsData) {
        const initialData = getInitialAnalyticsData();
        await db.user.update({
          where: { clerkId: userId },
          data: { analyticsData: initialData as unknown as Prisma.JsonObject },
        });
        return initialData;
      }

      return user.analyticsData as unknown as AnalyticsData;
    } catch (error) {
      console.error(`Error getting analytics for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Track habit completion in analytics
   * @param userId User ID
   * @param habitId Habit ID
   */
  async trackHabitCompletion(userId: string, habitId: string) {
    try {
      const analytics = await this.getUserAnalytics(userId);
      const habit = await db.habit.findUnique({
        where: { id: habitId, userId },
        select: { title: true, dailyStreak: true, categoryId: true },
      });

      if (!habit) {
        throw new Error(`Habit ${habitId} not found`);
      }

      // Update current streaks
      const habitIndex = analytics.streaks.current.habits.findIndex(
        (h) => h.id === habitId,
      );
      if (habitIndex >= 0) {
        const currentHabit = analytics.streaks.current.habits[habitIndex];
        if (currentHabit) {
          currentHabit.streak = habit.dailyStreak;
        }
      } else {
        analytics.streaks.current.habits.push({
          id: habitId,
          title: habit.title,
          streak: habit.dailyStreak,
        });
      }

      // Update history
      const now = new Date();
      const year = now.getFullYear().toString();
      const month = (now.getMonth() + 1).toString();
      const day = now.getDate().toString();

      // Initialize history structure if needed
      analytics.streaks.history[year] = analytics.streaks.history[year] || {};
      analytics.streaks.history[year][month] =
        analytics.streaks.history[year][month] || {};
      analytics.streaks.history[year][month][day] = analytics.streaks.history[
        year
      ][month][day] || {
        habits: [],
        tasks: [],
        routines: [],
      };

      const historyHabit = analytics.streaks.history[year][month][
        day
      ].habits.find((h) => h.id === habitId);
      if (historyHabit) {
        historyHabit.completed += 1;
      } else {
        analytics.streaks.history[year][month][day].habits.push({
          id: habitId,
          title: habit.title,
          completed: 1,
        });
      }

      // Update category usage
      analytics.categories.usage[habit.categoryId] =
        (analytics.categories.usage[habit.categoryId] || 0) + 1;

      // Save updated analytics
      await db.user.update({
        where: { clerkId: userId },
        data: { analyticsData: analytics as unknown as Prisma.JsonObject },
      });

      return analytics;
    } catch (error) {
      console.error(`Error tracking habit completion for ${habitId}:`, error);
      throw error;
    }
  }

  /**
   * Track task completion in analytics
   * @param userId User ID
   * @param taskId Task ID
   */
  async trackTaskCompletion(userId: string, taskId: string) {
    try {
      const analytics = await this.getUserAnalytics(userId);
      const task = await db.task.findUnique({
        where: { id: taskId },
        select: {
          title: true,
          dailyStreak: true,
          weeklyStreak: true,
          monthlyStreak: true,
          frequency: true,
          categoryId: true,
        },
      });

      if (!task) {
        throw new Error(`Task with ID ${taskId} not found`);
      }

      // Update current streaks
      const taskIndex = analytics.streaks.current.tasks.findIndex(
        (t) => t.id === taskId,
      );
      let streak = 0;
      if (task.frequency === "DAILY") streak = task.dailyStreak;
      else if (task.frequency === "WEEKLY") streak = task.weeklyStreak;
      else if (task.frequency === "MONTHLY") streak = task.monthlyStreak;

      if (taskIndex >= 0) {
        const currentTask = analytics.streaks.current.tasks[taskIndex];
        if (currentTask) {
          currentTask.streak = streak;
        }
      } else {
        analytics.streaks.current.tasks.push({
          id: taskId,
          title: task.title,
          streak,
        });
      }

      // Update longest streaks if applicable
      if (
        task.frequency === "DAILY" &&
        (!analytics.streaks.longest.daily ||
          task.dailyStreak > analytics.streaks.longest.daily.streak)
      ) {
        analytics.streaks.longest.daily = {
          id: taskId,
          title: task.title,
          streak: task.dailyStreak,
          type: "task",
        };
      } else if (
        task.frequency === "WEEKLY" &&
        (!analytics.streaks.longest.weekly ||
          task.weeklyStreak > analytics.streaks.longest.weekly.streak)
      ) {
        analytics.streaks.longest.weekly = {
          id: taskId,
          title: task.title,
          streak: task.weeklyStreak,
          type: "task",
        };
      } else if (
        task.frequency === "MONTHLY" &&
        (!analytics.streaks.longest.monthly ||
          task.monthlyStreak > analytics.streaks.longest.monthly.streak)
      ) {
        analytics.streaks.longest.monthly = {
          id: taskId,
          title: task.title,
          streak: task.monthlyStreak,
          type: "task",
        };
      }

      // Update history
      const today = new Date();
      const year = today.getFullYear().toString();
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const day = today.getDate().toString().padStart(2, "0");

      // Initialize history structure if needed
      analytics.streaks.history[year] = analytics.streaks.history[year] || {};
      analytics.streaks.history[year][month] =
        analytics.streaks.history[year][month] || {};
      analytics.streaks.history[year][month][day] = analytics.streaks.history[
        year
      ][month][day] || {
        habits: [],
        tasks: [],
        routines: [],
      };

      const historyTask = analytics.streaks.history[year][month][
        day
      ].tasks.find((t) => t.id === taskId);
      if (historyTask) {
        historyTask.completed = true;
      } else {
        analytics.streaks.history[year][month][day].tasks.push({
          id: taskId,
          title: task.title,
          completed: true,
        });
      }

      // Update completion counts
      analytics.completions.daily.tasks += 1;
      analytics.completions.daily.total += 1;
      analytics.completions.weekly.tasks += 1;
      analytics.completions.weekly.total += 1;
      analytics.completions.monthly.tasks += 1;
      analytics.completions.monthly.total += 1;
      analytics.completions.yearly.tasks += 1;
      analytics.completions.yearly.total += 1;

      // Update category usage safely
      const categoryUsage = analytics.categories.usage[task.categoryId] || 0;
      analytics.categories.usage[task.categoryId] = categoryUsage + 1;

      // Update favorite category
      const categoryId = task.categoryId;
      const currentUsage = analytics.categories.usage[categoryId] || 0;

      if (
        !analytics.categories.favorite ||
        currentUsage > analytics.categories.favorite.count
      ) {
        const category = await db.category.findUnique({
          where: { id: categoryId },
          select: { name: true },
        });

        if (category) {
          analytics.categories.favorite = {
            id: categoryId,
            name: category.name,
            count: currentUsage,
          };
        }
      }

      // Update most/least completed
      this.updateMostLeastCompleted(analytics);

      // Update timestamp
      analytics.lastUpdated = today.toISOString();

      // Save updated analytics
      await db.user.update({
        where: { clerkId: userId },
        data: { analyticsData: analytics as unknown as Prisma.JsonObject },
      });

      return analytics;
    } catch (error) {
      console.error(`Error tracking task completion for ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Track routine completion in analytics
   * @param userId User ID
   * @param routineId Routine ID
   */
  async trackRoutineCompletion(userId: string, routineId: string) {
    try {
      const analytics = await this.getUserAnalytics(userId);
      const routine = await db.routine.findUnique({
        where: { id: routineId },
        select: {
          title: true,
          streak: true,
          frequency: true,
          categoryId: true,
        },
      });

      if (!routine) {
        throw new Error(`Routine ${routineId} not found`);
      }

      // Update current streaks
      const routineIndex = analytics.streaks.current.routines.findIndex(
        (r) => r.id === routineId,
      );
      if (routineIndex >= 0) {
        const currentRoutine = analytics.streaks.current.routines[routineIndex];
        if (currentRoutine) {
          currentRoutine.streak = routine.streak;
        }
      } else {
        analytics.streaks.current.routines.push({
          id: routineId,
          title: routine.title,
          streak: routine.streak,
        });
      }

      // Initialize history structure if needed
      const now = new Date();
      const year = now.getFullYear().toString();
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const day = now.getDate().toString().padStart(2, "0");

      analytics.streaks.history[year] = analytics.streaks.history[year] || {};
      analytics.streaks.history[year][month] =
        analytics.streaks.history[year][month] || {};
      analytics.streaks.history[year][month][day] = analytics.streaks.history[
        year
      ][month][day] || {
        habits: [],
        tasks: [],
        routines: [],
      };

      const historyRoutine = analytics.streaks.history[year][month][
        day
      ].routines.find((r) => r.id === routineId);
      if (historyRoutine) {
        historyRoutine.completed += 1;
      } else {
        analytics.streaks.history[year][month][day].routines.push({
          id: routineId,
          title: routine.title,
          completed: 1,
        });
      }

      // Update category usage safely
      analytics.categories.usage[routine.categoryId] =
        (analytics.categories.usage[routine.categoryId] || 0) + 1;

      // Save updated analytics
      await db.user.update({
        where: { clerkId: userId },
        data: { analyticsData: analytics as unknown as Prisma.JsonObject },
      });

      return analytics;
    } catch (error) {
      console.error(
        `Error tracking routine completion for ${routineId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Update most and least completed items in analytics
   */
  private updateMostLeastCompleted(analytics: AnalyticsData) {
    interface CompletionValue {
      id: string;
      title: string;
      count: number;
      type: string;
    }

    // Helper function to safely get values
    const getCompletionValues = (
      data: Record<string, any>,
    ): CompletionValue[] => {
      return Object.entries(data)
        .filter((entry): entry is [string, CompletionValue] => {
          const [key, value] = entry;
          return (
            key !== "mostCompleted" &&
            key !== "leastCompleted" &&
            typeof value === "object" &&
            value !== null &&
            "count" in value &&
            "id" in value &&
            "title" in value &&
            "type" in value
          );
        })
        .map(([_, value]) => value);
    };

    // Process weekly completions
    const weeklyValues = getCompletionValues(analytics.completions.weekly);
    if (weeklyValues.length > 0) {
      const firstWeekly = weeklyValues[0];
      if (firstWeekly) {
        const mostCompleted = weeklyValues.reduce<CompletionValue>(
          (max, current) => (current.count > max.count ? current : max),
          firstWeekly,
        );
        const leastCompleted = weeklyValues.reduce<CompletionValue>(
          (min, current) => (current.count < min.count ? current : min),
          firstWeekly,
        );

        analytics.completions.weekly.mostCompleted = mostCompleted;
        analytics.completions.weekly.leastCompleted = leastCompleted;
      } else {
        analytics.completions.weekly.mostCompleted = null;
        analytics.completions.weekly.leastCompleted = null;
      }
    } else {
      analytics.completions.weekly.mostCompleted = null;
      analytics.completions.weekly.leastCompleted = null;
    }

    // Process monthly completions
    const monthlyValues = getCompletionValues(analytics.completions.monthly);
    if (monthlyValues.length > 0) {
      const firstMonthly = monthlyValues[0];
      if (firstMonthly) {
        const mostCompleted = monthlyValues.reduce<CompletionValue>(
          (max, current) => (current.count > max.count ? current : max),
          firstMonthly,
        );
        const leastCompleted = monthlyValues.reduce<CompletionValue>(
          (min, current) => (current.count < min.count ? current : min),
          firstMonthly,
        );

        analytics.completions.monthly.mostCompleted = mostCompleted;
        analytics.completions.monthly.leastCompleted = leastCompleted;
      } else {
        analytics.completions.monthly.mostCompleted = null;
        analytics.completions.monthly.leastCompleted = null;
      }
    } else {
      analytics.completions.monthly.mostCompleted = null;
      analytics.completions.monthly.leastCompleted = null;
    }
  }

  /**
   * Reset daily analytics for all users (to be called by cron job)
   */
  async resetDailyAnalytics() {
    try {
      // Get all users
      const users = await db.user.findMany({
        select: { clerkId: true, analyticsData: true },
      });

      const today = new Date();

      // Process each user
      for (const user of users) {
        if (!user.analyticsData) continue;

        const analytics = user.analyticsData as unknown as AnalyticsData;

        // Reset daily completions
        analytics.completions.daily = {
          habits: 0,
          tasks: 0,
          routines: 0,
          total: 0,
        };

        // Update timestamp
        analytics.lastUpdated = today.toISOString();

        // Save updated analytics
        await db.user.update({
          where: { clerkId: user.clerkId },
          data: { analyticsData: analytics as any },
        });
      }

      return { success: true, message: "Daily analytics reset for all users" };
    } catch (error) {
      console.error("Failed to reset daily analytics:", error);
      throw error;
    }
  }

  /**
   * Reset weekly analytics for all users (to be called by cron job)
   */
  async resetWeeklyAnalytics() {
    try {
      // Get all users
      const users = await db.user.findMany({
        select: { clerkId: true, analyticsData: true },
      });

      const today = new Date();

      // Process each user
      for (const user of users) {
        if (!user.analyticsData) continue;

        const analytics = user.analyticsData as unknown as AnalyticsData;

        // Reset weekly completions, but keep most/least completed
        const mostCompleted = analytics.completions.weekly.mostCompleted;
        const leastCompleted = analytics.completions.weekly.leastCompleted;

        analytics.completions.weekly = {
          habits: 0,
          tasks: 0,
          routines: 0,
          total: 0,
          mostCompleted,
          leastCompleted,
        };

        // Update timestamp
        analytics.lastUpdated = today.toISOString();

        // Save updated analytics
        await db.user.update({
          where: { clerkId: user.clerkId },
          data: { analyticsData: analytics as any },
        });
      }

      return { success: true, message: "Weekly analytics reset for all users" };
    } catch (error) {
      console.error("Failed to reset weekly analytics:", error);
      throw error;
    }
  }

  /**
   * Reset monthly analytics for all users (to be called by cron job)
   */
  async resetMonthlyAnalytics() {
    try {
      // Get all users
      const users = await db.user.findMany({
        select: { clerkId: true, analyticsData: true },
      });

      const today = new Date();

      // Process each user
      for (const user of users) {
        if (!user.analyticsData) continue;

        const analytics = user.analyticsData as unknown as AnalyticsData;

        // Reset monthly completions, but keep most/least completed
        const mostCompleted = analytics.completions.monthly.mostCompleted;
        const leastCompleted = analytics.completions.monthly.leastCompleted;

        analytics.completions.monthly = {
          habits: 0,
          tasks: 0,
          routines: 0,
          total: 0,
          mostCompleted,
          leastCompleted,
        };

        // Update timestamp
        analytics.lastUpdated = today.toISOString();

        // Save updated analytics
        await db.user.update({
          where: { clerkId: user.clerkId },
          data: { analyticsData: analytics as any },
        });
      }

      return {
        success: true,
        message: "Monthly analytics reset for all users",
      };
    } catch (error) {
      console.error("Failed to reset monthly analytics:", error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
