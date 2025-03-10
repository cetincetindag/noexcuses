import { NextRequest, NextResponse } from "next/server";
import { taskService } from "~/services/task"; // Assuming you have a task service to handle task fetching

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("user-id"); // Get user ID from headers or query
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const tasks = await taskService.getTasksByUserId(userId); // Fetch tasks for the user
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
