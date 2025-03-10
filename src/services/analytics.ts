import { db } from "~/server/db";
import { Frequency } from "@prisma/client";

// Define analytics data structure
export interface AnalyticsData {
  streaks: {
    current: {
      habits: { id: string; title: string; streak: number }[];
      tasks: { id: string; title: string; streak: number }[];
      routines: { id: string; title: string; streak: number }[];
    };
    longest: {
      daily: { id: string; title: string; streak: number; type: string } | null;
      weekly: {
        id: string;
        title: string;
        streak: number;
        type: string;
      } | null;
      monthly: {
        id: string;
        title: string;
        streak: number;
        type: string;
      } | null;
    };
    history: {
      [year: string]: {
        [month: string]: {
          [day: string]: {
            habits: { id: string; title: string; completed: number }[];
            tasks: { id: string; title: string; completed: boolean }[];
            routines: { id: string; title: string; completed: number }[];
          };
        };
      };
    };
  };
  completions: {
    daily: {
      habits: number;
      tasks: number;
      routines: number;
      total: number;
    };
    weekly: {
      habits: number;
      tasks: number;
      routines: number;
      total: number;
      mostCompleted: {
        id: string;
        title: string;
        count: number;
        type: string;
      } | null;
      leastCompleted: {
        id: string;
        title: string;
        count: number;
        type: string;
      } | null;
    };
    monthly: {
      habits: number;
      tasks: number;
      routines: number;
      total: number;
      mostCompleted: {
        id: string;
        title: string;
        count: number;
        type: string;
      } | null;
      leastCompleted: {
        id: string;
        title: string;
        count: number;
        type: string;
      } | null;
    };
    yearly: {
      habits: number;
      tasks: number;
      routines: number;
      total: number;
    };
  };
  categories: {
    favorite: { id: string; name: string; count: number } | null;
    usage: { [categoryId: string]: number };
  };
  lastUpdated: string;
}

// Initialize default analytics structure
export function getInitialAnalyticsData(): AnalyticsData {
  return {
    streaks: {
      current: {
        habits: [],
        tasks: [],
        routines: [],
      },
      longest: {
        daily: null,
        weekly: null,
        monthly: null,
      },
      history: {},
    },
    completions: {
      daily: {
        habits: 0,
        tasks: 0,
        routines: 0,
        total: 0,
      },
      weekly: {
        habits: 0,
        tasks: 0,
        routines: 0,
        total: 0,
        mostCompleted: null,
        leastCompleted: null,
      },
      monthly: {
        habits: 0,
        tasks: 0,
        routines: 0,
        total: 0,
        mostCompleted: null,
        leastCompleted: null,
      },
      yearly: {
        habits: 0,
        tasks: 0,
        routines: 0,
        total: 0,
      },
    },
    categories: {
      favorite: null,
      usage: {},
    },
    lastUpdated: new Date().toISOString(),
  };
}

class AnalyticsService {
  /**
   * Initialize analytics data for a new user
   * @param userId User clerk ID
   */
  async initializeUserAnalytics(userId: string) {
    try {
      const initialData = getInitialAnalyticsData();

      await db.user.update({
        where: { clerkId: userId },
        data: {
          analyticsData: initialData as any, // Cast to any to avoid type issues with JSON
        },
      });

      return initialData;
    } catch (error) {
      console.error("Failed to initialize user analytics:", error);
      throw error;
    }
  }

  /**
   * Get a user's analytics data
   * @param userId User clerk ID
   */
  async getUserAnalytics(userId: string): Promise<AnalyticsData> {
    try {
      const user = await db.user.findUnique({
        where: { clerkId: userId },
        select: { analyticsData: true },
      });

      if (!user?.analyticsData) {
        // Initialize analytics if not exists
        return this.initializeUserAnalytics(userId);
      }

      return user.analyticsData as unknown as AnalyticsData;
    } catch (error) {
      console.error("Failed to get user analytics:", error);
      throw error;
    }
  }

