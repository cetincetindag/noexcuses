import { NextRequest, NextResponse } from "next/server";
import { habitService } from "~/services/habit";

export async function POST(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get("authorization");

    // Check if the token is valid
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Reset daily habits for all users
    const result = await habitService.resetDailyHabits();

    return NextResponse.json({
      success: true,
      message: "Daily habits reset successfully",
      details: result,
    });
  } catch (error) {
    console.error("Error resetting daily habits:", error);
    return NextResponse.json(
      { error: "Failed to reset daily habits" },
      { status: 500 },
    );
  }
}
