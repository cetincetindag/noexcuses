import { NextRequest, NextResponse } from "next/server";
import { routineService } from "~/services/routine";
import { auth } from "@clerk/nextjs/server";

// Complete a routine and all its associated tasks and habits
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const routineId = params.id;

    // Check if the routine exists
    const existingRoutine = await routineService.getRoutineById(routineId);

    if (!existingRoutine) {
      return NextResponse.json({ error: "Routine not found" }, { status: 404 });
    }

    // Ensure the user owns this routine
    if (existingRoutine.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Complete the routine and associated tasks/habits
    const updatedRoutine = await routineService.completeRoutine(
      routineId,
      userId,
    );

    return NextResponse.json({
      success: true,
      routine: updatedRoutine,
    });
  } catch (error) {
    console.error(`Error completing routine with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to complete routine" },
      { status: 500 },
    );
  }
}
