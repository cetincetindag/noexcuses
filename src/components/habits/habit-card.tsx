"use client";

import { Habit } from "~/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Flame, CheckCircle2, MoreHorizontal } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const progressPercentage = Math.min(
    Math.round((habit.completedToday / habit.targetCompletions) * 100),
    100,
  );

  const handleComplete = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/habits/${habit.id}/complete`, {
        method: "POST",
      });

      if (response.ok) {
        // Optimistically update UI
        // In a real app, you'd update the local state and/or refetch data
        toast.success("Habit marked as complete!");

        // Refresh the page after a short delay to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toast.error("Failed to complete habit");
      }
    } catch (error) {
      toast.error("Error completing habit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden transition hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-1 text-lg font-semibold">
            {habit.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="line-clamp-2">
          {habit.description || "No description"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center text-sm">
            <div
              className="mr-2 h-3 w-3 rounded-full"
              style={{ backgroundColor: habit.category.color }}
            />
            {habit.category.name}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Flame className="h-4 w-4 text-orange-500" />
            <span>{habit.dailyStreak} day streak</span>
          </div>
        </div>
        <div className="mb-1 flex items-center justify-between text-sm">
          <span>
            Progress: {habit.completedToday}/{habit.targetCompletions}
          </span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto pt-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleComplete}
                disabled={
                  isLoading || habit.completedToday >= habit.targetCompletions
                }
                className="w-full"
                variant={habit.isCompletedToday ? "outline" : "default"}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {habit.isCompletedToday
                  ? "Completed"
                  : habit.completedToday < habit.targetCompletions
                    ? "Mark Complete"
                    : "All Done!"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {habit.isCompletedToday
                ? "You've completed this habit for today!"
                : "Mark this habit as complete for today"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
