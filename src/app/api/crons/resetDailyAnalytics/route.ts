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

    // Reset daily analytics for all users
    const result = await analyticsService.resetDailyAnalytics();

    return NextResponse.json({
      success: true,
      message: "Daily analytics reset successfully",
      details: result,
    });
  } catch (error) {
    console.error("Error resetting daily analytics:", error);
    return NextResponse.json(
      { error: "Failed to reset daily analytics" },
      { status: 500 },
    );
  }
}
