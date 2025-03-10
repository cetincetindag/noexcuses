import { NextRequest, NextResponse } from "next/server";
import { routineService } from "~/services/routine";
import { auth } from "@clerk/nextjs/server";
import { RoutineSchema } from "~/services/routine";
import { z } from "zod";

// Get a single routine
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const routineId = params.id;
    const routine = await routineService.getRoutineById(routineId);

    if (!routine) {
      return NextResponse.json({ error: "Routine not found" }, { status: 404 });
    }

    // Ensure the user owns this routine
    if (routine.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(routine);
  } catch (error) {
    console.error(`Error fetching routine with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch routine" },
      { status: 500 },
    );
  }
}

// Update a routine
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const routineId = params.id;

    // Check if the routine exists and belongs to the user
    const existingRoutine = await routineService.getRoutineById(routineId);

    if (!existingRoutine) {
      return NextResponse.json({ error: "Routine not found" }, { status: 404 });
    }

    if (existingRoutine.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Parse the request body
    const body = await request.json();

    // Validate the data
    try {
      // We're using partial schema validation since this is an update
      const updateSchema = RoutineSchema.partial().omit({ userId: true });
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

    // Update the routine
    const updatedRoutine = await routineService.updateRoutine(routineId, body);

    return NextResponse.json(updatedRoutine);
  } catch (error) {
    console.error(`Error updating routine with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update routine" },
      { status: 500 },
    );
  }
}

// Delete a routine
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const routineId = params.id;

    // Check if the routine exists and belongs to the user
    const existingRoutine = await routineService.getRoutineById(routineId);

    if (!existingRoutine) {
      return NextResponse.json({ error: "Routine not found" }, { status: 404 });
    }

    if (existingRoutine.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the routine
    const deletedRoutine = await routineService.deleteRoutine(routineId);

    return NextResponse.json(deletedRoutine);
  } catch (error) {
    console.error(`Error deleting routine with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete routine" },
      { status: 500 },
    );
  }
}
