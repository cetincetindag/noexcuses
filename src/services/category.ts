import { db } from "~/server/db";
import { CategoryType, CategorySchema } from "../types/category";

class CategoryService {
  async createCategory(userId: string, categoryData: CategoryType) {
    try {
      console.log(`Creating category for user with userId: ${userId}`);

      // Create the category and connect it to the user by userId
      const category = await db.category.create({
        data: {
          name: categoryData.name,
          color: categoryData.color,
          icon: categoryData.icon,
          priority: categoryData.priority,
          order: categoryData.order,
          user: {
            connect: {
              clerkId: userId,
            },
          },
        },
      });

      console.log(`Created category: ${category.id}`);
      return category;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  /**
   * Get a category by ID
   * @param categoryId Category ID
   * @param userId User ID for authorization check
   * @returns Category if found and belongs to user
   */
  async getCategoryById(categoryId: string, userId: string) {
    try {
      console.log(`Fetching category ${categoryId} for user ${userId}`);

      return await db.category.findUnique({
        where: {
          id: categoryId,
          userId: userId,
        },
      });
    } catch (error) {
      console.error(`Error fetching category ${categoryId}:`, error);
      throw error;
    }
  }

  /**
   * Update a category
   * @param categoryId Category ID
   * @param data Category data to update
   * @param userId User ID for authorization check
   * @returns Updated category
   */
  async updateCategory(
    categoryId: string,
    data: Partial<CategoryType>,
    userId: string,
  ) {
    try {
      console.log(`Updating category ${categoryId} for user ${userId}`);

      // Check if category exists and belongs to user
      const existingCategory = await this.getCategoryById(categoryId, userId);
      if (!existingCategory) {
        throw new Error(
          `Category with ID ${categoryId} not found or doesn't belong to user`,
        );
      }

      return await db.category.update({
        where: {
          id: categoryId,
          userId: userId,
        },
        data,
      });
    } catch (error) {
      console.error(`Error updating category ${categoryId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a category
   * @param categoryId Category ID
   * @param clerkId User ID
   * @returns Deleted category
   */
  async deleteCategory(categoryId: string, clerkId: string) {
    try {
      // Check if category is in use
      const inUse = await this.checkCategoryInUse(categoryId, clerkId);
      if (inUse) {
        throw new Error(
          "Cannot delete category that is in use by tasks, habits, or routines",
        );
      }

      // Delete the category
      return await db.category.delete({
        where: {
          id: categoryId,
          userId: clerkId,
        },
      });
    } catch (error) {
      console.error(`Failed to delete category ${categoryId}:`, error);
      throw error;
    }
  }

  /**
   * Get all categories for a user
   * @param userId User ID
   * @returns Array of categories
   */
  async getCategoriesByUserId(userId: string) {
    try {
      console.log(`Fetching categories for user ${userId}`);

      return await db.category.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          order: "asc",
        },
      });
    } catch (error) {
      console.error(`Error fetching categories for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Check if a category is in use by any tasks, habits, or routines
   * @param categoryId Category ID
   * @param clerkId User ID
   * @returns Object with inUse, tasksCount, habitsCount, and routinesCount properties
   */
  async checkCategoryInUse(categoryId: string, clerkId: string) {
    try {
      // Count tasks using this category
      const taskCount = await db.task.count({
        where: {
          categoryId,
          userId: clerkId,
        },
      });

      // Count habits using this category
      const habitCount = await db.habit.count({
        where: {
          categoryId,
          userId: clerkId,
        },
      });

      // Count routines using this category
      const routineCount = await db.routine.count({
        where: {
          categoryId,
          userId: clerkId,
        },
      });

      return {
        inUse: taskCount > 0 || habitCount > 0 || routineCount > 0,
        tasksCount: taskCount,
        habitsCount: habitCount,
        routinesCount: routineCount,
      };
    } catch (error) {
      console.error(
        `Failed to check if category ${categoryId} is in use:`,
        error,
      );
      throw error;
    }
  }
}

// Export a singleton instance
export const categoryService = new CategoryService();

// Re-export the schema from types
export { CategorySchema };
