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
import { Checkbox } from "~/components/ui/checkbox";
import { Clock, Calendar, MoreHorizontal } from "lucide-react";
import { formatDistance } from "date-fns";
import { cn } from "~/lib/utils";
import type { Task } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { toast } from "sonner";

interface TaskCardProps {
  task: Task;
}

// Extend the Task type to include optional properties that might be in the API response
interface ExtendedTask extends Task {
  dueDate?: string;
  createdAt?: string;
}

export function TaskCard({ task }: TaskCardProps) {
  // Cast to extended task type to access potential additional properties
  const extendedTask = task as ExtendedTask;

  const handleMarkComplete = () => {
    // Function to mark a task as complete
    toast.success("Task marked as complete");
  };

  const handleDelete = () => {
    // Function to delete a task
    toast.success("Task deleted");
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="line-clamp-1 text-base">
              {task.title}
            </CardTitle>
            {task.category && (
              <Badge
                variant="outline"
                className="mt-1"
                style={
                  task.category.color
                    ? {
                        borderColor: task.category.color,
                        color: task.category.color,
                      }
                    : undefined
                }
              >
                {task.category.name}
              </Badge>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleMarkComplete}>
                Mark as complete
              </DropdownMenuItem>
              <DropdownMenuItem>Edit task</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                Delete task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {task.description && (
          <CardDescription className="mt-1 line-clamp-2">
            {task.description}
          </CardDescription>
        )}
      </CardContent>
      <CardFooter className="text-muted-foreground flex items-center justify-between p-4 pt-0 text-sm">
        {extendedTask.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {formatDistance(new Date(extendedTask.dueDate), new Date(), {
                addSuffix: true,
              })}
            </span>
          </div>
        )}
        {extendedTask.createdAt ? (
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {formatDistance(new Date(extendedTask.createdAt), new Date(), {
                addSuffix: true,
              })}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>Recently</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
