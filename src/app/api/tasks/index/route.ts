import { NextRequest, NextResponse } from "next/server";
import { taskService } from "~/services/task";
import { auth } from "@clerk/nextjs/server";
import { TaskSchema } from "~/types/task";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user's ID using Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch tasks using the clerk ID
    const tasks = await taskService.getTasksByUserId(userId);

    console.log("Tasks fetched for board view:", tasks.length);

    // Log a sample task for debugging if available
    if (tasks.length > 0 && tasks[0]) {
      const sampleTask = tasks[0];
      console.log("Sample task from DB:", {
        id: sampleTask?.id,
        title: sampleTask?.title,
        frequency: sampleTask?.frequency,
        frequency_type: typeof sampleTask?.frequency,
      });
    }

    // Transform frequency to lowercase to match frontend expectations
    const transformedTasks = tasks.map((task) => {
      // Ensure every task has a frequency value as a lowercase string
      let frequencyValue = "once"; // Default to 'once' if missing

      if (task.frequency) {
        if (typeof task.frequency === "string") {
          frequencyValue = task.frequency.toLowerCase();
        } else {
          frequencyValue = String(task.frequency).toLowerCase();
        }
      }

      return {
        ...task,
        frequency: frequencyValue,
      };
    });

    console.log("Returning transformed tasks for board view");

    if (transformedTasks.length > 0 && transformedTasks[0]) {
      const sampleTransformed = transformedTasks[0];
      console.log("Sample transformed task:", {
        id: sampleTransformed?.id,
        title: sampleTransformed?.title,
        frequency: sampleTransformed?.frequency,
        frequency_type: typeof sampleTransformed?.frequency,
      });
    }

    return NextResponse.json(transformedTasks);
  } catch (error) {
    console.error("Error fetching tasks for board view:", error);
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
    const body = await request.json();

    // Add the userId (Clerk ID) to the task data
    const taskData = {
      ...body,
      userId: userId,
    };

    try {
      // Validate the data using the TaskSchema
      TaskSchema.parse(taskData);
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

    // Create the task
    const newTask = await taskService.createTask(taskData);
    console.log("Task created successfully:", newTask);

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 },
    );
  }
}
