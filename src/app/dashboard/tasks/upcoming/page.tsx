"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { TaskList } from "~/components/dashboard/task-list";
import { CreateTaskDialog } from "~/components/dialogs/create-task-dialog";
import { toast } from "sonner";
import type { Task } from "~/lib/utils";

export default function UpcomingTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/tasks?filter=upcoming");

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tasks on initial load and when create dialog closes
  useEffect(() => {
    fetchTasks();
  }, [createDialogOpen]);

  // Listen for task data refresh from localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "refreshTaskData" && e.newValue === "true") {
        fetchTasks();
        localStorage.removeItem("refreshTaskData");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check on mount
    if (sessionStorage.getItem("refreshTaskData") === "true") {
      fetchTasks();
      sessionStorage.removeItem("refreshTaskData");
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="container max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Upcoming Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Plan and prepare for your upcoming tasks
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <p>Loading tasks...</p>
        </div>
      ) : (
        <TaskList tasks={tasks} />
      )}

      <CreateTaskDialog
        open={createDialogOpen}
        setOpen={setCreateDialogOpen}
        onTaskCreated={fetchTasks}
      />
    </div>
  );
}
