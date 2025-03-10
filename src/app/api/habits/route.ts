import { NextRequest, NextResponse } from "next/server";
import { habitService } from "~/services/habit";
import { auth } from "@clerk/nextjs/server";
import { HabitSchema } from "~/services/habit";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user's ID using Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch habits using the clerk ID
    const habits = await habitService.getHabitsByUserId(userId);

    return NextResponse.json(habits);
  } catch (error) {
    console.error("Error fetching habits:", error);
    return NextResponse.json(
      { error: "Failed to fetch habits" },
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

    // Add the userId (Clerk ID) to the habit data
    const habitData = {
      ...body,
      userId: userId,
    };

    try {
      // Validate the data using the HabitSchema
      HabitSchema.parse(habitData);
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

    // Create the habit
    const newHabit = await habitService.createHabit(habitData);

    return NextResponse.json(newHabit, { status: 201 });
  } catch (error) {
    console.error("Error creating habit:", error);
    return NextResponse.json(
      { error: "Failed to create habit" },
      { status: 500 },
    );
  }
}
