"use client";

import { useEffect, useState } from "react";
import { CompletionStatus } from "~/components/dashboard/completion-status";
import { DashboardCards } from "~/components/dashboard/dashboard-cards";
import { DashboardHeader } from "~/components/dashboard/dashboard-header";
import { RecentActivity } from "~/components/dashboard/recent-activity";
import { TaskList } from "~/components/dashboard/task-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { EmptyStateMenu } from "~/components/dashboard/empty-state-menu";
import { Loader2 } from "lucide-react";
import type { Task, Habit, Routine } from "~/lib/utils";
import { HabitList } from "~/components/dashboard/habit-list";
import { RoutineList } from "~/components/dashboard/routine-list";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch Tasks
        const tasksResponse = await fetch("/api/tasks", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Fetch Habits in parallel
        const habitsResponse = await fetch("/api/habits", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Fetch Routines in parallel
        const routinesResponse = await fetch("/api/routines", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Process Tasks Response
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          console.log("Dashboard - Tasks fetched:", tasksData.length);

          // Transform the API response to match the Task interface
          const transformedTasks: Task[] = tasksData.map((apiTask: any) => ({
            id: apiTask.id,
            title: apiTask.title,
            description: apiTask.description || "",
            priority: apiTask.priority,
            category: {
              id: apiTask.category.id,
              name: apiTask.category.name,
              color: apiTask.category.color,
              icon: apiTask.category.icon,
              priority: apiTask.category.priority,
              order: apiTask.category.order,
            },
            frequency: apiTask.frequency,
            order: apiTask.order,
            completed: apiTask.completed,
            userId: apiTask.userId, // Store this for debugging
          }));

          // Log user ID from first task for debugging
          if (transformedTasks.length > 0 && transformedTasks[0]?.userId) {
            console.log(
              "Task userId from first task:",
              transformedTasks[0].userId,
            );
          }

          setTasks(transformedTasks);
        } else {
          console.error("Failed to fetch tasks:", tasksResponse.status);
          setTasks([]);
        }

        // Process Habits Response
        if (habitsResponse.ok) {
          const habitsData = await habitsResponse.json();
          console.log("Dashboard - Habits fetched:", habitsData.length);

          // Transform the API response to match the Habit interface
          const transformedHabits: Habit[] = habitsData.map(
            (apiHabit: any) => ({
              id: apiHabit.id,
              title: apiHabit.title,
              description: apiHabit.description || "",
              targetCompletions: apiHabit.targetCompletions,
              completedToday: apiHabit.completedToday,
              isCompletedToday: apiHabit.isCompletedToday,
              active: apiHabit.active,
              dailyStreak: apiHabit.dailyStreak,
              longestStreak: apiHabit.longestStreak,
              category: {
                id: apiHabit.category.id,
                name: apiHabit.category.name,
                color: apiHabit.category.color,
                icon: apiHabit.category.icon,
              },
              color: apiHabit.color,
              userId: apiHabit.userId, // Store this for debugging
            }),
          );

          // Log user ID from first habit for debugging
          if (transformedHabits.length > 0 && transformedHabits[0]?.userId) {
            console.log(
              "Habit userId from first habit:",
              transformedHabits[0].userId,
            );
          }

          setHabits(transformedHabits);
        } else {
          console.error("Failed to fetch habits:", habitsResponse.status);
          setHabits([]);
        }

        // Process Routines Response
        if (routinesResponse.ok) {
          const routinesData = await routinesResponse.json();
          console.log("Dashboard - Routines fetched:", routinesData.length);

          // Transform the API response to match the Routine interface
          const transformedRoutines: Routine[] = routinesData.map(
            (apiRoutine: any) => ({
              id: apiRoutine.id,
              title: apiRoutine.title,
              description: apiRoutine.description || "",
              frequency: apiRoutine.frequency,
              isCompletedToday: apiRoutine.isCompletedToday,
              streak: apiRoutine.streak,
              lastCompletedAt: apiRoutine.lastCompletedAt,
              color: apiRoutine.color,
              category: {
                id: apiRoutine.category.id,
                name: apiRoutine.category.name,
                color: apiRoutine.category.color,
                icon: apiRoutine.category.icon,
                priority: apiRoutine.category.priority,
                order: apiRoutine.category.order,
              },
              tasks: apiRoutine.tasks,
              habits: apiRoutine.habits,
              userId: apiRoutine.userId,
            }),
          );

          setRoutines(transformedRoutines);
        } else {
          console.error("Failed to fetch routines:", routinesResponse.status);
          setRoutines([]);
        }

        // Clear the refresh flags if they were set
        if (typeof window !== "undefined" && window.sessionStorage) {
          if (sessionStorage.getItem("refreshTaskData") === "true") {
            console.log("Cleared task refresh flag after loading fresh data");
            sessionStorage.removeItem("refreshTaskData");
          }

          if (sessionStorage.getItem("refreshHabitData") === "true") {
            console.log("Cleared habit refresh flag after loading fresh data");
            sessionStorage.removeItem("refreshHabitData");
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setTasks([]);
        setHabits([]);
        setRoutines([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Set up a flag check to handle returning from onboarding
    const checkRefreshFlags = () => {
      if (typeof window !== "undefined" && window.sessionStorage) {
        if (
          sessionStorage.getItem("refreshTaskData") === "true" ||
          sessionStorage.getItem("refreshHabitData") === "true"
        ) {
          console.log("Refresh flags detected, reloading tasks and habits");
          fetchData();
        }
      }
    };

    // Check flags on mount and when it becomes visible
    checkRefreshFlags();
    document.addEventListener("visibilitychange", checkRefreshFlags);

    return () => {
      document.removeEventListener("visibilitychange", checkRefreshFlags);
    };
  }, []);

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="text-primary h-12 w-12 animate-spin" />
      </div>
    );
  }

  // Show empty state if there are no tasks and habits
  if (!tasks.length && !habits.length && !routines.length) {
    return <EmptyStateMenu />;
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <DashboardHeader />
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="flex w-full justify-between overflow-x-auto sm:w-auto sm:justify-start">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
          <TabsTrigger value="routines">Routines</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="pt-4">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            <DashboardCards tasks={tasks} habits={habits} routines={routines} />
          </div>
          <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 md:grid-cols-2">
            <CompletionStatus tasks={tasks} habits={habits} />
            <RecentActivity tasks={tasks} habits={habits} />
          </div>
        </TabsContent>
        <TabsContent value="tasks" className="pt-4">
          <TaskList tasks={tasks} />
        </TabsContent>
        <TabsContent value="habits" className="pt-4">
          <HabitList habits={habits} />
        </TabsContent>
        <TabsContent value="routines" className="pt-4">
          <div className="grid gap-4 sm:gap-6">
            <h2 className="text-2xl font-bold">Your Routines</h2>
            <RoutineList routines={routines} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
