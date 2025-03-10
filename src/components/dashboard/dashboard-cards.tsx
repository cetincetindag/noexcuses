import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { CheckCircle2, Circle, Flame, Repeat } from "lucide-react";
import { useEffect, useState } from "react";
import type { Task, Habit, Goal, Routine } from "~/lib/utils";

interface DashboardCardsProps {
  tasks: Task[];
  habits?: Habit[];
  routines?: Routine[];
}

export function DashboardCards({
  tasks,
  habits = [],
  routines = [],
}: DashboardCardsProps) {
  // Task metrics
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const taskCompletionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Habit metrics
  const activeHabits = habits.filter((habit) => habit.active).length;
  const completedHabits = habits.filter(
    (habit) => habit.isCompletedToday,
  ).length;
  const habitCompletionPercentage =
    activeHabits > 0 ? Math.round((completedHabits / activeHabits) * 100) : 0;

  // Streak calculations - for simplicity, just find the highest streak among all habits
  const highestStreak =
    habits.length > 0
      ? Math.max(...habits.map((h) => h.dailyStreak))
      : Math.min(Math.floor(completedTasks / 2), 30);

  // Get count of unique categories from routines
  const uniqueCategoriesCount =
    routines.length > 0
      ? new Set(routines.map((r) => r.category.name)).size
      : 0;

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pt-4 pb-2">
          <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
          <CheckCircle2 className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="text-2xl font-bold">
            {completedTasks}/{totalTasks}
          </div>
          <p className="text-muted-foreground text-xs">
            {taskCompletionPercentage}% completion rate
          </p>
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pt-4 pb-2">
          <CardTitle className="text-sm font-medium">
            Habits Completed
          </CardTitle>
          <Flame className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="text-2xl font-bold">
            {completedHabits}/{activeHabits}
          </div>
          <p className="text-muted-foreground text-xs">
            {habitCompletionPercentage}% completion rate
          </p>
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pt-4 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Circle className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="text-2xl font-bold">{highestStreak} days</div>
          <p className="text-muted-foreground text-xs">
            {completedTasks > 0 || completedHabits > 0
              ? "Keep it up! You're doing great."
              : "Complete tasks or habits to build your streak!"}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
