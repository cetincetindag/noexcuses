import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's tutorialComplete status
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { tutorialComplete: true, lastLogin: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If this is the first login or tutorialComplete is false, show the tutorial
    const showTutorial = !user.tutorialComplete;

    return NextResponse.json({
      showTutorial,
      tutorialComplete: user.tutorialComplete,
    });
  } catch (error) {
    console.error("Error checking tutorial status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
