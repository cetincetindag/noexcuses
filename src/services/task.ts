import { db } from "~/server/db";
import { Frequency } from "@prisma/client";
import { TaskSchema, TaskType } from "../types/task";
import { analyticsService } from "./analytics";

class TaskService {
  async createTask(data: TaskType) {
    try {
      console.log(
        "TaskService - Creating task with data:",
        JSON.stringify(data, null, 2),
      );

      if (!data.userId) {
        const error = new Error("User ID is required");
        console.error("TaskService error:", error);
        throw error;
      }

      // Check if the category exists
      try {
        const categoryExists = await db.category.findUnique({
          where: { id: data.categoryId },
        });

        if (!categoryExists) {
          const error = new Error(
            `Category with ID ${data.categoryId} not found`,
          );
          console.error("TaskService error:", error);
          throw error;
        }
      } catch (categoryError) {
        console.error("Error checking category:", categoryError);
        throw new Error(
          `Error validating category: ${categoryError instanceof Error ? categoryError.message : String(categoryError)}`,
        );
      }

      // Re-validate data with Zod schema
      try {
        console.log("Validating task data with schema");
        const validatedData = TaskSchema.parse(data);
        console.log(
          "Task data validated successfully:",
          JSON.stringify(validatedData, null, 2),
        );

        // Create a clean data object for Prisma, removing any fields that might cause issues
        const prismaData = {
          title: validatedData.title,
          description: validatedData.description,
          priority: validatedData.priority,
          frequency: validatedData.frequency,
          order: validatedData.order,
          completed: validatedData.completed,
          isCompletedToday: validatedData.isCompletedToday,
          dailyStreak: validatedData.dailyStreak,
          weeklyStreak: validatedData.weeklyStreak,
          monthlyStreak: validatedData.monthlyStreak,
          categoryId: validatedData.categoryId,
          userId: validatedData.userId,
          dueDate: validatedData.dueDate
            ? new Date(validatedData.dueDate)
            : null,
          lastCompletedAt: validatedData.lastCompletedAt
            ? new Date(validatedData.lastCompletedAt)
            : null,
          isRecurring: validatedData.isRecurring ?? false,
        };

        // Log the data being sent to Prisma
        console.log(
          "Creating task in database with data:",
          JSON.stringify(prismaData, null, 2),
        );

        // Create the task
        const task = await db.task.create({
          data: prismaData,
          include: {
            category: true,
          },
        });

        console.log("Task created successfully:", task.id);
        return task;
      } catch (validationError) {
        console.error("Task data validation error:", validationError);
        throw validationError;
      }
    } catch (error) {
      console.error("Failed to create task:", error);
      throw error;
    }
  }

