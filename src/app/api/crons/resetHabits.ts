import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

// Daily cron job to reset tasks and goals completion status
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
    try {
      const today = new Date();

      // Start a transaction to ensure all updates are made or none
      await db.$transaction(async (prisma) => {
        // For daily tasks: Reset isCompletedToday to false and reset streaks for uncompleted tasks
        // Updated completed tasks: increment streak, keep isCompletedToday=true
        await prisma.task.updateMany({
          where: {
            frequency: "DAILY",
            isCompletedToday: true,
          } as any,
          data: {
            isCompletedToday: false,
            // Keep dailyStreak as is for completed tasks
          } as any,
        });

        // For tasks that weren't completed today, reset their daily streak
        await prisma.task.updateMany({
          where: {
            frequency: "DAILY",
            isCompletedToday: false,
            dailyStreak: { gt: 0 }, // Only reset if they had a streak going
          } as any,
          data: {
            dailyStreak: 0,
          } as any,
        });

        // For weekly tasks: Check if it's the start of a new week (Monday)
        if (today.getDay() === 1) {
          // Monday is 1
          // Reset weekly tasks and update streaks
          await prisma.task.updateMany({
            where: {
              frequency: "WEEKLY",
              completed: true,
            } as any,
            data: {
              completed: false,
              weeklyStreak: { increment: 1 },
            } as any,
          });

          // Reset streaks for uncompleted weekly tasks
          await prisma.task.updateMany({
            where: {
              frequency: "WEEKLY",
              completed: false,
            } as any,
            data: {
              weeklyStreak: 0,
            } as any,
          });
        }

        // For monthly tasks: Check if it's the first day of the month
        if (today.getDate() === 1) {
          // Reset monthly tasks and update streaks
          await prisma.task.updateMany({
            where: {
              frequency: "MONTHLY",
              completed: true,
            } as any,
            data: {
              completed: false,
              monthlyStreak: { increment: 1 },
            } as any,
          });

          // Reset streaks for uncompleted monthly tasks
          await prisma.task.updateMany({
            where: {
              frequency: "MONTHLY",
              completed: false,
            } as any,
            data: {
              monthlyStreak: 0,
            } as any,
          });
        }

        // Also handle Goals the same way
        // For daily goals
        await prisma.goal.updateMany({
          where: {
            frequency: "DAILY",
            isCompletedToday: true,
          } as any,
          data: {
            isCompletedToday: false,
          } as any,
        });

        await prisma.goal.updateMany({
          where: {
            frequency: "DAILY",
            isCompletedToday: false,
            dailyStreak: { gt: 0 },
          } as any,
          data: {
            dailyStreak: 0,
          } as any,
        });

        // For weekly goals
        if (today.getDay() === 1) {
          await prisma.goal.updateMany({
            where: {
              frequency: "WEEKLY",
              completed: true,
            } as any,
            data: {
              completed: false,
              weeklyStreak: { increment: 1 },
            } as any,
          });

          await prisma.goal.updateMany({
            where: {
              frequency: "WEEKLY",
              completed: false,
            } as any,
            data: {
              weeklyStreak: 0,
            } as any,
          });
        }

        // For monthly goals
        if (today.getDate() === 1) {
          await prisma.goal.updateMany({
            where: {
              frequency: "MONTHLY",
              completed: true,
            } as any,
            data: {
              completed: false,
              monthlyStreak: { increment: 1 },
            } as any,
          });

          await prisma.goal.updateMany({
            where: {
              frequency: "MONTHLY",
              completed: false,
            } as any,
            data: {
              monthlyStreak: 0,
            } as any,
          });
        }
      });

      return NextResponse.json({
        success: true,
        message: "Tasks and goals reset successfully",
      });
    } catch (error) {
      console.error("Error resetting tasks and goals:", error);
      return NextResponse.json(
        { success: false, message: "Failed to reset tasks and goals" },
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