  /**
   * Update analytics when a habit is completed
   * @param userId User clerk ID
   * @param habitId Habit ID
   */
  async trackHabitCompletion(userId: string, habitId: string) {
    try {
      // Get current user analytics and habit
      const [analytics, habit] = await Promise.all([
        this.getUserAnalytics(userId),
        db.habit.findUnique({
          where: { id: habitId, userId },
          include: { category: true },
        }),
      ]);

      if (!habit) throw new Error("Habit not found");

      const today = new Date();
      const year = today.getFullYear().toString();
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const day = today.getDate().toString().padStart(2, "0");

      // Initialize history structure if needed
      if (!analytics.streaks.history[year]) {
        analytics.streaks.history[year] = {};
      }
      if (!analytics.streaks.history[year][month]) {
        analytics.streaks.history[year][month] = {};
      }
      if (!analytics.streaks.history[year][month][day]) {
        analytics.streaks.history[year][month][day] = {
          habits: [],
          tasks: [],
          routines: [],
        };
      }

      // Track habit completion in history
      const existingHabitEntry = analytics.streaks.history[year][month][
        day
      ].habits.find((h) => h.id === habitId);

      if (existingHabitEntry) {
        existingHabitEntry.completed++;
      } else {
        analytics.streaks.history[year][month][day].habits.push({
          id: habitId,
          title: habit.title,
          completed: 1,
        });
      }

      // Update streak information
      const currentStreakEntry = analytics.streaks.current.habits.find(
        (h) => h.id === habitId,
      );

      if (currentStreakEntry) {
        currentStreakEntry.streak = habit.dailyStreak;
      } else {
        analytics.streaks.current.habits.push({
          id: habitId,
          title: habit.title,
          streak: habit.dailyStreak,
        });
      }

      // Update longest streak if applicable
      if (
        !analytics.streaks.longest.daily ||
        habit.dailyStreak > analytics.streaks.longest.daily.streak
      ) {
        analytics.streaks.longest.daily = {
          id: habitId,
          title: habit.title,
          streak: habit.dailyStreak,
          type: "habit",
        };
      }

      // Update completion counters
      analytics.completions.daily.habits++;
      analytics.completions.daily.total++;
      analytics.completions.weekly.habits++;
      analytics.completions.weekly.total++;
      analytics.completions.monthly.habits++;
      analytics.completions.monthly.total++;
      analytics.completions.yearly.habits++;
      analytics.completions.yearly.total++;

      // Update category usage
      const categoryId = habit.categoryId;
      if (!analytics.categories.usage[categoryId]) {
        analytics.categories.usage[categoryId] = 0;
      }
      analytics.categories.usage[categoryId]++;

      // Determine favorite category
      let maxUsage = 0;
      let favoriteCategory = null;

      for (const [catId, count] of Object.entries(analytics.categories.usage)) {
        if (count > maxUsage) {
          maxUsage = count;
          favoriteCategory = catId;
        }
      }

      if (favoriteCategory) {
        analytics.categories.favorite = {
          id: favoriteCategory,
          name:
            favoriteCategory === categoryId ? habit.category.name : "Unknown",
          count: maxUsage,
        };
      }

      // Update most/least completed tasks/habits
      this.updateMostLeastCompleted(analytics);

      // Save updated analytics
      await db.user.update({
        where: { clerkId: userId },
        data: {
          analyticsData: analytics as any, // Cast to any to avoid type issues with JSON
        },
      });

      return analytics;
    } catch (error) {
      console.error("Failed to track habit completion:", error);
      throw error;
    }
  }

