"use client";

import { HabitCard } from "~/components/habits/habit-card";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateHabitDialog } from "~/components/dialogs/create-habit-dialog";

interface HabitListProps {
  habits: any[];
  onHabitUpdated: () => void;
}

export function HabitList({ habits, onHabitUpdated }: HabitListProps) {
  const [habitDialogOpen, setHabitDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
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
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onHabitUpdated={onHabitUpdated}
            />
          ))}
        </div>
      )}

      <CreateHabitDialog
        open={habitDialogOpen}
        setOpen={setHabitDialogOpen}
        onHabitCreated={onHabitUpdated}
      />
    </div>
  );
}
