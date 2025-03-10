import { NextRequest, NextResponse } from "next/server";
import { taskService } from "../../../../../services/task";
import { auth } from "@clerk/nextjs/server";
import { goalService } from "../../../../../services/goal";

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    // Await the entire context.params before destructuring
    const params = await Promise.resolve(context.params);
    const id = params.id;

    // Get authenticated user's ID using Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Uncomplete the task
    const updatedTask = await taskService.uncompleteTask(id, userId);

    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Check for completed goals related to this task
    const completedGoals = await goalService.getCompletedGoalsByTaskId(
      id,
      userId,
    );
    let restoredGoalsCount = 0;

    // Restore completed goals if needed
    if (completedGoals && completedGoals.length > 0) {
      console.log(
        `Found ${completedGoals.length} completed goals for task ${id} to restore`,
      );

      const goalUpdatePromises = completedGoals.map(async (goal) => {
        await goalService.uncompleteGoal(goal.id, userId);
        restoredGoalsCount++;
      });

      await Promise.all(goalUpdatePromises);
    }

    return NextResponse.json({
      ...updatedTask,
      restoredGoalsCount,
    });
  } catch (error) {
    console.error("Error marking task as incomplete:", error);
    return NextResponse.json(
      { error: "Failed to mark task as incomplete" },
      { status: 500 },
    );
  }
}
