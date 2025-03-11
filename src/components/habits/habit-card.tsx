"use client";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Heart, MoreHorizontal, PlusCircle, CheckCircle2 } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Progress } from "~/components/ui/progress";
import { useState } from "react";

interface HabitCardProps {
  habit: any;
  onHabitUpdated: () => void;
}

export function HabitCard({ habit, onHabitUpdated }: HabitCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleComplete = async () => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/habits/${habit.id}/complete`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to complete habit");
      }

      toast.success("Habit marked as complete for today");
      onHabitUpdated();
    } catch (error) {
      console.error("Error completing habit:", error);
      toast.error("Failed to complete habit. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getCompletionPercentage = () => {
    if (!habit.targetCompletions) return 0;
    const percentage = (habit.completedToday / habit.targetCompletions) * 100;
    return Math.min(percentage, 100);
  };

  const getStreakText = () => {
    if (!habit.dailyStreak) return "Start your streak today!";
    return `${habit.dailyStreak} day streak! 🔥`;
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader
        className="p-4 pb-2"
        style={{
          backgroundColor: habit.color ? `${habit.color}15` : "transparent",
          borderBottom: habit.color ? `2px solid ${habit.color}30` : undefined,
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="line-clamp-1 text-base">
              {habit.title}
            </CardTitle>
            {habit.category && (
              <Badge variant="outline" className="mt-1">
                {habit.category.name}
              </Badge>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleComplete}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Complete
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PlusCircle className="mr-2 h-4 w-4" /> Increment
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {habit.description && (
          <CardDescription className="mb-3 line-clamp-2">
            {habit.description}
          </CardDescription>
        )}
        <div className="mb-1 flex items-center justify-between text-sm">
          <span>Progress Today</span>
          <span>
            {habit.completedToday}/{habit.targetCompletions}
          </span>
        </div>
        <Progress value={getCompletionPercentage()} className="h-2" />
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-3">
        <div className="text-muted-foreground text-sm">{getStreakText()}</div>
        <Button
          size="sm"
          onClick={handleComplete}
          disabled={isUpdating || habit.isCompletedToday}
          variant={habit.isCompletedToday ? "outline" : "default"}
        >
          <Heart
            className={cn(
              "mr-1 h-4 w-4",
              habit.isCompletedToday && "fill-current",
            )}
          />
          {habit.isCompletedToday ? "Completed" : "Complete"}
        </Button>
      </CardFooter>
    </Card>
  );
}
