import { NextRequest, NextResponse } from "next/server";
import { taskService } from "../../../../../services/task";
import { auth } from "@clerk/nextjs/server";
import { routineService } from "../../../../../services/routine";

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

    // Check for completed routines related to this task
    // This functionality needs to be implemented in the routine service
    // For now, we'll comment this out as it's causing type errors
    /*
    const completedRoutines = await routineService.getCompletedRoutinesByTaskId(
      id,
      userId,
    );
    let restoredRoutinesCount = 0;

    // Restore completed routines if needed
    if (completedRoutines && completedRoutines.length > 0) {
      console.log(
        `Found ${completedRoutines.length} completed routines for task ${id} to restore`,
      );

      const routineUpdatePromises = completedRoutines.map(async (routine) => {
        await routineService.uncompleteRoutine(routine.id, userId);
        restoredRoutinesCount++;
      });

      await Promise.all(routineUpdatePromises);
    }
    */

    return NextResponse.json({
      ...updatedTask,
      // restoredRoutinesCount,
    });
  } catch (error) {
    console.error("Error marking task as incomplete:", error);
    return NextResponse.json(
      { error: "Failed to mark task as incomplete" },
      { status: 500 },
    );
  }
}
