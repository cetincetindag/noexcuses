import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

// Endpoint to manually update streaks if needed (as a backup to the scheduled cron)
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
    try {
      const today = new Date();

      // Start a transaction to ensure all updates are made or none
      await db.$transaction(async (prisma) => {
        // For daily tasks: Reset isCompletedToday to false and reset streaks for uncompleted tasks
        await prisma.task.updateMany({
          where: {
            frequency: "DAILY",
            isCompletedToday: true,
          },
          data: {
            isCompletedToday: false,
          },
        });

        // For tasks that weren't completed today, reset their daily streak
        await prisma.task.updateMany({
          where: {
            frequency: "DAILY",
            isCompletedToday: false,
            dailyStreak: { gt: 0 },
          },
          data: {
            dailyStreak: 0,
          },
        });

        // For weekly tasks: Check if it's the start of a new week (Monday)
        if (today.getDay() === 1) {
          // Monday is 1
          // Reset weekly tasks and update streaks
          await prisma.task.updateMany({
            where: {
              frequency: "WEEKLY",
              completed: true,
            },
            data: {
              completed: false,
              weeklyStreak: { increment: 1 },
            },
          });

          // Reset streaks for uncompleted weekly tasks
          await prisma.task.updateMany({
            where: {
              frequency: "WEEKLY",
              completed: false,
            },
            data: {
              weeklyStreak: 0,
            },
          });
        }

        // For monthly tasks: Check if it's the first day of the month
        if (today.getDate() === 1) {
          // Reset monthly tasks and update streaks
          await prisma.task.updateMany({
            where: {
              frequency: "MONTHLY",
              completed: true,
            },
            data: {
              completed: false,
              monthlyStreak: { increment: 1 },
            },
          });

          // Reset streaks for uncompleted monthly tasks
          await prisma.task.updateMany({
            where: {
              frequency: "MONTHLY",
              completed: false,
            },
            data: {
              monthlyStreak: 0,
            },
          });
        }

        // Also handle Goals the same way
        // For daily goals
        await prisma.goal.updateMany({
          where: {
            frequency: "DAILY",
            isCompletedToday: true,
          },
          data: {
            isCompletedToday: false,
          },
        });

        await prisma.goal.updateMany({
          where: {
            frequency: "DAILY",
            isCompletedToday: false,
            dailyStreak: { gt: 0 },
          },
          data: {
            dailyStreak: 0,
          },
        });

        // For weekly goals
        if (today.getDay() === 1) {
          await prisma.goal.updateMany({
            where: {
              frequency: "WEEKLY",
              completed: true,
            },
            data: {
              completed: false,
              weeklyStreak: { increment: 1 },
            },
          });

          await prisma.goal.updateMany({
            where: {
              frequency: "WEEKLY",
              completed: false,
            },
            data: {
              weeklyStreak: 0,
            },
          });
        }

        // For monthly goals
        if (today.getDate() === 1) {
          await prisma.goal.updateMany({
            where: {
              frequency: "MONTHLY",
              completed: true,
            },
            data: {
              completed: false,
              monthlyStreak: { increment: 1 },
            },
          });

          await prisma.goal.updateMany({
            where: {
              frequency: "MONTHLY",
              completed: false,
            },
            data: {
              monthlyStreak: 0,
            },
          });
        }
      });

      return NextResponse.json({
        success: true,
        message: "Streaks updated successfully",
      });
    } catch (error) {
      console.error("Error updating streaks:", error);
      return NextResponse.json(
        { success: false, message: "Failed to update streaks" },
        { status: 500 },
      );
    }
  } else {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }
}
