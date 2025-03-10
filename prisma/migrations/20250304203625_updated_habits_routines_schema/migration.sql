/*
  Warnings:

  - You are about to drop the column `streak` on the `Habit` table. All the data in the column will be lost.
  - You are about to drop the column `timesPerDay` on the `Habit` table. All the data in the column will be lost.
  - You are about to drop the column `completedCount` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `habitId` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `repeatConfig` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `taskId` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `timesPerPeriod` on the `Routine` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_habitId_fkey";

-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_taskId_fkey";

-- DropIndex
DROP INDEX "Routine_habitId_idx";

-- DropIndex
DROP INDEX "Routine_taskId_idx";

-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "streak",
DROP COLUMN "timesPerDay",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "dailyStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isCompletedToday" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "targetCompletions" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Routine" DROP COLUMN "completedCount",
DROP COLUMN "habitId",
DROP COLUMN "repeatConfig",
DROP COLUMN "taskId",
DROP COLUMN "timesPerPeriod",
ADD COLUMN     "color" TEXT,
ADD COLUMN     "isCompletedToday" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_HabitToRoutine" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_HabitToRoutine_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_RoutineToTask" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RoutineToTask_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_HabitToRoutine_B_index" ON "_HabitToRoutine"("B");

-- CreateIndex
CREATE INDEX "_RoutineToTask_B_index" ON "_RoutineToTask"("B");

-- AddForeignKey
ALTER TABLE "_HabitToRoutine" ADD CONSTRAINT "_HabitToRoutine_A_fkey" FOREIGN KEY ("A") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HabitToRoutine" ADD CONSTRAINT "_HabitToRoutine_B_fkey" FOREIGN KEY ("B") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoutineToTask" ADD CONSTRAINT "_RoutineToTask_A_fkey" FOREIGN KEY ("A") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoutineToTask" ADD CONSTRAINT "_RoutineToTask_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
