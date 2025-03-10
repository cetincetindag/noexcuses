import { NextRequest, NextResponse } from "next/server";
import { analyticsService } from "~/services/analytics";

export async function POST(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get("authorization");

    // Check if the token is valid
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Reset weekly analytics for all users
    const result = await analyticsService.resetWeeklyAnalytics();

    return NextResponse.json({
      success: true,
      message: "Weekly analytics reset successfully",
      details: result,
    });
  } catch (error) {
    console.error("Error resetting weekly analytics:", error);
    return NextResponse.json(
      { error: "Failed to reset weekly analytics" },
      { status: 500 },
    );
  }
}
