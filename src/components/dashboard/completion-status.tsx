"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Task, Habit } from "~/lib/utils";
import { Progress } from "~/components/ui/progress";

interface CompletionStatusProps {
  tasks: Task[];
  habits?: Habit[];
}

export function CompletionStatus({
  tasks,
  habits = [],
}: CompletionStatusProps) {
  // Calculate task percentages
  const completedTasks = tasks.filter((task) => task.completed);
  const taskCompletionPercentage = tasks.length
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  // Calculate habit percentages
  const activeHabits = habits.filter((habit) => habit.active);
  const completedHabits = habits.filter((habit) => habit.isCompletedToday);
  const habitCompletionPercentage = activeHabits.length
    ? Math.round((completedHabits.length / activeHabits.length) * 100)
    : 0;

  // Calculate overall percentages including both tasks and habits
  const totalItems = tasks.length + activeHabits.length;
  const totalCompleted = completedTasks.length + completedHabits.length;
  const overallCompletionPercentage = totalItems
    ? Math.round((totalCompleted / totalItems) * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Completion Status</CardTitle>
        <CardDescription>
          Your current progress on tasks and habits
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <div className="flex items-center justify-between pb-2">
            <span className="text-sm font-medium">Overall</span>
            <span className="text-muted-foreground text-sm">
              {overallCompletionPercentage}%
            </span>
          </div>
          <Progress value={overallCompletionPercentage} className="h-2" />
        </div>
        <div>
          <div className="flex items-center justify-between pb-2">
            <span className="text-sm font-medium">Tasks</span>
            <span className="text-muted-foreground text-sm">
              {taskCompletionPercentage}%
            </span>
          </div>
          <Progress value={taskCompletionPercentage} className="h-2" />
        </div>
        <div>
          <div className="flex items-center justify-between pb-2">
            <span className="text-sm font-medium">Habits</span>
            <span className="text-muted-foreground text-sm">
              {habitCompletionPercentage}%
            </span>
          </div>
          <Progress value={habitCompletionPercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
