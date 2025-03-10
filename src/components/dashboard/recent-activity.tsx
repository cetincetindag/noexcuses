import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { CheckCircle, Circle } from "lucide-react";
import type { Task, Habit } from "~/lib/utils";

interface RecentActivityProps {
  tasks: Task[];
  habits?: Habit[];
}

export function RecentActivity({ tasks, habits = [] }: RecentActivityProps) {
  // Create a combined list of activities from tasks and habits
  const getActivityItems = () => {
    const taskActivities = tasks
      .filter((task) => task.completed)
      .map((task) => ({
        id: task.id,
        title: task.title,
        description: `Task completed`,
        category: task.category.name,
        categoryColor: task.category.color,
        timestamp: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
        ), // Random time in last week
        type: "task",
      }));

    const habitActivities = habits
      .filter((habit) => habit.isCompletedToday)
      .map((habit) => ({
        id: habit.id,
        title: habit.title,
        description: `Habit completed ${habit.completedToday}/${habit.targetCompletions} times`,
        category: habit.category.name,
        categoryColor: habit.category.color,
        timestamp: new Date(
          Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000,
        ), // More recent
        type: "habit",
      }));

    // Combine and sort by timestamp
    return [...taskActivities, ...habitActivities]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10); // Show at most 10 activities
  };

  const activityItems = getActivityItems();

  // Function to format timestamp in relative time
  const formatRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMins > 0) {
      return `${diffMins}m ago`;
    } else {
      return "just now";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest completed items</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="-mx-2 flex flex-col gap-1">
          {activityItems.length > 0 ? (
            activityItems.map((item) => (
              <div
                key={item.id}
                className="hover:bg-muted flex items-center rounded-lg p-2 transition"
              >
                <div
                  className="mr-2 h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.categoryColor }}
                />
                <div className="flex-1 overflow-hidden">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-muted-foreground text-xs">
                    {item.description}
                  </div>
                </div>
                <div className="text-muted-foreground text-xs">
                  {formatRelativeTime(item.timestamp)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle className="mb-2 h-10 w-10 opacity-25" />
              <p>No activities yet</p>
              <p className="text-xs">
                Complete tasks or habits to see your activity here.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
