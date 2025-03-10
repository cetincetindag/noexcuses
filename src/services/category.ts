import { db } from "~/server/db";
import { z } from "zod";

// Schema for category validation
export const CategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
  icon: z.string().min(1, "Icon is required"),
  priority: z.number().int().positive(),
  order: z.number().int().positive(),
});

export type CategoryType = z.infer<typeof CategorySchema>;

class CategoryService {
  async createCategory(clerkId: string, categoryData: CategoryType) {
    try {
      console.log(`Creating category for user with clerkId: ${clerkId}`);

      // Create the category and connect it to the user by clerkId
      const category = await db.category.create({
        data: {
          name: categoryData.name,
          color: categoryData.color,
          icon: categoryData.icon,
          priority: categoryData.priority,
          order: categoryData.order,
          user: {
            connect: {
              clerkId: clerkId,
            },
          },
        },
      });

      console.log(`Category created successfully: ${category.id}`);
      return category;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  async getCategoryById(categoryId: string, clerkId: string) {
    try {
      console.log(`Fetching category ${categoryId} for user ${clerkId}`);

      return await db.category.findUnique({
        where: {
          id: categoryId,
          userId: clerkId,
        },
      });
    } catch (error) {
      console.error(`Failed to get category ${categoryId}:`, error);
      throw error;
    }
  }

  async updateCategory(
    categoryId: string,
    data: Partial<CategoryType>,
    clerkId: string,
  ) {
    try {
      console.log(`Updating category ${categoryId} for user ${clerkId}`);

      const validatedData = CategorySchema.partial().parse(data);
      const updatedCategory = await db.category.update({
        where: {
          id: categoryId,
          userId: clerkId,
        },
        data: validatedData,
      });

      console.log(`Category updated successfully: ${categoryId}`);
      return updatedCategory;
    } catch (error) {
      console.error(`Failed to update category ${categoryId}:`, error);
      throw error;
    }
  }

  async deleteCategory(categoryId: string, clerkId: string) {
    try {
      console.log(`Deleting category ${categoryId} for user ${clerkId}`);

      // Check if the category is in use by any tasks or goals
      const tasksUsingCategory = await db.task.count({
        where: {
          categoryId: categoryId,
          userId: clerkId,
        },
      });

      const goalsUsingCategory = await db.goal.count({
        where: {
          categoryId: categoryId,
          userId: clerkId,
        },
      });

      // If the category is in use, throw an error
      if (tasksUsingCategory > 0 || goalsUsingCategory > 0) {
        console.log(`Cannot delete category ${categoryId} as it is in use`);
        throw new Error(
          "Cannot delete category that is in use by tasks or goals",
        );
      }

      // Delete the category
      await db.category.delete({
        where: {
          id: categoryId,
          userId: clerkId,
        },
      });

      console.log(`Category deleted successfully: ${categoryId}`);
    } catch (error) {
      console.error(`Failed to delete category ${categoryId}:`, error);
      throw error;
    }
  }

  async getCategoriesByUserId(clerkId: string) {
    try {
      console.log(`Fetching categories for user with clerkId: ${clerkId}`);

      const userWithCategories = await db.user.findUnique({
        where: { clerkId: clerkId },
        select: { categories: true },
      });

      return userWithCategories?.categories || [];
    } catch (error) {
      console.error(`Failed to get categories for clerkId ${clerkId}:`, error);
      throw error;
    }
  }

  async checkCategoryInUse(categoryId: string, clerkId: string) {
    try {
      // Count tasks and goals using this category
      const tasksCount = await db.task.count({
        where: {
          categoryId: categoryId,
          userId: clerkId,
        },
      });

      const goalsCount = await db.goal.count({
        where: {
          categoryId: categoryId,
          userId: clerkId,
        },
      });

      return {
        inUse: tasksCount > 0 || goalsCount > 0,
        tasksCount,
        goalsCount,
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

export const categoryService = new CategoryService();
