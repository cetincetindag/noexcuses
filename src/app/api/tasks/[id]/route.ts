import { NextRequest, NextResponse } from "next/server";
import { taskService } from "~/services/task";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { TaskSchema, TaskType } from "~/types/task";

// GET /api/tasks/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Get authenticated user's ID using Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskId = params.id;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 },
      );
    }

    // Fetch task by ID and user ID
    const task = await taskService.getTaskById(taskId, userId);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 },
    );
  }
}

// PATCH /api/tasks/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Get authenticated user's ID using Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskId = params.id;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 },
      );
    }

    // Parse the request body
    const body = await request.json();

    try {
      // Validate the data using the partial TaskSchema
      TaskSchema.partial().parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: "Validation error",
            details: validationError.errors.map((err) => ({
              path: err.path.join("."),
              message: err.message,
            })),
          },
          { status: 400 },
        );
      }
    }

    // Update the task
    const updatedTask = await taskService.updateTask(
      taskId,
      body as Partial<TaskType>,
      userId,
    );

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 },
    );
  }
}

// DELETE /api/tasks/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Get authenticated user's ID using Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskId = params.id;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 },
      );
    }

    // Delete the task
    await taskService.deleteTask(taskId, userId);

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 },
    );
  }
}

// POST /api/tasks/[id]/complete
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Get authenticated user's ID using Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskId = params.id;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 },
      );
    }

    let updatedTask;

    // Handle different actions
    if (action === "complete") {
      updatedTask = await taskService.completeTask(taskId, userId);
    } else if (action === "uncomplete") {
      updatedTask = await taskService.uncompleteTask(taskId, userId);
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'complete' or 'uncomplete'." },
        { status: 400 },
      );
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task completion status:", error);
    return NextResponse.json(
      { error: "Failed to update task completion status" },
      { status: 500 },
    );
  }
}
