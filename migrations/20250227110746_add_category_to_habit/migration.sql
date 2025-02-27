-- CreateEnum
CREATE TYPE "HabitUnit" AS ENUM ('NONE', 'MINUTES', 'HOURS', 'TIMES', 'CUSTOM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "weightUnit" TEXT NOT NULL,
    "heightUnit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StartData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dailyWeightTraining" DOUBLE PRECISION NOT NULL,
    "dailyCardio" DOUBLE PRECISION NOT NULL,
    "dailyMeditation" DOUBLE PRECISION NOT NULL,
    "dailyWaterIntake" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "StartData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Habit" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "units" "HabitUnit" NOT NULL,
    "customUnit" TEXT NOT NULL,
    "amountRequired" INTEGER NOT NULL,
    "amountDone" INTEGER NOT NULL,
    "dailyStreak" INTEGER NOT NULL DEFAULT 0,
    "isCompletedToday" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "StartData_userId_key" ON "StartData"("userId");

-- AddForeignKey
ALTER TABLE "StartData" ADD CONSTRAINT "StartData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Habit" ADD CONSTRAINT "Habit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
