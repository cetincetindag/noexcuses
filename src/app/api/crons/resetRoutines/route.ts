import { NextRequest, NextResponse } from "next/server";
import { routineService } from "~/services/routine";

export async function POST(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get("authorization");

    // Check if the token is valid
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Reset routines based on their frequency
    const result = await routineService.resetRoutines();

    return NextResponse.json({
      success: true,
      message: "Routines reset successfully based on their frequencies",
      details: result,
    });
  } catch (error) {
    console.error("Error resetting routines:", error);
    return NextResponse.json(
      { error: "Failed to reset routines" },
      { status: 500 },
    );
  }
}
