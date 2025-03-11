"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { HabitList } from "~/components/habits/habit-list";
import { CreateHabitDialog } from "~/components/dialogs/create-habit-dialog";
import { toast } from "sonner";

export default function ActiveHabitsPage() {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const fetchHabits = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/habits?filter=active");

      if (!response.ok) {
        throw new Error("Failed to fetch habits");
      }

      const data = await response.json();
      setHabits(data || []);
    } catch (error) {
      console.error("Error fetching habits:", error);
      toast.error("Failed to load habits. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch habits on initial load and when create dialog closes
  useEffect(() => {
    fetchHabits();
  }, [createDialogOpen]);

  // Listen for habit data refresh from localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "refreshHabitData" && e.newValue === "true") {
        fetchHabits();
        localStorage.removeItem("refreshHabitData");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check on mount
    if (sessionStorage.getItem("refreshHabitData") === "true") {
      fetchHabits();
      sessionStorage.removeItem("refreshHabitData");
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="container max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Active Habits</h1>
          <p className="text-muted-foreground mt-1">
            Track and maintain your daily habits
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Habit
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <p>Loading habits...</p>
        </div>
      ) : (
        <HabitList habits={habits} onHabitUpdated={fetchHabits} />
      )}

      <CreateHabitDialog
        open={createDialogOpen}
        setOpen={setCreateDialogOpen}
        onHabitCreated={fetchHabits}
      />
    </div>
  );
}
