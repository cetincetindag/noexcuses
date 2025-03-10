"use client";

import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateHabitDialog } from "~/components/dialogs/create-habit-dialog";
import { HabitCard } from "~/components/habits/habit-card";
import { Habit } from "~/lib/utils";

interface HabitListProps {
  habits: Habit[];
}

export function HabitList({ habits }: HabitListProps) {
  const [habitDialogOpen, setHabitDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Habits</h2>
        <Button
          onClick={() => setHabitDialogOpen(true)}
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          New Habit
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
        {habits.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No habits found. Get started by creating your first habit!
            </p>
            <Button
              onClick={() => setHabitDialogOpen(true)}
              variant="outline"
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Create Habit
            </Button>
          </div>
        )}
      </div>

      <CreateHabitDialog open={habitDialogOpen} setOpen={setHabitDialogOpen} />
    </div>
  );
}
