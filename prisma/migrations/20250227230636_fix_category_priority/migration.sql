/*
  Warnings:

  - Made the column `order` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Goal" ALTER COLUMN "priority" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "priority" SET DEFAULT 0,
ALTER COLUMN "order" SET NOT NULL;