  /**
   * Update analytics when a task is completed
   * @param userId User clerk ID
   * @param taskId Task ID
   */
  async trackTaskCompletion(userId: string, taskId: string) {
    try {
      // Get current user analytics and task
      const [analytics, task] = await Promise.all([
        this.getUserAnalytics(userId),
        db.task.findUnique({
          where: { id: taskId, userId },
          include: { category: true },
        }),
      ]);

      if (!task) throw new Error("Task not found");

      const today = new Date();
      const year = today.getFullYear().toString();
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const day = today.getDate().toString().padStart(2, "0");

      // Initialize history structure if needed
      if (!analytics.streaks.history[year]) {
        analytics.streaks.history[year] = {};
      }
      if (!analytics.streaks.history[year][month]) {
        analytics.streaks.history[year][month] = {};
      }
      if (!analytics.streaks.history[year][month][day]) {
        analytics.streaks.history[year][month][day] = {
          habits: [],
          tasks: [],
          routines: [],
        };
      }

      // Track task completion in history
      analytics.streaks.history[year][month][day].tasks.push({
        id: taskId,
        title: task.title,
        completed: true,
      });

      // Update streak information based on frequency
      let streakField: keyof AnalyticsData["streaks"]["longest"] | null = null;
      let streakValue = 0;

      if (task.frequency === "DAILY") {
        streakField = "daily";
        streakValue = task.dailyStreak;
      } else if (task.frequency === "WEEKLY") {
        streakField = "weekly";
        streakValue = task.weeklyStreak;
      } else if (task.frequency === "MONTHLY") {
        streakField = "monthly";
        streakValue = task.monthlyStreak;
      }

      if (streakField) {
        // Update current streak
        const currentStreakEntry = analytics.streaks.current.tasks.find(
          (t) => t.id === taskId,
        );

        if (currentStreakEntry) {
          currentStreakEntry.streak = streakValue;
        } else {
          analytics.streaks.current.tasks.push({
            id: taskId,
            title: task.title,
            streak: streakValue,
          });
        }

        // Update longest streak if applicable
        if (
          !analytics.streaks.longest[streakField] ||
          streakValue > analytics.streaks.longest[streakField]!.streak
        ) {
          analytics.streaks.longest[streakField] = {
            id: taskId,
            title: task.title,
            streak: streakValue,
            type: "task",
          };
        }
      }

      // Update completion counters
      analytics.completions.daily.tasks++;
      analytics.completions.daily.total++;
      analytics.completions.weekly.tasks++;
      analytics.completions.weekly.total++;
      analytics.completions.monthly.tasks++;
      analytics.completions.monthly.total++;
      analytics.completions.yearly.tasks++;
      analytics.completions.yearly.total++;

      // Update category usage
      const categoryId = task.categoryId;
      if (!analytics.categories.usage[categoryId]) {
        analytics.categories.usage[categoryId] = 0;
      }
      analytics.categories.usage[categoryId]++;

      // Determine favorite category
      let maxUsage = 0;
      let favoriteCategory = null;

      for (const [catId, count] of Object.entries(analytics.categories.usage)) {
        if (count > maxUsage) {
          maxUsage = count;
          favoriteCategory = catId;
        }
      }

      if (favoriteCategory) {
        analytics.categories.favorite = {
          id: favoriteCategory,
          name:
            favoriteCategory === categoryId ? task.category.name : "Unknown",
          count: maxUsage,
        };
      }

      // Update most/least completed tasks/habits
      this.updateMostLeastCompleted(analytics);

      // Save updated analytics
      await db.user.update({
        where: { clerkId: userId },
        data: {
          analyticsData: analytics as any, // Cast to any to avoid type issues with JSON
        },
      });

      return analytics;
    } catch (error) {
      console.error("Failed to track task completion:", error);
      throw error;
    }
  }

