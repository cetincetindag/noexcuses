import { NextRequest, NextResponse } from "next/server";
import { taskService } from "~/services/task";
import { auth } from "@clerk/nextjs/server";
import { TaskSchema } from "~/types/task";
import { z } from "zod";

// This route handles requests to /api/tasks by forwarding to the same
// logic as /api/tasks/index

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user's ID using Clerk
    const { userId } = await auth();

    console.log(
      `API /tasks: Auth check completed, userId: ${userId ? "present" : "missing"}`,
    );

    if (!userId) {
      console.warn("API /tasks: No authenticated user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch tasks using the clerk ID
    console.log(`API /tasks: Attempting to fetch tasks for user ${userId}`);
    const tasks = await taskService.getTasksByUserId(userId);

    console.log(
      `API /tasks: Fetched ${tasks.length} tasks from database for user ${userId}`,
    );

    // Add logging to help debug
    if (tasks.length > 0) {
      console.log("API /tasks: Sample task from database:", {
        id: tasks[0]?.id || "unknown",
        title: tasks[0]?.title || "unknown",
        frequency: tasks[0]?.frequency || "unknown",
        frequency_type: tasks[0]?.frequency
          ? typeof tasks[0].frequency
          : "unknown",
      });
    } else {
      console.log("API /tasks: No tasks found for this user");
    }

    // Transform tasks to ensure consistent frequency format for the frontend
    const transformedTasks = tasks.map((task) => {
      // Ensure frequency is a lowercase string
      let frequency = "once"; // Default value
      if (task.frequency) {
        frequency = String(task.frequency).toLowerCase();
      }

      return {
        ...task,
        frequency,
      };
    });

    if (transformedTasks.length > 0) {
      console.log("API /tasks: Transformed sample task:", {
        id: transformedTasks[0]?.id || "unknown",
        title: transformedTasks[0]?.title || "unknown",
        frequency: transformedTasks[0]?.frequency || "unknown",
        frequency_type: transformedTasks[0]?.frequency
          ? typeof transformedTasks[0].frequency
          : "unknown",
      });
    }

    // Always return an array, even if empty
    return NextResponse.json(transformedTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user's ID using Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    console.log(
      "Received task creation request:",
      JSON.stringify(body, null, 2),
    );

    // Add the userId (Clerk ID) to the task data
    const taskData = {
      ...body,
      userId: userId,
    };

    console.log(
      "Processed task data (with userId):",
      JSON.stringify(taskData, null, 2),
    );

    // Validate the data using the TaskSchema
    try {
      // Log the data types for debugging
      console.log("Data types before validation:", {
        dueDate: taskData.dueDate ? typeof taskData.dueDate : "undefined",
        lastCompletedAt: taskData.lastCompletedAt
          ? typeof taskData.lastCompletedAt
          : "undefined",
      });

      const validatedData = TaskSchema.parse(taskData);

      console.log(
        "Data after validation:",
        JSON.stringify(validatedData, null, 2),
      );
    } catch (validationError) {
      console.error("Validation error:", validationError);

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

      return NextResponse.json(
        { error: "Data validation failed", details: String(validationError) },
        { status: 400 },
      );
    }

    // Create the task
    try {
      const newTask = await taskService.createTask(taskData);
      console.log("Task created successfully:", newTask);
      return NextResponse.json(newTask, { status: 201 });
    } catch (dbError) {
      console.error("Database error creating task:", dbError);
      return NextResponse.json(
        {
          error: "Failed to create task in database",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Unexpected error creating task:", error);
    return NextResponse.json(
      {
        error: "Failed to create task",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
