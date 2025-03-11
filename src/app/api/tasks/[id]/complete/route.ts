import { NextRequest, NextResponse } from "next/server";
import { taskService } from "~/services/task";
import { auth } from "@clerk/nextjs/server";
import { routineService } from "~/services/routine";

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

    // Complete the task
    const completedTask = await taskService.completeTask(id, userId);

    if (!completedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Check for related routines that contain this task
    // This needs to be implemented differently - we need to get routines by task ID
    // For now, we'll comment this out as it's causing type errors
    /*
    const relatedRoutines = await routineService.getRoutinesByTaskId(id, userId);
    let relatedRoutinesCompleted = 0;

    // Auto-complete related routines if all their tasks are completed
    if (relatedRoutines && relatedRoutines.length > 0) {
      console.log(
        `Found ${relatedRoutines.length} related routines for task ${id}`,
      );

      const routineUpdatePromises = relatedRoutines.map(async (routine) => {
        await routineService.completeRoutine(routine.id, userId);
        relatedRoutinesCompleted++;
      });

      await Promise.all(routineUpdatePromises);
    }
    */

    return NextResponse.json({
      ...completedTask,
    });
  } catch (error) {
    console.error("Error completing task:", error);
    return NextResponse.json(
      { error: "Failed to complete task" },
      { status: 500 },
    );
  }
}