  /**
   * Update analytics when a routine is completed
   * @param userId User clerk ID
   * @param routineId Routine ID
   */
  async trackRoutineCompletion(userId: string, routineId: string) {
    try {
      // Get current user analytics and routine
      const [analytics, routine] = await Promise.all([
        this.getUserAnalytics(userId),
        db.routine.findUnique({
          where: { id: routineId, userId },
          include: { category: true },
        }),
      ]);

      if (!routine) throw new Error("Routine not found");

      const today = new Date();
      const year = today.getFullYear().toString();
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const day = today.getDate().toString().padStart(2, "0");

      // Initialize history structure if needed
      if (!analytics.streaks.history[year]) {
        analytics.streaks.history[year] = {};
      }
      if (!analytics.streaks.history[year][month]) {
        analytics.streaks.history[year][month] = {};
      }
      if (!analytics.streaks.history[year][month][day]) {
        analytics.streaks.history[year][month][day] = {
          habits: [],
          tasks: [],
          routines: [],
        };
      }

      // Track routine completion in history
      const existingRoutineEntry = analytics.streaks.history[year][month][
        day
      ].routines.find((r) => r.id === routineId);

      if (existingRoutineEntry) {
        existingRoutineEntry.completed++;
      } else {
        analytics.streaks.history[year][month][day].routines.push({
          id: routineId,
          title: routine.title,
          completed: 1,
        });
      }

      // Update streak information
      const currentStreakEntry = analytics.streaks.current.routines.find(
        (r) => r.id === routineId,
      );

      if (currentStreakEntry) {
        currentStreakEntry.streak = routine.streak;
      } else {
        analytics.streaks.current.routines.push({
          id: routineId,
          title: routine.title,
          streak: routine.streak,
        });
      }

      // Update longest streak if applicable - based on routine frequency
      let streakField: keyof AnalyticsData["streaks"]["longest"] | null = null;

      if (routine.frequency === "DAILY") {
        streakField = "daily";
      } else if (routine.frequency === "WEEKLY") {
        streakField = "weekly";
      } else if (routine.frequency === "MONTHLY") {
        streakField = "monthly";
      }

      if (
        streakField &&
        (!analytics.streaks.longest[streakField] ||
          routine.streak > analytics.streaks.longest[streakField]!.streak)
      ) {
        analytics.streaks.longest[streakField] = {
          id: routineId,
          title: routine.title,
          streak: routine.streak,
          type: "routine",
        };
      }

      // Update completion counters
      analytics.completions.daily.routines++;
      analytics.completions.daily.total++;
      analytics.completions.weekly.routines++;
      analytics.completions.weekly.total++;
      analytics.completions.monthly.routines++;
      analytics.completions.monthly.total++;
      analytics.completions.yearly.routines++;
      analytics.completions.yearly.total++;

      // Update category usage
      const categoryId = routine.categoryId;
      if (!analytics.categories.usage[categoryId]) {
        analytics.categories.usage[categoryId] = 0;
      }
      analytics.categories.usage[categoryId]++;

      // Determine favorite category
      let maxUsage = 0;
      let favoriteCategory = null;

      for (const [catId, count] of Object.entries(analytics.categories.usage)) {
        if (count > maxUsage) {
          maxUsage = count;
          favoriteCategory = catId;
        }
      }

      if (favoriteCategory) {
        analytics.categories.favorite = {
          id: favoriteCategory,
          name:
            favoriteCategory === categoryId ? routine.category.name : "Unknown",
          count: maxUsage,
        };
      }

      // Update most/least completed
      this.updateMostLeastCompleted(analytics);

      // Save updated analytics
      await db.user.update({
        where: { clerkId: userId },
        data: {
          analyticsData: analytics as any, // Cast to any to avoid type issues with JSON
        },
      });

      return analytics;
    } catch (error) {
      console.error("Failed to track routine completion:", error);
      throw error;
    }
  }

