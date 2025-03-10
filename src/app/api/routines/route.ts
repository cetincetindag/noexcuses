import { NextRequest, NextResponse } from "next/server";
import { routineService } from "~/services/routine";
import { auth } from "@clerk/nextjs/server";
import { RoutineSchema } from "~/services/routine";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user's ID using Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch routines using the clerk ID
    const routines = await routineService.getRoutinesByUserId(userId);

    return NextResponse.json(routines);
  } catch (error) {
    console.error("Error fetching routines:", error);
    return NextResponse.json(
      { error: "Failed to fetch routines" },
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

    // Add the userId (Clerk ID) to the routine data
    const routineData = {
      ...body,
      userId: userId,
    };

    try {
      // Validate the data using the RoutineSchema
      RoutineSchema.parse(routineData);
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

    // Create the routine
    const newRoutine = await routineService.createRoutine(routineData);

    return NextResponse.json(newRoutine, { status: 201 });
  } catch (error) {
    console.error("Error creating routine:", error);
    return NextResponse.json(
      { error: "Failed to create routine" },
      { status: 500 },
    );
  }
}
