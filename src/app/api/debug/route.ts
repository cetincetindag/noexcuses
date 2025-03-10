import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user's ID using Clerk
    const { userId } = await auth();

    console.log(
      `Debug API: Auth check completed, userId: ${userId ? "present" : "missing"}`,
    );

    if (!userId) {
      console.warn("Debug API: No authenticated user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all data to diagnose the issue
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        tasks: {
          include: {
            category: true,
          },
        },
        goals: {
          include: {
            category: true,
            task: true,
          },
        },
        categories: true,
      },
    });

    if (!user) {
      console.warn(
        `Debug API: User with clerkId ${userId} not found in database`,
      );
      return NextResponse.json(
        {
          error: "User not found in database",
          diagnostics: {
            clerkIdProvided: userId,
            userExists: false,
          },
        },
        { status: 404 },
      );
    }

    // Count raw tasks in database for this user
    const rawTaskCount = await db.task.count({
      where: { userId },
    });

    // Count categories for this user
    const categoriesCount = await db.category.count({
      where: { userId },
    });

    console.log(
      `Debug API: User ${userId} has ${rawTaskCount} tasks and ${categoriesCount} categories`,
    );

    return NextResponse.json({
      userData: {
        clerkId: user.clerkId,
        databaseId: user.databaseId,
        username: user.username,
        createdAt: user.createdAt,
      },
      diagnostics: {
        rawTaskCount,
        tasksFromRelation: user.tasks.length,
        goalsCount: user.goals.length,
        categoriesCount: user.categories.length,
        auth: {
          userIdFromAuth: userId,
          userIdFromDb: user.clerkId,
          match: userId === user.clerkId,
        },
      },
      // Include raw tasks for debugging
      tasks: user.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        // Convert database frequency enum to lowercase to match frontend
        frequency: task.frequency.toLowerCase(),
        categoryId: task.categoryId,
        categoryName: task.category?.name,
        completed: task.completed,
        createdAt: task.createdAt,
      })),
      // Also raw categories
      categories: user.categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        color: cat.color,
        tasksCount: user.tasks.filter((t) => t.categoryId === cat.id).length,
      })),
    });
  } catch (error) {
    console.error("Error in debug route:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}
