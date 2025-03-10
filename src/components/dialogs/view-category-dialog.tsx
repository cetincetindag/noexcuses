"use client";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { type Category, type Task, type Goal } from "~/lib/utils";
import {
  Apple,
  Book,
  Briefcase,
  CheckCircle2,
  Circle,
  DollarSign,
  Dumbbell,
  GraduationCap,
  Heart,
  Home,
  Laptop,
  NotebookIcon as Lotus,
  Paintbrush,
  Plane,
  SpadeIcon as Spa,
  Target,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

interface ViewCategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  category: Category | null;
}

export function ViewCategoryDialog({
  open,
  setOpen,
  category,
}: ViewCategoryDialogProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Map icon name to component
  const iconMap: Record<string, React.ReactNode> = {
    Heart: <Heart className="h-5 w-5" />,
    Dumbbell: <Dumbbell className="h-5 w-5" />,
    Lotus: <Lotus className="h-5 w-5" />,
    Briefcase: <Briefcase className="h-5 w-5" />,
    Book: <Book className="h-5 w-5" />,
    GraduationCap: <GraduationCap className="h-5 w-5" />,
    DollarSign: <DollarSign className="h-5 w-5" />,
    Home: <Home className="h-5 w-5" />,
    Users: <Users className="h-5 w-5" />,
    Paintbrush: <Paintbrush className="h-5 w-5" />,
    Laptop: <Laptop className="h-5 w-5" />,
    Plane: <Plane className="h-5 w-5" />,
    Apple: <Apple className="h-5 w-5" />,
    Spa: <Spa className="h-5 w-5" />,
  };

  useEffect(() => {
    async function fetchCategoryItems() {
      if (category?.id && open) {
        setIsLoading(true);

        try {
          // Fetch tasks for this category
          const tasksResponse = await fetch(
            `/api/tasks?categoryId=${category.id}`,
          );

          if (tasksResponse.ok) {
            const tasksData = await tasksResponse.json();
            setTasks(tasksData);
          }

          // Fetch goals for this category
          const goalsResponse = await fetch(
            `/api/goals?categoryId=${category.id}`,
          );

          if (goalsResponse.ok) {
            const goalsData = await goalsResponse.json();
            setGoals(goalsData);
          }

          // Also fetch stats
          const statsResponse = await fetch(
            `/api/categories/${category.id}/stats`,
          );
          if (!statsResponse.ok) {
            throw new Error(
              `Failed to fetch category stats: ${statsResponse.status}`,
            );
          }
        } catch (error) {
          console.error("Error fetching category items:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchCategoryItems();
  }, [category, open]);

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: category.color, color: "white" }}
            >
              {iconMap[category.icon] || <Briefcase className="h-5 w-5" />}
            </div>
            <DialogTitle>{category.name}</DialogTitle>
          </div>
          <DialogDescription>
            Tasks and goals in this category
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Tasks in this category */}
          <div>
            <h3 className="mb-3 text-base font-medium">
              Tasks ({tasks.length})
            </h3>
            {isLoading ? (
              <div className="flex h-24 items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  Loading tasks...
                </p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="bg-muted/40 rounded border border-dashed p-4 text-center">
                <p className="text-muted-foreground text-sm">
                  No tasks in this category
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[180px] rounded border">
                <div className="p-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "mb-1 flex items-start gap-2 rounded p-2",
                        task.completed && "opacity-70",
                        "border-l-4",
                      )}
                      style={{ borderLeftColor: category.color }}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      ) : (
                        <Circle className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "truncate text-sm font-medium",
                            task.completed &&
                              "text-muted-foreground line-through",
                          )}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-muted-foreground truncate text-xs">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <span className="text-muted-foreground bg-muted rounded px-1.5 py-0.5 text-xs">
                        {task.frequency}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Goals in this category */}
          <div>
            <h3 className="mb-3 text-base font-medium">
              Goals ({goals.length})
            </h3>
            {isLoading ? (
              <div className="flex h-24 items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  Loading goals...
                </p>
              </div>
            ) : goals.length === 0 ? (
              <div className="bg-muted/40 rounded border border-dashed p-4 text-center">
                <p className="text-muted-foreground text-sm">
                  No goals in this category
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[180px] rounded border">
                <div className="p-2">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      className={cn(
                        "mb-1 flex items-start gap-2 rounded p-2",
                        goal.completed && "opacity-70",
                        "border-l-4",
                      )}
                      style={{ borderLeftColor: category.color }}
                    >
                      {goal.completed ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      ) : (
                        <Target className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "truncate text-sm font-medium",
                            goal.completed &&
                              "text-muted-foreground line-through",
                          )}
                        >
                          {goal.title}
                        </p>
                        <div className="mt-1 flex items-center gap-1">
                          <div className="bg-muted relative h-1.5 flex-1 overflow-hidden rounded-full">
                            <div
                              className={
                                goal.completed
                                  ? "absolute inset-y-0 left-0 rounded-full bg-green-500"
                                  : "absolute inset-y-0 left-0 rounded-full bg-blue-500"
                              }
                              style={{
                                width: `${Math.round((goal.progress / goal.total) * 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-muted-foreground text-xs">
                            {goal.progress}/{goal.total}
                          </span>
                        </div>
                      </div>
                      <span className="text-muted-foreground bg-muted rounded px-1.5 py-0.5 text-xs">
                        {goal.frequency}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
