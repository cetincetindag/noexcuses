import { db } from "~/server/db";
import { UserSchema, UserType } from "../types/user";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { defaultCategories, Category } from "../lib/utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UserService {
  async getCurrentUser() {
    try {
      const { userId } = await auth();

      if (!userId) {
        return null; // No authenticated user
      }
      // Just get the existing user from your database
      const user = await db.user.findUnique({
        where: { clerkId: userId },
      });

      return user; // This will be null if user doesn't exist in your DB
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  async checkUsernameExists(username: string) {
    try {
      const existingUser = await db.user.findUnique({
        where: { username },
      });
      return !!existingUser;
    } catch (error) {
      console.error("Error checking username exists:", error);
      return false;
    }
  }

  async returnUsername(clerkId: string) {
    try {
      const user = await db.user.findUniqueOrThrow({
        where: { clerkId },
        select: { username: true },
      });
      return user.username;
    } catch (error) {
      console.error("Error returning username:", error);
      return null;
    }
  }

  async createUser(data: UserType) {
    try {
      const validatedData = UserSchema.parse(data);
      const user = await db.user.create({
        data: validatedData,
      });
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async deleteUser(clerkId: string) {
    try {
      // First, find the user to ensure they exist
      const user = await db.user.findUnique({
        where: { clerkId },
      });

      if (!user) {
        console.error(`User with clerkId ${clerkId} not found`);
        return;
      }

      // Start a transaction to ensure data consistency
      await prisma.$transaction(async (tx) => {
        // Delete tasks related to this user
        await tx.task.deleteMany({
          where: { userId: clerkId },
        });

        // Delete goals related to this user
        await tx.goal.deleteMany({
          where: { userId: clerkId },
        });

        // Delete categories related to this user
        await tx.category.deleteMany({
          where: { userId: clerkId },
        });

        // Finally, delete the user
        await tx.user.delete({
          where: { clerkId },
        });
      });

      console.log(
        `Successfully deleted user with clerkId ${clerkId} and all related data`,
      );
    } catch (e) {
      console.error("Failed to delete user: ", e);
      throw e; // Re-throw the error to be handled by the caller
    }
  }

  async updateUser(clerkId: string, data: Object) {
    try {
      const validatedData = UserSchema.partial().parse(data);
      await db.user.update({
        where: { clerkId },
        data: validatedData,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async getTasksOfUser(clerkId: string) {
    try {
      return db.user.findUnique({
        where: { clerkId },
        select: { tasks: true },
      });
    } catch (error) {
      console.error("Error getting tasks of user:", error);
      throw error;
    }
  }

  async getGoalsOfUser(clerkId: string) {
    try {
      return db.user.findUnique({
        where: { clerkId },
        select: { goals: true },
      });
    } catch (error) {
      console.error("Error getting goals of user:", error);
      throw error;
    }
  }

  async getCategoriesOfUser(clerkId: string) {
    try {
      return db.user.findUnique({
        where: { clerkId },
        select: { categories: true },
      });
    } catch (error) {
      console.error("Error getting categories of user:", error);
      throw error;
    }
  }

  async createCategory(clerkId: string, categoryData: Omit<Category, "id">) {
    try {
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

      return category;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  async getUserById(clerkId: string) {
    try {
      return await db.user.findUnique({ where: { clerkId } });
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw error;
    }
  }

  async createUserWithDefaultCategories(userData: UserType) {
    try {
      // Check if the user already exists
      const existingUser = await db.user.findUnique({
        where: { clerkId: userData.clerkId },
      });

      if (!existingUser) {
        // First create the user
        const user = await db.user.create({
          data: userData,
        });

        // Then create default categories for this user
        const categoryPromises = defaultCategories.map((category: Category) => {
          return db.category.create({
            data: {
              ...category,
              userId: user.clerkId,
            },
          });
        });

        await Promise.all(categoryPromises);

        return user;
      }
    } catch (error) {
      console.error("Error creating user with default categories:", error);
      throw error;
    }
  }

  async updateUserLoginTimestamp(clerkId: string) {
    try {
      await db.user.update({
        where: { clerkId: clerkId },
        data: { lastLogin: new Date() }, // Assuming you have a lastLogin field
      });
    } catch (error) {
      console.error("Error updating user login timestamp:", error);
      throw error;
    }
  }

  async logUserSignIn(userId: string) {
    // Implement your analytics tracking logic here
    console.log(`User ${userId} signed in.`);
  }
}

export const userService = new UserService();
