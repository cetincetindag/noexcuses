import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update the user's tutorialComplete status
    const updatedUser = await db.user.update({
      where: { clerkId: userId },
      data: { tutorialComplete: true },
    });

    return NextResponse.json({
      success: true,
      message: "Tutorial marked as complete",
    });
  } catch (error) {
    console.error("Error marking tutorial as complete:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