  /**
   * Update the most/least completed items in analytics
   * @param analytics Analytics data to update
   */
  private updateMostLeastCompleted(analytics: AnalyticsData) {
    // Create aggregated counts across all types
    const weeklyCompletions: Record<
      string,
      { id: string; title: string; count: number; type: string }
    > = {};
    const monthlyCompletions: Record<
      string,
      { id: string; title: string; count: number; type: string }
    > = {};

    // Process weekly data (last 7 days)
    const now = new Date();
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Process monthly data (current month)
    const currentYear = now.getFullYear().toString();
    const currentMonth = (now.getMonth() + 1).toString().padStart(2, "0");

    // Process history
    for (const [year, months] of Object.entries(analytics.streaks.history)) {
      for (const [month, days] of Object.entries(months)) {
        for (const [day, items] of Object.entries(days)) {
          // Create date from year/month/day
          const date = new Date(`${year}-${month}-${day}`);

          // Process for weekly stats
          if (date >= lastWeek && date <= now) {
            // Process habits
            for (const habit of items.habits) {
              const key = `habit-${habit.id}`;
              if (!weeklyCompletions[key]) {
                weeklyCompletions[key] = {
                  id: habit.id,
                  title: habit.title,
                  count: 0,
                  type: "habit",
                };
              }
              weeklyCompletions[key].count += habit.completed;
            }

            // Process tasks
            for (const task of items.tasks) {
              const key = `task-${task.id}`;
              if (!weeklyCompletions[key]) {
                weeklyCompletions[key] = {
                  id: task.id,
                  title: task.title,
                  count: 0,
                  type: "task",
                };
              }
              weeklyCompletions[key].count += task.completed ? 1 : 0;
            }

            // Process routines
            for (const routine of items.routines) {
              const key = `routine-${routine.id}`;
              if (!weeklyCompletions[key]) {
                weeklyCompletions[key] = {
                  id: routine.id,
                  title: routine.title,
                  count: 0,
                  type: "routine",
                };
              }
              weeklyCompletions[key].count += routine.completed;
            }
          }

          // Process for monthly stats (current month)
          if (year === currentYear && month === currentMonth) {
            // Process habits
            for (const habit of items.habits) {
              const key = `habit-${habit.id}`;
              if (!monthlyCompletions[key]) {
                monthlyCompletions[key] = {
                  id: habit.id,
                  title: habit.title,
                  count: 0,
                  type: "habit",
                };
              }
              monthlyCompletions[key].count += habit.completed;
            }

            // Process tasks
            for (const task of items.tasks) {
              const key = `task-${task.id}`;
              if (!monthlyCompletions[key]) {
                monthlyCompletions[key] = {
                  id: task.id,
                  title: task.title,
                  count: 0,
                  type: "task",
                };
              }
              monthlyCompletions[key].count += task.completed ? 1 : 0;
            }

            // Process routines
            for (const routine of items.routines) {
              const key = `routine-${routine.id}`;
              if (!monthlyCompletions[key]) {
                monthlyCompletions[key] = {
                  id: routine.id,
                  title: routine.title,
                  count: 0,
                  type: "routine",
                };
              }
              monthlyCompletions[key].count += routine.completed;
            }
          }
        }
      }
    }

    // Find most and least completed weekly
    const weeklyValues = Object.values(weeklyCompletions);
    if (weeklyValues.length > 0) {
      let mostCompleted = weeklyValues[0];
      let leastCompleted = weeklyValues[0];

      for (const item of weeklyValues) {
        if (item.count > mostCompleted.count) {
          mostCompleted = item;
        }
        if (item.count < leastCompleted.count) {
          leastCompleted = item;
        }
      }

      analytics.completions.weekly.mostCompleted = mostCompleted;
      analytics.completions.weekly.leastCompleted = leastCompleted;
    }

    // Find most and least completed monthly
    const monthlyValues = Object.values(monthlyCompletions);
    if (monthlyValues.length > 0) {
      let mostCompleted = monthlyValues[0];
      let leastCompleted = monthlyValues[0];

      for (const item of monthlyValues) {
        if (item.count > mostCompleted.count) {
          mostCompleted = item;
        }
        if (item.count < leastCompleted.count) {
          leastCompleted = item;
        }
      }

      analytics.completions.monthly.mostCompleted = mostCompleted;
      analytics.completions.monthly.leastCompleted = leastCompleted;
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
