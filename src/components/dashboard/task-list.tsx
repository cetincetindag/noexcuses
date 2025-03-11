"use client";

import { TaskCard } from "~/components/dashboard/task-card";
import type { Task } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateTaskDialog } from "~/components/dialogs/create-task-dialog";
import { CreateHabitDialog } from "~/components/dialogs/create-habit-dialog";

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [habitDialogOpen, setHabitDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Tasks</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setHabitDialogOpen(true)}
            size="sm"
            className="flex items-center gap-1"
            variant="secondary"
          >
            <Plus className="h-4 w-4" />
            New Habit
          </Button>
          <Button
            onClick={() => setTaskDialogOpen(true)}
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No tasks found. Get started by creating your first task!
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setHabitDialogOpen(true)}
                variant="outline"
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Create Habit
              </Button>
              <Button
                onClick={() => setTaskDialogOpen(true)}
                variant="outline"
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Create Task
              </Button>
            </div>
          </div>
        )}
      </div>

      <CreateTaskDialog open={taskDialogOpen} setOpen={setTaskDialogOpen} />
      <CreateHabitDialog open={habitDialogOpen} setOpen={setHabitDialogOpen} />
    </div>
  );
}