  /**
   * Get a task by ID
   * @param taskId Task ID
   * @param userId User ID for authorization check
   * @returns Task if found and belongs to user
   */
  async getTaskById(taskId: string, userId: string) {
    try {
      return await db.task.findUnique({
        where: { id: taskId, userId },
        include: {
          category: true,
          routines: true, // Include related routines
        },
      });
    } catch (error) {
      console.error(`Error fetching task ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Update a task
   * @param taskId Task ID
   * @param data Task data to update
   * @param userId User ID for authorization check
   * @returns Updated task
   */
  async updateTask(taskId: string, data: Partial<TaskType>, userId: string) {
    try {
      console.log(
        `Updating task ${taskId} for user ${userId} with data:`,
        JSON.stringify(data, null, 2),
      );

      // Verify task belongs to user
      const existingTask = await this.getTaskById(taskId, userId);
      if (!existingTask) {
        throw new Error(
          `Task with ID ${taskId} not found or does not belong to user`,
        );
      }

      return await db.task.update({
        where: { id: taskId },
        data,
        include: {
          category: true,
          routines: true,
        },
      });
    } catch (error) {
      console.error(`Error updating task ${taskId}:`, error);
      throw error;
    }
  }

  async deleteTask(taskId: string, userId: string) {
    try {
      await db.task.delete({ where: { id: taskId, userId: userId } });
    } catch (error) {
      console.error("Failed to delete task:", error);
      throw error;
    }
  }

  async getTasksByFrequency(frequency: Frequency, userId: string) {
    try {
      return await db.task.findMany({
        where: { frequency, userId },
        include: {
          category: true,
        },
      });
    } catch (error) {
      console.error("Failed to get tasks by frequency:", error);
      throw error;
    }
  }

  async getTasksByCategory(categoryId: string, userId: string) {
    try {
      return await db.task.findMany({
        where: { categoryId, userId },
        include: {
          category: true,
        },
      });
    } catch (error) {
      console.error("Failed to get tasks by category:", error);
      throw error;
    }
  }

  /**
   * Retrieves all tasks for a user by their Clerk ID
   *
   * @param clerkId - The Clerk ID of the user (passed from auth())
   * @returns Array of tasks with their categories included
   */
  async getTasksByUserId(clerkId: string) {
    try {
      console.log(
        `TaskService: Fetching tasks for user with clerkId: ${clerkId}`,
      );

      if (!clerkId) {
        console.error("TaskService: No clerkId provided to getTasksByUserId");
        return [];
      }

      // First check if the user exists in our database
      const userExists = await db.user.findUnique({
        where: { clerkId },
        select: { databaseId: true },
      });

      if (!userExists) {
        console.warn(
          `TaskService: User with clerkId ${clerkId} not found in database`,
        );
        return [];
      }

      const tasks = await db.task.findMany({
        where: {
          userId: clerkId,
        },
        include: {
          category: true,
        },
        orderBy: {
          order: "asc",
        },
      });

      console.log(
        `TaskService: Found ${tasks.length} tasks for user ${clerkId}`,
      );
      return tasks;
    } catch (error) {
      console.error(
        `TaskService: Failed to get tasks for clerkId ${clerkId}:`,
        error,
      );
      // Return empty array instead of throwing to prevent UI breakage
      return [];
    }
  }

  /**
   * Marks a task as completed
   *
   * @param taskId - The ID of the task to complete
   * @param userId - The user ID who owns the task
   * @returns The updated task
   */
  async completeTask(taskId: string, userId: string) {
    try {
      console.log(`Marking task ${taskId} as completed for user ${userId}`);

      // First, get the current task to check its frequency
      const currentTask = await db.task.findUnique({
        where: {
          id: taskId,
          userId: userId,
        },
      });

      if (!currentTask) {
        throw new Error(`Task ${taskId} not found`);
      }

      // Prepare the update data based on the frequency
      const updateData: any = {
        completed: true,
        lastCompletedAt: new Date(),
      };

      // For daily tasks, also update the daily streak and mark as completed today
      if (currentTask.frequency === "DAILY") {
        updateData.isCompletedToday = true;
        updateData.dailyStreak = { increment: 1 };
      } else if (currentTask.frequency === "WEEKLY") {
        updateData.weeklyStreak = { increment: 1 };
      } else if (currentTask.frequency === "MONTHLY") {
        updateData.monthlyStreak = { increment: 1 };
      }

      const task = await db.task.update({
        where: {
          id: taskId,
          userId: userId,
        },
        data: updateData,
        include: {
          category: true,
        },
      });

      console.log(`Task ${taskId} marked as completed`);
      return task;
    } catch (error) {
      console.error(`Failed to complete task ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Marks a task as incomplete
   *
   * @param taskId - The ID of the task to mark as incomplete
   * @param userId - The user ID who owns the task
   * @returns The updated task
   */
  async uncompleteTask(taskId: string, userId: string) {
    try {
      console.log(`Marking task ${taskId} as incomplete for user ${userId}`);

      // First, get the current task to check its frequency
      const currentTask = await db.task.findUnique({
        where: {
          id: taskId,
          userId: userId,
        },
      });

      if (!currentTask) {
        throw new Error(`Task ${taskId} not found`);
      }

      // Prepare the update data based on the frequency
      const updateData: any = {
        completed: false,
      };

      // For daily tasks, also update isCompletedToday
      if (currentTask.frequency === "DAILY") {
        updateData.isCompletedToday = false;

        // Only decrement streak if it's greater than 0
        if (currentTask.dailyStreak > 0) {
          updateData.dailyStreak = currentTask.dailyStreak - 1;
        }
      } else if (
        currentTask.frequency === "WEEKLY" &&
        currentTask.weeklyStreak > 0
      ) {
        updateData.weeklyStreak = currentTask.weeklyStreak - 1;
      } else if (
        currentTask.frequency === "MONTHLY" &&
        currentTask.monthlyStreak > 0
      ) {
        updateData.monthlyStreak = currentTask.monthlyStreak - 1;
      }

      const task = await db.task.update({
        where: {
          id: taskId,
          userId: userId,
        },
        data: updateData,
        include: {
          category: true,
        },
      });

      console.log(`Task ${taskId} marked as incomplete`);
      return task;
    } catch (error) {
      console.error(`Failed to mark task ${taskId} as incomplete:`, error);
      throw error;
    }
  }

  /**
   * Get tasks that are associated with a specific routine
   * @param routineId Routine ID
   * @param userId User ID for authorization check
   * @returns Array of tasks in the routine
   */
  async getTasksByRoutineId(routineId: string, userId: string) {
    try {
      console.log(`Fetching tasks for routine ${routineId} and user ${userId}`);

      const routine = await db.routine.findUnique({
        where: {
          id: routineId,
          userId,
        },
        include: {
          tasks: {
            include: {
              category: true,
            },
          },
        },
      });

      return routine?.tasks || [];
    } catch (error) {
      console.error(`Error fetching tasks for routine ${routineId}:`, error);
      throw error;
    }
  }

  /**
   * Reset daily completion flag for all tasks
   * Used by the cron service for daily resets
   */
  async resetDailyTasks() {
    try {
      console.log("Resetting daily completion status for all tasks");

      const result = await db.task.updateMany({
        where: {
          isCompletedToday: true,
        },
        data: {
          isCompletedToday: false,
        },
      });

      console.log(`Reset ${result.count} tasks`);
      return result;
    } catch (error) {
      console.error("Error resetting daily tasks:", error);
      throw error;
    }
  }
}

export const taskService = new TaskService();
// Re-export the schema for use in API routes
export { TaskSchema };
