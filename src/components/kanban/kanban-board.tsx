"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { KanbanColumn } from "./kanban-column";
import type { Goal, Task, Category } from "~/lib/utils";
import { Loader2, PlusCircle, RefreshCw, Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { cn, safeString } from "~/lib/utils";

// Define a specific interface for tasks in the Kanban board to handle the frequency issue
interface KanbanTask extends Omit<Task, "frequency"> {
  frequency: string | unknown;
}

interface KanbanBoardProps {
  viewType: "frequency" | "category";
}

// Create a custom event for refresh triggers
export const triggerKanbanRefresh = () => {
  const event = new CustomEvent("kanban-refresh");
  window.dispatchEvent(event);
};

export function KanbanBoard({ viewType }: KanbanBoardProps) {
  const [filter, setFilter] = useState<string>("all");
  const categoryContainerRef = useRef<HTMLDivElement>(null);
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const completedGoalsByTaskRef = useRef<Record<string, Goal[]>>({});

  // Function to fetch data that can be called anytime
  const fetchData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      console.log("KanbanBoard: Fetching data for Kanban board...");

      // Fetch debug information first
      try {
        console.log("KanbanBoard: Fetching debug data...");
        const debugRes = await fetch("/api/debug", {
          headers: {
            "Content-Type": "application/json",
          },
          // Add no-cache for consistent results
          cache: "no-store",
        });

        if (debugRes.ok) {
          const debugData = await debugRes.json();
          console.log("KanbanBoard: Debug data:", debugData);
          console.log(
            `KanbanBoard: User has ${debugData.diagnostics.rawTaskCount} tasks in database`,
          );
          console.log(
            `KanbanBoard: User has ${debugData.diagnostics.categoriesCount} categories`,
          );

          // If debug API shows tasks but our main fetch doesn't, we have a data inconsistency
          if (debugData.diagnostics.rawTaskCount > 0) {
            console.log("KanbanBoard: Debug API shows tasks exist in database");
          }
        } else {
          console.warn(
            "KanbanBoard: Debug API returned error:",
            debugRes.status,
          );
        }
      } catch (err) {
        console.warn("KanbanBoard: Debug API not available:", err);
      }

      // Attempt to fetch tasks
      let tasksData: KanbanTask[] = [];
      try {
        console.log("KanbanBoard: Fetching tasks for board view...");
        // Always use no-store to avoid caching issues
        const tasksRes = await fetch("/api/tasks", {
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });
        console.log("KanbanBoard: Tasks response status:", tasksRes.status);

        if (tasksRes.ok) {
          const data = await tasksRes.json();
          console.log("KanbanBoard: Tasks data received:", data);

          // Validate received data is an array
          if (Array.isArray(data)) {
            console.log("KanbanBoard: Tasks array length:", data.length);

            // Make sure data items have the expected structure
            const validItems = data.filter(
              (item) => item && typeof item === "object" && "id" in item,
            );
            console.log(
              `KanbanBoard: Valid task items: ${validItems.length} out of ${data.length}`,
            );

            tasksData = validItems.map((task) => ({
              ...task,
              // Double check that frequency is a string
              frequency:
                typeof task.frequency === "string"
                  ? task.frequency
                  : task.frequency
                    ? String(task.frequency).toLowerCase()
                    : "once",
            }));

            console.log(
              `KanbanBoard: Received ${tasksData.length} tasks for board view`,
            );

            // Log the first few tasks for debugging
            if (tasksData.length > 0) {
              console.log(
                "KanbanBoard: Task frequency examples:",
                tasksData.slice(0, Math.min(3, tasksData.length)).map((t) => ({
                  id: t.id,
                  title: t.title,
                  frequency: t.frequency,
                  frequency_type: typeof t.frequency,
                })),
              );
            }
          } else {
            console.warn("KanbanBoard: Tasks data is not an array:", data);
            tasksData = [];
          }
        } else if (tasksRes.status !== 404) {
          // For status other than 404, log the response text
          const errorText = await tasksRes.text();
          console.error(
            `KanbanBoard: Failed to fetch tasks: ${tasksRes.status}`,
            errorText,
          );
          throw new Error(
            `KanbanBoard: Failed to fetch tasks: ${tasksRes.status} - ${errorText}`,
          );
        }
      } catch (err) {
        console.warn("KanbanBoard: Tasks API error:", err);
      }

      // Attempt to fetch goals
      let goalsData: Goal[] = [];
      try {
        console.log("KanbanBoard: Fetching goals...");
        const goalsRes = await fetch("/api/goals/index", {
          headers: {
            "Content-Type": "application/json",
          },
          // Add cache busting for refreshes
          cache: isRefresh ? "no-store" : "default",
        });
        console.log("KanbanBoard: Goals response status:", goalsRes.status);

        if (goalsRes.ok) {
          const data = await goalsRes.json();
          console.log("KanbanBoard: Goals data received:", data);

          // Validate received data is an array
          if (Array.isArray(data)) {
            goalsData = data;
            console.log(`KanbanBoard: Received ${goalsData.length} goals`);

            // Validate goal structure
            goalsData.forEach((goal, index) => {
              console.log(`KanbanBoard: Goal ${index}:`, {
                id: goal.id,
                title: goal.title,
                frequency: goal.frequency,
                categoryId: goal.category?.id,
                categoryName: goal.category?.name,
                taskTitle: goal.task?.title,
              });
            });
          } else {
            console.warn("KanbanBoard: Goals data is not an array:", data);
            goalsData = [];
          }
        } else if (goalsRes.status !== 404) {
          // For status other than 404, log the response text
          const errorText = await goalsRes.text();
          console.error(
            `KanbanBoard: Failed to fetch goals: ${goalsRes.status}`,
            errorText,
          );
          throw new Error(
            `KanbanBoard: Failed to fetch goals: ${goalsRes.status} - ${errorText}`,
          );
        }
      } catch (err) {
        console.warn("KanbanBoard: Goals API error:", err);
      }

      // Attempt to fetch categories
      let categoriesData: Category[] = [];
      try {
        console.log("KanbanBoard: Fetching categories...");
        const categoriesRes = await fetch("/api/categories", {
          headers: {
            "Content-Type": "application/json",
          },
          // Add cache busting for refreshes
          cache: isRefresh ? "no-store" : "default",
        });
        console.log(
          "KanbanBoard: Categories response status:",
          categoriesRes.status,
        );

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          console.log("KanbanBoard: Categories data received:", data);

          // Extract categories array from response
          if (data && Array.isArray(data.categories)) {
            categoriesData = data.categories;
            console.log(
              `KanbanBoard: Received ${categoriesData.length} categories from 'categories' property`,
            );

            // Validate category structure
            categoriesData.forEach((category, index) => {
              console.log(`KanbanBoard: Category ${index}:`, {
                id: category.id,
                name: category.name,
                color: category.color,
              });
            });
          } else if (Array.isArray(data)) {
            categoriesData = data;
            console.log(
              `KanbanBoard: Received ${categoriesData.length} categories (direct array)`,
            );

            // Validate category structure
            categoriesData.forEach((category, index) => {
              console.log(`KanbanBoard: Category ${index}:`, {
                id: category.id,
                name: category.name,
                color: category.color,
              });
            });
          } else {
            console.warn(
              "KanbanBoard: Unexpected categories data format:",
              data,
            );
            categoriesData = [];
          }
        } else if (categoriesRes.status !== 404) {
          // For status other than 404, log the response text
          const errorText = await categoriesRes.text();
          console.error(
            `KanbanBoard: Failed to fetch categories: ${categoriesRes.status}`,
            errorText,
          );
          throw new Error(
            `KanbanBoard: Failed to fetch categories: ${categoriesRes.status} - ${errorText}`,
          );
        }
      } catch (err) {
        console.warn("KanbanBoard: Categories API error:", err);
      }

      // Set state with fetched data, ensuring categories is always an array
      setTasks(tasksData);
      setGoals(goalsData);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);

      console.log("KanbanBoard: Kanban data fetch complete.");

      if (isRefresh) {
        toast({
          title: "Data refreshed",
          description: "The board has been updated with the latest data.",
        });
      }
    } catch (err) {
      console.error("KanbanBoard: Error fetching data:", err);
      // For serious errors, set the error state
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchData();
  }, []);

  // Listen for refresh events
  useEffect(() => {
    const handleRefresh = () => {
      console.log("KanbanBoard: Refresh event received, reloading data...");
      fetchData(true);
    };

    window.addEventListener("kanban-refresh", handleRefresh);

    return () => {
      window.removeEventListener("kanban-refresh", handleRefresh);
    };
  }, []);

  // Add horizontal scrolling when wheel event is detected in category view
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (viewType === "category" && categoryContainerRef.current) {
        e.preventDefault();
        categoryContainerRef.current.scrollLeft += e.deltaY;
      }
    };

    const container = categoryContainerRef.current;
    if (container && viewType === "category") {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [viewType]);

  // Filter tasks and goals by frequency
  const getTasksByFrequency = (frequency: string) => {
    // Special debug logging for this function
    console.log(
      `KanbanBoard: [getTasksByFrequency] Filtering for '${frequency}', total tasks: ${tasks.length}`,
    );

    // Normalize input frequency
    const targetFreq = frequency.toLowerCase();

    const filteredTasks = tasks.filter((task) => {
      if (!task) return false;

      // Convert any frequency to string for comparison
      const taskFreq = String(task.frequency || "").toLowerCase();
      const match = taskFreq === targetFreq;

      if (match) {
        console.log(
          `KanbanBoard: [getTasksByFrequency] Found matching task: ${task.id}, "${task.title}", freq='${taskFreq}'`,
        );
      }

      return match;
    });

    console.log(
      `KanbanBoard: [getTasksByFrequency] Found ${filteredTasks.length} tasks with frequency '${targetFreq}'`,
    );
    return filteredTasks;
  };

  const getGoalsByFrequency = (frequency: string) => {
    return goals.filter((goal) => {
      // Skip goals without frequency
      if (!goal || typeof goal.frequency !== "string") return false;

      // Case-insensitive comparison
      return goal.frequency.toUpperCase() === frequency.toUpperCase();
    });
  };

  // Filter tasks and goals by category
  const getTasksByCategory = (categoryId: string) => {
    return tasks.filter((task) => task?.category?.id === categoryId);
  };

  const getGoalsByCategory = (categoryId: string) => {
    return goals.filter((goal) => goal?.category?.id === categoryId);
  };

  // Function to complete a task
  const completeTask = async (taskId: string) => {
    console.log(`KanbanBoard: Completing task ${taskId}`);
    try {
      // First mark the task as completed in UI
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: true } : task,
        ),
      );

      // Call the API to complete the task
      const response = await fetch(`/api/tasks/${taskId}/complete`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to complete task");
      }

      const completedTask = await response.json();

      // Find any goals that are related to this task
      const relatedGoals = goals.filter((goal) => goal.task?.id === taskId);

      // Store the completed goals for potential restoration later
      const completedGoals = relatedGoals.filter((goal) => goal.completed);
      if (completedGoals.length > 0) {
        completedGoalsByTaskRef.current[taskId] = [...completedGoals];
      }

      toast({
        title: "Task completed!",
        description: `"${completedTask.title}" has been marked as done.`,
      });
    } catch (error) {
      console.error("KanbanBoard: Error completing task:", error);
      // Revert UI changes
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: false } : task,
        ),
      );
      toast({
        title: "Failed to complete task",
        description: "There was an error completing the task.",
        variant: "destructive",
      });
    }
  };

  /**
   * Marks a task as incomplete and restores any related goals
   */
  const undoCompleteTask = async (taskId: string) => {
    console.log(`KanbanBoard: Undoing completion for task ${taskId}`);
    try {
      // First mark the task as incomplete in UI
      setTasks((prevTasks) => {
        // Check if the task exists in the current state
        const taskExists = prevTasks.some((task) => task.id === taskId);

        // If it exists, just update its completion status
        if (taskExists) {
          return prevTasks.map((task) =>
            task.id === taskId ? { ...task, completed: false } : task,
          );
        }

        // If the task doesn't exist in the state (was removed after completion),
        // we need to request it from the API to add it back
        fetch(`/api/tasks/${taskId}`)
          .then((res) => res.json())
          .then((task) => {
            if (task && task.id) {
              // Add the task back to the state with completed=false
              setTasks((currentTasks) => [
                ...currentTasks,
                { ...task, completed: false },
              ]);
            }
          })
          .catch((err) =>
            console.error("KanbanBoard: Error fetching task details:", err),
          );

        // Return unchanged state for now, will be updated by the above fetch
        return prevTasks;
      });

      // Call the API to mark the task as incomplete
      const response = await fetch(`/api/tasks/${taskId}/undo-complete`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to undo task completion");
      }

      const updatedTask = await response.json();

      // Check if we need to restore any completed goals
      const goalsToRestore = await fetch(
        `/api/goals?taskId=${taskId}&completed=true`,
      )
        .then((res) => res.json())
        .catch((err) => {
          console.error("KanbanBoard: Error fetching completed goals:", err);
          return [];
        });

      // Also check our local cache for any recently completed goals
      const cachedCompletedGoals =
        completedGoalsByTaskRef.current[taskId] || [];

      // Combine goal lists, ensuring no duplicates
      const allGoalsToRestore = [...goalsToRestore];

      cachedCompletedGoals.forEach((cachedGoal) => {
        if (!allGoalsToRestore.some((g) => g.id === cachedGoal.id)) {
          allGoalsToRestore.push(cachedGoal);
        }
      });

      // Update any goals that were restored
      if (allGoalsToRestore.length > 0) {
        // Mark goals as incomplete through API
        for (const goal of allGoalsToRestore) {
          await fetch(`/api/goals/${goal.id}/undo-complete`, {
            method: "PATCH",
          }).catch((err) =>
            console.error(`KanbanBoard: Error restoring goal ${goal.id}:`, err),
          );
        }

        // Update goals state to include restored goals
        setGoals((prevGoals) => {
          // Create a map of existing goals by ID for quick lookup
          const goalMap = new Map(prevGoals.map((g) => [g.id, g]));

          // Add or update restored goals
          for (const goal of allGoalsToRestore) {
            // Update the goal to be incomplete with appropriate progress
            const updatedGoal = {
              ...goal,
              completed: false,
              progress: Math.max(0, goal.total - 1), // Set progress to slightly less than total
            };
            goalMap.set(goal.id, updatedGoal);
          }

          // Convert map back to array
          return Array.from(goalMap.values());
        });

        // Clear the cached completed goals for this task
        delete completedGoalsByTaskRef.current[taskId];
      }

      toast({
        title: "Task marked as incomplete",
        description: `"${updatedTask.title}" has been marked as incomplete.`,
      });
    } catch (error) {
      console.error("KanbanBoard: Error undoing task completion:", error);
      // Revert UI changes
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: true } : task,
        ),
      );
      toast({
        title: "Failed to undo task completion",
        description: "There was an error marking the task as incomplete.",
        variant: "destructive",
      });
    }
  };

  // Function to complete a goal
  const completeGoal = async (goalId: string) => {
    try {
      console.log(`KanbanBoard: Completing goal: ${goalId}`);

      // First update the state to show it as completed
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalId
            ? { ...goal, completed: true, progress: goal.total }
            : goal,
        ),
      );

      const response = await fetch(`/api/goals/${goalId}/complete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to complete goal: ${response.statusText}`);
      }

      const completedGoal = await response.json();
      console.log("KanbanBoard: Goal completed:", completedGoal);

      toast({
        title: "Goal completed!",
        description: "Your goal has been marked as completed.",
      });
    } catch (error) {
      console.error("KanbanBoard: Error completing goal:", error);

      // Revert UI changes on error
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalId ? { ...goal, completed: false } : goal,
        ),
      );

      toast({
        title: "Error",
        description: "Failed to complete goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  /**
   * Marks a goal as incomplete
   */
  const undoCompleteGoal = async (goalId: string) => {
    console.log(`KanbanBoard: Undoing completion for goal ${goalId}`);
    try {
      // First mark the goal as incomplete in UI
      setGoals((prevGoals) => {
        // Check if the goal exists in the current state
        const goalExists = prevGoals.some((goal) => goal.id === goalId);

        // If it exists, just update its completion status
        if (goalExists) {
          return prevGoals.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  completed: false,
                  progress: Math.max(0, goal.total - 1), // Set progress to slightly less than total
                }
              : goal,
          );
        }

        // If the goal doesn't exist in the state (was removed after completion),
        // we need to request it from the API to add it back
        fetch(`/api/goals/${goalId}`)
          .then((res) => res.json())
          .then((goal) => {
            if (goal && goal.id) {
              // Add the goal back to the state with completed=false
              setGoals((currentGoals) => [
                ...currentGoals,
                {
                  ...goal,
                  completed: false,
                  progress: Math.max(0, goal.total - 1),
                },
              ]);
            }
          })
          .catch((err) =>
            console.error("KanbanBoard: Error fetching goal details:", err),
          );

        // Return unchanged state for now, will be updated by the above fetch
        return prevGoals;
      });

      // Call the API to mark the goal as incomplete
      const response = await fetch(`/api/goals/${goalId}/undo-complete`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to undo goal completion");
      }

      const updatedGoal = await response.json();

      toast({
        title: "Goal marked as incomplete",
        description: `"${updatedGoal.title}" has been marked as incomplete.`,
      });
    } catch (error) {
      console.error("KanbanBoard: Error undoing goal completion:", error);
      // Revert UI changes
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalId
            ? { ...goal, completed: true, progress: goal.total }
            : goal,
        ),
      );
      toast({
        title: "Failed to undo goal completion",
        description: "There was an error marking the goal as incomplete.",
        variant: "destructive",
      });
    }
  };

  // Function to create a sample task if no tasks exist
  const createSampleTask = async () => {
    try {
      setLoading(true);

      // First check if we have categories
      const categoriesRes = await fetch("/api/categories", {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!categoriesRes.ok) {
        toast({
          title: "Error fetching categories",
          description: "Please try again later",
          variant: "destructive",
        });
        return;
      }

      let categories = await categoriesRes.json();
      let categoryId = "";

      // Get the first category ID or create a default one
      if (Array.isArray(categories) && categories.length > 0) {
        categoryId = categories[0].id;
      } else if (
        categories.categories &&
        Array.isArray(categories.categories) &&
        categories.categories.length > 0
      ) {
        categoryId = categories.categories[0].id;
      } else {
        // Create a default category
        const createCategoryRes = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "General",
            color: "#3498db",
            icon: "📝",
            priority: 1,
            order: 1,
          }),
        });

        if (createCategoryRes.ok) {
          const newCategory = await createCategoryRes.json();
          categoryId = newCategory.id;
        } else {
          toast({
            title: "Error creating category",
            description: "Please try again later",
            variant: "destructive",
          });
          return;
        }
      }

      // Create a sample task
      const createTaskRes = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Sample Task",
          description: "This is a sample task to help you get started",
          completed: false,
          frequency: "daily",
          categoryId,
          dueDate: new Date().toISOString(),
          priority: 1,
          order: 1,
        }),
      });

      if (createTaskRes.ok) {
        toast({
          title: "Sample task created",
          description: "Refreshing the board to show your new task",
        });

        // Refresh the board
        await fetchData(true);
      } else {
        const errorText = await createTaskRes.text();
        console.error("Error creating sample task:", errorText);

        toast({
          title: "Error creating sample task",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating sample task:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderEmptyState = () => {
    // Check if we might have data but it's not showing due to filtering issues
    const hasAnyTasks = tasks.length > 0;
    const hasAnyGoals = goals.length > 0;
    const isLoadingOrRefreshing = loading || refreshing;

    if (isLoadingOrRefreshing) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 animate-spin text-4xl">⟳</div>
          <h3 className="mb-2 text-xl font-semibold">Loading your items...</h3>
          <p className="text-muted-foreground">
            Just a moment while we fetch your data.
          </p>
        </div>
      );
    }

    // If we have tasks but nothing is showing, it might be a filtering issue
    if (hasAnyTasks || hasAnyGoals) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 text-4xl">🔍</div>
          <h3 className="mb-2 text-xl font-semibold">
            Items exist but aren't visible
          </h3>
          <p className="text-muted-foreground mb-4">
            You have {tasks.length} tasks and {goals.length} goals, but they
            aren't showing in the current view. This might be due to filtering
            or categorization.
          </p>
          <Button onClick={() => fetchData(true)}>Refresh Data</Button>
        </div>
      );
    }

    // Original empty state
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 text-4xl">➕</div>
        <h3 className="mb-2 text-xl font-semibold">No items to display</h3>
        <p className="text-muted-foreground mb-4">
          You don't have any tasks or goals yet. Create a new item or try a
          sample task.
        </p>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <a href="/create-task">Create new item</a>
          </Button>
          <Button onClick={createSampleTask} disabled={loading || refreshing}>
            {loading || refreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create sample task"
            )}
          </Button>
        </div>
      </div>
    );
  };

  const renderFrequencyView = () => {
    // Check if we have data for debugging purposes
    if (tasks.length > 0) {
      console.log(
        `KanbanBoard: Have ${tasks.length} tasks, but potentially none matched frequency criteria`,
      );
    }

    console.log("[renderFrequencyView] Starting to render frequency view...");

    const dailyTasks = getTasksByFrequency("daily");
    const weeklyTasks = getTasksByFrequency("weekly");
    const monthlyTasks = getTasksByFrequency("monthly");

    const dailyGoals = getGoalsByFrequency("daily");
    const weeklyGoals = getGoalsByFrequency("weekly");
    const monthlyGoals = getGoalsByFrequency("monthly");

    console.log("[renderFrequencyView] Task counts by frequency:", {
      daily: dailyTasks.length,
      weekly: weeklyTasks.length,
      monthly: monthlyTasks.length,
      total_tasks: tasks.length,
    });

    console.log("[renderFrequencyView] Goals counts by frequency:", {
      daily: dailyGoals.length,
      weekly: weeklyGoals.length,
      monthly: monthlyGoals.length,
      total_goals: goals.length,
    });

    // Filter by category if a filter is selected
    console.log("[renderFrequencyView] Current category filter:", filter);
    const filteredDailyTasks =
      filter === "all"
        ? dailyTasks
        : dailyTasks.filter((task) => task.category?.id === filter);
    const filteredWeeklyTasks =
      filter === "all"
        ? weeklyTasks
        : weeklyTasks.filter((task) => task.category?.id === filter);
    const filteredMonthlyTasks =
      filter === "all"
        ? monthlyTasks
        : monthlyTasks.filter((task) => task.category?.id === filter);

    // Filter goals by category if a filter is selected
    const filteredDailyGoals =
      filter === "all"
        ? dailyGoals
        : dailyGoals.filter((goal) => goal.category?.id === filter);
    const filteredWeeklyGoals =
      filter === "all"
        ? weeklyGoals
        : weeklyGoals.filter((goal) => goal.category?.id === filter);
    const filteredMonthlyGoals =
      filter === "all"
        ? monthlyGoals
        : monthlyGoals.filter((goal) => goal.category?.id === filter);

    // Log the final counts
    console.log("[renderFrequencyView] Final filtered task counts:", {
      daily: filteredDailyTasks.length,
      weekly: filteredWeeklyTasks.length,
      monthly: filteredMonthlyTasks.length,
    });

    console.log("[renderFrequencyView] Final filtered goal counts:", {
      daily: filteredDailyGoals.length,
      weekly: filteredWeeklyGoals.length,
      monthly: filteredMonthlyGoals.length,
    });

    // Check if there are any items to display after filtering
    const hasItems =
      filteredDailyTasks.length > 0 ||
      filteredWeeklyTasks.length > 0 ||
      filteredMonthlyTasks.length > 0 ||
      filteredDailyGoals.length > 0 ||
      filteredWeeklyGoals.length > 0 ||
      filteredMonthlyGoals.length > 0;

    if (!hasItems) {
      // If the current filter has no items
      if (filter !== "all") {
        return (
          <div className="bg-muted/20 flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
            <p className="text-muted-foreground">
              No items match the selected filter. Try selecting a different
              category or clear the filter.
            </p>
          </div>
        );
      }

      // If there are no items at all
      return renderEmptyState();
    }

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KanbanColumn
          key="daily-column"
          title="Daily"
          tasks={filteredDailyTasks}
          goals={filteredDailyGoals}
          onCompleteTask={completeTask}
          onUndoCompleteTask={undoCompleteTask}
          onCompleteGoal={completeGoal}
          onUndoCompleteGoal={undoCompleteGoal}
        />
        <KanbanColumn
          key="weekly-column"
          title="Weekly"
          tasks={filteredWeeklyTasks}
          goals={filteredWeeklyGoals}
          onCompleteTask={completeTask}
          onUndoCompleteTask={undoCompleteTask}
          onCompleteGoal={completeGoal}
          onUndoCompleteGoal={undoCompleteGoal}
        />
        <KanbanColumn
          key="monthly-column"
          title="Monthly"
          tasks={filteredMonthlyTasks}
          goals={filteredMonthlyGoals}
          onCompleteTask={completeTask}
          onUndoCompleteTask={undoCompleteTask}
          onCompleteGoal={completeGoal}
          onUndoCompleteGoal={undoCompleteGoal}
        />
      </div>
    );
  };

  const renderCategoryView = () => {
    // Ensure categories is always an array
    const safeCategoriesArray = Array.isArray(categories) ? categories : [];

    // Filter by frequency if a filter is selected
    const frequencyFilter =
      filter === "all" ? null : (filter as "daily" | "weekly" | "monthly");

    // Check if there are any categories with items to display
    const categoriesWithItems = safeCategoriesArray.filter((category) => {
      if (!category || !category.id) return false;

      const categoryTasks = getTasksByCategory(category.id);
      const categoryGoals = getGoalsByCategory(category.id);

      // Apply frequency filter if selected
      const filteredTasks = frequencyFilter
        ? categoryTasks.filter((task) => {
            // Skip tasks without frequency
            if (!task || typeof task.frequency !== "string") return false;

            // Case-insensitive comparison
            return (
              task.frequency.toUpperCase() === frequencyFilter.toUpperCase()
            );
          })
        : categoryTasks;
      const filteredGoals = frequencyFilter
        ? categoryGoals.filter((goal) => {
            // Skip goals without frequency
            if (!goal || typeof goal.frequency !== "string") return false;

            // Case-insensitive comparison
            return (
              goal.frequency.toUpperCase() === frequencyFilter.toUpperCase()
            );
          })
        : categoryGoals;

      return filteredTasks.length > 0 || filteredGoals.length > 0;
    });

    // If no categories have items after filtering
    if (categoriesWithItems.length === 0) {
      // If the current filter has no items
      if (filter !== "all") {
        return (
          <div className="bg-muted/20 flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
            <p className="text-muted-foreground">
              No items match the selected frequency filter. Try selecting a
              different frequency or clear the filter.
            </p>
          </div>
        );
      }

      // If there are no items at all
      return renderEmptyState();
    }

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {safeCategoriesArray.map((category) => {
          if (!category || !category.id || !category.name) return null;

          const categoryTasks = getTasksByCategory(category.id);
          const categoryGoals = getGoalsByCategory(category.id);

          // Apply frequency filter if selected
          const filteredTasks = frequencyFilter
            ? categoryTasks.filter((task) => {
                // Skip tasks without frequency
                if (!task || typeof task.frequency !== "string") return false;

                // Case-insensitive comparison
                return (
                  task.frequency.toUpperCase() === frequencyFilter.toUpperCase()
                );
              })
            : categoryTasks;
          const filteredGoals = frequencyFilter
            ? categoryGoals.filter((goal) => {
                // Skip goals without frequency
                if (!goal || typeof goal.frequency !== "string") return false;

                // Case-insensitive comparison
                return (
                  goal.frequency.toUpperCase() === frequencyFilter.toUpperCase()
                );
              })
            : categoryGoals;

          // Only show categories that have tasks or goals after filtering
          if (filteredTasks.length === 0 && filteredGoals.length === 0) {
            return null;
          }

          return (
            <KanbanColumn
              key={category.id}
              title={category.name}
              color={category.color || "#808080"} // Provide a default color
              tasks={filteredTasks}
              goals={filteredGoals}
              onCompleteTask={completeTask}
              onUndoCompleteTask={undoCompleteTask}
              onCompleteGoal={completeGoal}
              onUndoCompleteGoal={undoCompleteGoal}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-background top-32 z-10 flex items-center justify-between pb-4">
        <h2 className="text-xl font-semibold">
          {viewType === "frequency"
            ? "Tasks by Frequency"
            : "Tasks by Category"}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData(true)}
            disabled={loading || refreshing}
            aria-label="Refresh data"
            title="Refresh data"
            className="flex items-center gap-1"
          >
            <RefreshCw
              className={cn("h-4 w-4", refreshing && "animate-spin")}
            />
            <span>Refresh</span>
          </Button>

          {(tasks.length > 0 || goals.length > 0) && categories.length > 0 && (
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All {viewType === "frequency" ? "Categories" : "Frequencies"}
                </SelectItem>
                {viewType === "frequency" ? (
                  // Show category filters for frequency view
                  categories.map((category) => {
                    // Skip categories without an ID
                    if (!category || !category.id) return null;

                    return (
                      <SelectItem key={category.id} value={category.id || ""}>
                        {category.name}
                      </SelectItem>
                    );
                  })
                ) : (
                  // Show frequency filters for category view
                  <>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span className="ml-2">Loading data...</span>
        </div>
      ) : refreshing ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span className="ml-2">Refreshing data...</span>
        </div>
      ) : tasks.length === 0 && goals.length === 0 ? (
        renderEmptyState()
      ) : viewType === "frequency" ? (
        renderFrequencyView()
      ) : (
        renderCategoryView()
      )}
    </div>
  );
}
