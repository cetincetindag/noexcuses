import { NextRequest, NextResponse } from "next/server";
import { habitService } from "~/services/habit";
import { auth } from "@clerk/nextjs/server";
import { HabitSchema } from "~/services/habit";
import { z } from "zod";

// Get a single habit
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const habitId = params.id;
    const habit = await habitService.getHabitById(habitId, userId);

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    // Ensure the user owns this habit
    if (habit.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(habit);
  } catch (error) {
    console.error(`Error fetching habit with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch habit" },
      { status: 500 },
    );
  }
}

// Update a habit
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const habitId = params.id;

    // Check if the habit exists and belongs to the user
    const existingHabit = await habitService.getHabitById(habitId, userId);

    if (!existingHabit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    if (existingHabit.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Parse the request body
    const body = await request.json();

    // Validate the data
    try {
      // We're using partial schema validation since this is an update
      const updateSchema = HabitSchema.partial().omit({ userId: true });
      updateSchema.parse(body);
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

    // Update the habit
    const updatedHabit = await habitService.updateHabit(habitId, body);

    return NextResponse.json(updatedHabit);
  } catch (error) {
    console.error(`Error updating habit with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update habit" },
      { status: 500 },
    );
  }
}

// Delete a habit
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const habitId = params.id;

    // Check if the habit exists and belongs to the user
    const existingHabit = await habitService.getHabitById(habitId, userId);

    if (!existingHabit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    if (existingHabit.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the habit
    const deletedHabit = await habitService.deleteHabit(habitId);

    return NextResponse.json(deletedHabit);
  } catch (error) {
    console.error(`Error deleting habit with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete habit" },
      { status: 500 },
    );
  }
}
