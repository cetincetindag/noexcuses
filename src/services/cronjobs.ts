import { habitService } from "./habit";
import { taskService } from "./task";
import { routineService } from "./routine";
import { analyticsService } from "./analytics";

/**
 * Base cron service class
 */
class CronService {
  /**
   * Perform daily reset of all entity types and analytics
   */
  async runDailyReset() {
    try {
      console.log("Starting daily cron job reset");

      // Reset habits
      await habitService.resetDailyHabits();

      // Reset tasks
      await taskService.resetDailyTasks();

      // Reset routines
      await routineService.resetDailyRoutines();

      // Reset analytics
      await analyticsService.resetDailyAnalytics();

      console.log("Daily cron job completed successfully");
      return { success: true };
    } catch (error) {
      console.error("Error running daily cron job:", error);
      throw error;
    }
  }

  /**
   * Perform weekly reset of analytics and streaks
   */
  async runWeeklyReset() {
    try {
      console.log("Starting weekly cron job reset");

      // Reset analytics weekly data
      await analyticsService.resetWeeklyAnalytics();

      console.log("Weekly cron job completed successfully");
      return { success: true };
    } catch (error) {
      console.error("Error running weekly cron job:", error);
      throw error;
    }
  }

  /**
   * Perform monthly reset of analytics and streaks
   */
  async runMonthlyReset() {
    try {
      console.log("Starting monthly cron job reset");

      // Reset analytics monthly data
      await analyticsService.resetMonthlyAnalytics();

      console.log("Monthly cron job completed successfully");
      return { success: true };
    } catch (error) {
      console.error("Error running monthly cron job:", error);
      throw error;
    }
  }
}

/**
 * Habit-specific cron operations
 */
class HabitCronService extends CronService {
  /**
   * Reset habits via API
   */
  async resetHabits() {
    try {
      const response = await fetch("/api/crons/resetHabits", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CRON_SECRET}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to reset habits: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error in HabitCronService.resetHabits:", error);
      throw error;
    }
  }
}

/**
 * Task-specific cron operations
 */
class TaskCronService extends CronService {
  /**
   * Reset tasks via API
   */
  async resetTasks() {
    try {
      const response = await fetch("/api/crons/resetTasks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CRON_SECRET}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to reset tasks: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error in TaskCronService.resetTasks:", error);
      throw error;
    }
  }
}

/**
 * Routine-specific cron operations
 */
class RoutineCronService extends CronService {
  /**
   * Reset routines via API
   */
  async resetRoutines() {
    try {
      const response = await fetch("/api/crons/resetRoutines", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CRON_SECRET}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to reset routines: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error in RoutineCronService.resetRoutines:", error);
      throw error;
    }
  }
}

export const cronService = new CronService();
export const habitCronService = new HabitCronService();
export const taskCronService = new TaskCronService();
export const routineCronService = new RoutineCronService();
