"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  format,
  startOfWeek,
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  getDay,
  isSameMonth,
  isSameDay,
  addWeeks,
} from "date-fns";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Star,
  Book,
  Coffee,
  Dumbbell,
  Brain,
  Heart,
  Briefcase,
  Calendar,
  Clock,
  Flame,
  BarChart3,
  Layers,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { cn } from "~/lib/utils";
import Link from "next/link";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

// This is a simplified interface just for this demo component
interface SimpleTask {
  title: string;
  completed: boolean;
  dueDate: Date;
  category?: string;
  priority?: number;
}

interface SimpleHabit {
  title: string;
  active: boolean;
  completed?: boolean;
  category?: string;
  streak?: number;
}

// Category definitions with colors and icons
const CATEGORIES = [
  {
    id: "work",
    name: "Work",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    borderColor: "border-blue-500",
    icon: Briefcase,
  },
  {
    id: "health",
    name: "Health",
    color: "bg-green-500",
    textColor: "text-green-500",
    borderColor: "border-green-500",
    icon: Heart,
  },
  {
    id: "learning",
    name: "Learning",
    color: "bg-purple-500",
    textColor: "text-purple-500",
    borderColor: "border-purple-500",
    icon: Book,
  },
  {
    id: "fitness",
    name: "Fitness",
    color: "bg-orange-500",
    textColor: "text-orange-500",
    borderColor: "border-orange-500",
    icon: Dumbbell,
  },
  {
    id: "personal",
    name: "Personal",
    color: "bg-red-500",
    textColor: "text-red-500",
    borderColor: "border-red-500",
    icon: Star,
  },
  {
    id: "mindfulness",
    name: "Mindfulness",
    color: "bg-sky-500",
    textColor: "text-sky-500",
    borderColor: "border-sky-500",
    icon: Brain,
  },
];

// Placeholder data for tasks and habits
const PLACEHOLDER_TASKS: SimpleTask[] = [
  {
    title: "Call client",
    completed: false,
    dueDate: new Date(new Date().setHours(0, 0, 0, 0)),
    category: "work",
    priority: 2,
  },
  {
    title: "Submit report",
    completed: true,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    category: "work",
    priority: 1,
  },
  {
    title: "Team meeting",
    completed: false,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    category: "work",
    priority: 3,
  },
  {
    title: "Gym session",
    completed: false,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    category: "fitness",
    priority: 2,
  },
  {
    title: "Read book chapter",
    completed: false,
    dueDate: new Date(new Date().setDate(new Date().getDate())),
    category: "learning",
    priority: 3,
  },
  {
    title: "Doctor appointment",
    completed: false,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    category: "health",
    priority: 1,
  },
  {
    title: "Weekly review",
    completed: false,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    category: "personal",
    priority: 2,
  },
  {
    title: "Monthly planning",
    completed: false,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    category: "personal",
    priority: 1,
  },
];

const PLACEHOLDER_HABITS: SimpleHabit[] = [
  {
    title: "Morning exercise",
    active: true,
    completed: true,
    category: "fitness",
    streak: 5,
  },
  {
    title: "Read for 30 minutes",
    active: true,
    completed: false,
    category: "learning",
    streak: 12,
  },
  {
    title: "Drink water",
    active: true,
    completed: true,
    category: "health",
    streak: 30,
  },
  {
    title: "Meditate",
    active: true,
    completed: false,
    category: "mindfulness",
    streak: 7,
  },
];

export function OverviewBoard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("weekly");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [dayViewPage, setDayViewPage] = useState(0);
  const [tasks, setTasks] = useState<SimpleTask[]>(PLACEHOLDER_TASKS);
  const [habits, setHabits] = useState<SimpleHabit[]>(PLACEHOLDER_HABITS);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [selectedItemForCategory, setSelectedItemForCategory] = useState<{
    type: "task" | "habit";
    index: number;
  } | null>(null);
  const [selectedDateForModal, setSelectedDateForModal] = useState<Date | null>(
    null,
  );
  const [showDayDetailModal, setShowDayDetailModal] = useState(false);

  // Helper function to toggle task/habit completion
  const toggleTaskCompletion = (index: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const toggleHabitCompletion = (index: number) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit, i) =>
        i === index ? { ...habit, completed: !habit.completed } : habit,
      ),
    );
  };

  // Handler for changing category
  const handleChangeCategory = (
    type: "task" | "habit",
    index: number,
    categoryId: string,
  ) => {
    if (type === "task") {
      setTasks((prevTasks) =>
        prevTasks.map((task, i) =>
          i === index ? { ...task, category: categoryId } : task,
        ),
      );
    } else {
      setHabits((prevHabits) =>
        prevHabits.map((habit, i) =>
          i === index ? { ...habit, category: categoryId } : habit,
        ),
      );
    }
  };

  const handleOpenCategoryDialog = (type: "task" | "habit", index: number) => {
    setSelectedItemForCategory({ type, index });
    setShowCategoryDialog(true);
  };

  // Get category information
  const getCategoryInfo = (categoryId?: string) => {
    const defaultCategory = {
      id: "default",
      name: "Default",
      color: "bg-gray-400",
      textColor: "text-gray-500",
      borderColor: "border-gray-400",
      icon: Calendar,
    };

    return categoryId
      ? CATEGORIES.find((c) => c.id === categoryId) || defaultCategory
      : defaultCategory;
  };

  // Weekly View Logic
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfCurrentWeek, i),
  );

  // Monthly View Logic
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });

  const calendarRows = useMemo(() => {
    const daysInMonth = [];
    let day = startDate;

    while (day <= monthEnd) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(day);
        day = addDays(day, 1);
      }
      daysInMonth.push(week);
    }

    return daysInMonth;
  }, [startDate, monthEnd]);

  // Daily View Logic
  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
    setDayViewPage(0);
  };

  const dayDates = useMemo(() => {
    if (selectedDay === null) return [];

    const today = new Date();
    const currentDayOfWeek = getDay(today);
    const daysUntilTargetDay = (selectedDay + 7 - currentDayOfWeek) % 7;

    const nearestDate = addDays(today, daysUntilTargetDay);

    return Array.from({ length: 10 }, (_, index) =>
      addWeeks(nearestDate, index + dayViewPage * 10),
    );
  }, [selectedDay, dayViewPage]);

  // Navigation Functions
  const goToPreviousWeek = () => setCurrentDate(subDays(currentDate, 7));
  const goToNextWeek = () => setCurrentDate(addDays(currentDate, 7));

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const goToPreviousDayPage = () =>
    setDayViewPage((prev) => Math.max(0, prev - 1));
  const goToNextDayPage = () => setDayViewPage((prev) => prev + 1);

  // Data Filtering Functions
  const getTasksForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return tasks.filter((task) => {
      const taskDate = task.dueDate;
      return format(taskDate, "yyyy-MM-dd") === dateStr;
    });
  };

  const getHabitsForDate = (date: Date) => {
    // All habits are shown for each day in this example
    return habits.filter((habit) => habit.active);
  };

  // Date Formatting
  const getFormattedWeekRange = () => {
    if (!weekDates.length || weekDates.length < 7) {
      return format(currentDate, "MMMM yyyy");
    }

    const firstDate = weekDates[0]!;
    const lastDate = weekDates[6]!;

    return `${format(firstDate, "MMM d")} - ${format(lastDate, "MMM d")}, ${format(currentDate, "yyyy")}`;
  };

  const getMonthYear = () => {
    return format(currentDate, "MMMM yyyy");
  };

  const getDayName = (day: number) => {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return dayNames[day] || "";
  };

  const weekRangeText = getFormattedWeekRange();
  const monthYearText = getMonthYear();

  // Task display component for weekly view
  const CompactTaskItem = ({
    task,
    index,
  }: {
    task: SimpleTask;
    index: number;
  }) => {
    const category = getCategoryInfo(task.category);

    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              "hover:bg-muted/50 flex w-full items-center gap-1.5 rounded-md p-1 transition-colors",
              task.completed ? "opacity-70" : "",
            )}
          >
            <div className="flex flex-shrink-0 items-center justify-center">
              {task.completed ? (
                <CheckCircle2
                  className={cn("h-3.5 w-3.5", category.textColor)}
                />
              ) : (
                <Circle className={cn("h-3.5 w-3.5", category.textColor)} />
              )}
            </div>
            <span className="min-w-0 flex-1 truncate text-xs leading-tight">
              {task.title}
            </span>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={() => toggleTaskCompletion(index)}>
            {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
          </ContextMenuItem>
          <ContextMenuItem>Edit Task</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => handleOpenCategoryDialog("task", index)}
          >
            Change Category
          </ContextMenuItem>
          <ContextMenuItem>Change Priority</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem className="text-red-500">
            Delete Task
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  // Habit display component for weekly view
  const CompactHabitItem = ({
    habit,
    index,
  }: {
    habit: SimpleHabit;
    index: number;
  }) => {
    const category = getCategoryInfo(habit.category);

    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              "hover:bg-muted/50 flex w-full items-center gap-1.5 rounded-md p-1 transition-colors",
              habit.completed ? "opacity-70" : "",
            )}
          >
            <div className="flex flex-shrink-0 items-center justify-center">
              {habit.completed ? (
                <CheckCircle2
                  className={cn("h-3.5 w-3.5", category.textColor)}
                />
              ) : (
                <Circle className={cn("h-3.5 w-3.5", category.textColor)} />
              )}
            </div>
            <span className="min-w-0 flex-1 truncate text-xs leading-tight">
              {habit.title}
            </span>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={() => toggleHabitCompletion(index)}>
            {habit.completed ? "Mark as Incomplete" : "Mark as Complete"}
          </ContextMenuItem>
          <ContextMenuItem>Edit Habit</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => handleOpenCategoryDialog("habit", index)}
          >
            Change Category
          </ContextMenuItem>
          <ContextMenuItem>View Streak</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem className="text-red-500">
            Delete Habit
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  // Handler for opening day detail modal
  const handleDayDetailOpen = (date: Date) => {
    setSelectedDateForModal(date);
    setShowDayDetailModal(true);
  };

  // Handler for adding a new task
  const handleAddNewTask = (date: Date) => {
    // This is a placeholder implementation - would connect to real task creation logic
    const newTask: SimpleTask = {
      title: "New Task",
      completed: false,
      dueDate: date,
      category: "personal",
      priority: 2,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  // Handler for adding a new habit
  const handleAddNewHabit = () => {
    // This is a placeholder implementation - would connect to real habit creation logic
    const newHabit: SimpleHabit = {
      title: "New Habit",
      active: true,
      completed: false,
      category: "personal",
      streak: 0,
    };

    setHabits((prevHabits) => [...prevHabits, newHabit]);
  };

  // Handler for deleting a task
  const handleDeleteTask = (index: number) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
    // In a real app, you'd likely call an API to delete the task
  };

  // Handler for deleting a habit
  const handleDeleteHabit = (index: number) => {
    setHabits((prevHabits) => prevHabits.filter((_, i) => i !== index));
    // In a real app, you'd likely call an API to delete the habit
  };

  // Day Detail Modal Component
  const DayDetailModal = () => {
    if (!selectedDateForModal) return null;

    const dayTasks = getTasksForDate(selectedDateForModal);
    const dayHabits = getHabitsForDate(selectedDateForModal);
    const formattedDate = format(selectedDateForModal, "EEEE, MMMM d, yyyy");

    return (
      <Dialog open={showDayDetailModal} onOpenChange={setShowDayDetailModal}>
        <DialogContent className="max-h-[95vh] w-[90vw] max-w-6xl overflow-y-auto p-6">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Manage your tasks and habits for this day
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-6 py-4">
            {/* Tasks Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-1 text-sm font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  Tasks
                </h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        onClick={() => handleAddNewTask(selectedDateForModal)}
                        className="h-6 w-6 rounded-full"
                        variant="outline"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span className="sr-only">Add Task</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p className="text-xs">Add New Task</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="w-full rounded-md border">
                {dayTasks.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {dayTasks.map((task, idx) => {
                      const category = getCategoryInfo(task.category);
                      const CategoryIcon = category.icon || Calendar;

                      return (
                        <div
                          key={idx}
                          className="hover:bg-muted/50 p-3 transition-colors"
                        >
                          <div className="flex w-full items-center">
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() =>
                                toggleTaskCompletion(
                                  tasks.findIndex(
                                    (t) =>
                                      t.title === task.title &&
                                      format(t.dueDate, "yyyy-MM-dd") ===
                                        format(
                                          selectedDateForModal,
                                          "yyyy-MM-dd",
                                        ),
                                  ),
                                )
                              }
                              className="mr-3 h-3.5 w-3.5 flex-shrink-0"
                            />
                            <div className="flex min-w-0 flex-grow items-center gap-2">
                              <CategoryIcon
                                className={cn(
                                  "h-3.5 w-3.5 flex-shrink-0",
                                  category.textColor,
                                )}
                              />
                              <span
                                className={cn(
                                  "truncate text-xs font-medium",
                                  task.completed &&
                                    "text-muted-foreground line-through",
                                )}
                              >
                                {task.title}
                              </span>
                            </div>

                            <div className="ml-auto flex flex-shrink-0 items-center gap-3">
                              {task.priority && (
                                <span className="flex items-center text-xs text-amber-600">
                                  {Array.from({ length: task.priority }).map(
                                    (_, i) => (
                                      <Star
                                        key={i}
                                        className="h-2.5 w-2.5 fill-current"
                                      />
                                    ),
                                  )}
                                </span>
                              )}

                              <span
                                className={cn(
                                  "rounded-full px-1.5 py-0.5 text-[10px]",
                                  category.color.replace(
                                    "bg-",
                                    "bg-opacity-20",
                                  ),
                                  category.textColor,
                                )}
                              >
                                {category.name}
                              </span>

                              <div className="ml-3 flex items-center gap-1">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                      >
                                        <Pencil className="h-3 w-3" />
                                        <span className="sr-only">Edit</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                      <p className="text-xs">Edit Task</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-red-500"
                                        onClick={() =>
                                          handleDeleteTask(
                                            tasks.findIndex(
                                              (t) =>
                                                t.title === task.title &&
                                                format(
                                                  t.dueDate,
                                                  "yyyy-MM-dd",
                                                ) ===
                                                  format(
                                                    selectedDateForModal,
                                                    "yyyy-MM-dd",
                                                  ),
                                            ),
                                          )
                                        }
                                      >
                                        <Trash2 className="h-3 w-3" />
                                        <span className="sr-only">Delete</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                      <p className="text-xs">Delete Task</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-muted-foreground flex flex-col items-center justify-center py-10 text-center">
                    <Calendar className="mb-1 h-8 w-8 opacity-20" />
                    <h4 className="text-xs font-medium">
                      No tasks for this day
                    </h4>
                    <p className="mt-0.5 text-[10px]">
                      Click the + button to add a task
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Habits Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-1 text-sm font-semibold">
                  <Heart className="h-4 w-4 text-red-500" />
                  Habits
                </h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        onClick={handleAddNewHabit}
                        className="h-6 w-6 rounded-full"
                        variant="outline"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span className="sr-only">Add Habit</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p className="text-xs">Add New Habit</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="w-full rounded-md border">
                {dayHabits.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {dayHabits.map((habit, idx) => {
                      const category = getCategoryInfo(habit.category);
                      const CategoryIcon = category.icon || Calendar;

                      return (
                        <div
                          key={idx}
                          className="hover:bg-muted/50 p-3 transition-colors"
                        >
                          <div className="flex w-full items-center">
                            <Checkbox
                              checked={habit.completed}
                              onCheckedChange={() => toggleHabitCompletion(idx)}
                              className="mr-3 h-3.5 w-3.5 flex-shrink-0"
                            />
                            <div className="flex min-w-0 flex-grow items-center gap-2">
                              <CategoryIcon
                                className={cn(
                                  "h-3.5 w-3.5 flex-shrink-0",
                                  category.textColor,
                                )}
                              />
                              <span
                                className={cn(
                                  "truncate text-xs font-medium",
                                  habit.completed &&
                                    "text-muted-foreground line-through",
                                )}
                              >
                                {habit.title}
                              </span>
                            </div>

                            <div className="ml-auto flex flex-shrink-0 items-center gap-3">
                              <span
                                className={cn(
                                  "rounded-full px-1.5 py-0.5 text-[10px]",
                                  category.color.replace(
                                    "bg-",
                                    "bg-opacity-20",
                                  ),
                                  category.textColor,
                                )}
                              >
                                {category.name}
                              </span>

                              {habit.streak && habit.streak > 0 && (
                                <span className="flex items-center text-[10px] text-orange-500">
                                  <Flame className="mr-0.5 h-3 w-3" />
                                  {habit.streak}
                                </span>
                              )}

                              <div className="ml-3 flex items-center gap-1">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                      >
                                        <Pencil className="h-3 w-3" />
                                        <span className="sr-only">Edit</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                      <p className="text-xs">Edit Habit</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-red-500"
                                        onClick={() => handleDeleteHabit(idx)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                        <span className="sr-only">Delete</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                      <p className="text-xs">Delete Habit</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-muted-foreground flex flex-col items-center justify-center py-10 text-center">
                    <Heart className="mb-1 h-8 w-8 opacity-20" />
                    <h4 className="text-xs font-medium">No habits tracked</h4>
                    <p className="mt-0.5 text-[10px]">
                      Click the + button to add a habit
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between pt-4">
            <div className="text-muted-foreground text-xs">
              Week {format(selectedDateForModal, "w")} •{" "}
              {format(selectedDateForModal, "MMMM yyyy")}
            </div>
            <Button
              variant="outline"
              className="h-7 text-xs"
              onClick={() => setShowDayDetailModal(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-2">
        <h1 className="text-xl font-bold">Overview</h1>
      </div>

      {showDayDetailModal && selectedDateForModal && <DayDetailModal />}

      {/* Simple Category Selection Dialog */}
      {showCategoryDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background w-64 rounded-lg p-4 shadow-lg">
            <h3 className="mb-2 text-sm font-medium">Select Category</h3>
            <div className="mb-4 grid grid-cols-1 gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  className="hover:bg-muted flex items-center gap-2 rounded-md p-2 text-xs"
                  onClick={() => {
                    if (selectedItemForCategory) {
                      handleChangeCategory(
                        selectedItemForCategory.type,
                        selectedItemForCategory.index,
                        category.id,
                      );
                    }
                    setShowCategoryDialog(false);
                  }}
                >
                  <div
                    className={`h-3 w-3 rounded-full ${category.color}`}
                  ></div>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                className="rounded bg-gray-200 px-3 py-1 text-xs text-gray-800 hover:bg-gray-300"
                onClick={() => setShowCategoryDialog(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Tabs
        defaultValue="weekly"
        value={view}
        onValueChange={setView}
        className="w-full"
      >
        <div className="mb-1 flex items-center justify-between">
          {/* Tab Menu - Always visible */}
          <div>
            <TabsList className="grid h-7 w-[200px] grid-cols-3 rounded-lg">
              <TabsTrigger value="daily" className="text-xs">
                Daily
              </TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs">
                Weekly
              </TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs">
                Monthly
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Date Navigation Controls */}
          <div className="flex items-center justify-end">
            {view === "daily" && selectedDay !== null ? (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPreviousDayPage}
                  disabled={dayViewPage === 0}
                  className="h-6 w-6"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <span className="mx-1 text-xs font-medium">
                  {dayViewPage + 1}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextDayPage}
                  className="h-6 w-6"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            ) : view === "weekly" ? (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPreviousWeek}
                  className="h-6 w-6"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <span className="mx-1 text-xs font-medium">
                  {weekRangeText}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextWeek}
                  className="h-6 w-6"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            ) : view === "monthly" ? (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPreviousMonth}
                  className="h-6 w-6"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <span className="mx-1 text-xs font-medium">
                  {monthYearText}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextMonth}
                  className="h-6 w-6"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Day Selection Buttons - Only show for daily view */}
        {view === "daily" && (
          <div className="mb-1 flex justify-start gap-1">
            {[1, 2, 3, 4, 5, 6, 0].map((day) => (
              <Button
                key={day}
                variant={selectedDay === day ? "default" : "outline"}
                onClick={() => handleDaySelect(day)}
                className="h-6 text-xs"
                size="sm"
              >
                {getDayName(day).substring(0, 3)}
              </Button>
            ))}
          </div>
        )}

        {/* Daily View - Multiple instances of the same day */}
        <TabsContent value="daily" className="mt-0">
          {selectedDay === null ? (
            <div className="text-muted-foreground w-full py-4 text-center text-sm">
              Select a day of the week to view upcoming occurrences
            </div>
          ) : (
            <div className="grid w-full gap-3">
              {dayDates.map((date, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="bg-muted flex items-center justify-between px-4 py-2 text-sm font-medium">
                    <span>{format(date, "EEEE, MMMM d, yyyy")}</span>
                    <span className="text-muted-foreground text-xs">
                      Week {format(date, "w")}
                    </span>
                  </div>
                  <CardContent className="p-3">
                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <h3 className="mb-2 flex items-center text-sm font-bold">
                          <Heart className="mr-1 h-3.5 w-3.5 text-red-400" />
                          Habits
                        </h3>
                        <div className="mb-2 border-b border-gray-200"></div>
                        <ul className="space-y-1">
                          {getHabitsForDate(date).map((habit, idx) => {
                            const category = getCategoryInfo(habit.category);
                            const CategoryIcon = category.icon || Calendar;

                            return (
                              <li
                                key={idx}
                                className="flex items-center gap-2 py-1"
                              >
                                <Checkbox
                                  id={`habit-${date.getTime()}-${idx}`}
                                  checked={habit.completed}
                                  onCheckedChange={() =>
                                    toggleHabitCompletion(idx)
                                  }
                                  className="h-3.5 w-3.5 rounded-sm"
                                />
                                <div
                                  className={cn(
                                    "h-2 w-2 rounded-full",
                                    category.color,
                                  )}
                                ></div>
                                <CategoryIcon
                                  className={cn(
                                    "h-3.5 w-3.5",
                                    category.textColor,
                                  )}
                                />
                                <ContextMenu>
                                  <ContextMenuTrigger className="flex-1">
                                    <span className="text-xs">
                                      {habit.title}
                                    </span>
                                  </ContextMenuTrigger>
                                  <ContextMenuContent className="w-48">
                                    <ContextMenuItem
                                      onClick={() => toggleHabitCompletion(idx)}
                                    >
                                      {habit.completed
                                        ? "Mark as Incomplete"
                                        : "Mark as Complete"}
                                    </ContextMenuItem>
                                    <ContextMenuItem>
                                      Edit Habit
                                    </ContextMenuItem>
                                    <ContextMenuSeparator />
                                    <ContextMenuItem
                                      onClick={() =>
                                        handleOpenCategoryDialog("habit", idx)
                                      }
                                    >
                                      Change Category
                                    </ContextMenuItem>
                                    <ContextMenuItem>
                                      View Streak
                                    </ContextMenuItem>
                                    <ContextMenuSeparator />
                                    <ContextMenuItem className="text-red-500">
                                      Delete Habit
                                    </ContextMenuItem>
                                  </ContextMenuContent>
                                </ContextMenu>
                                {habit.streak && habit.streak > 0 && (
                                  <span className="text-muted-foreground ml-auto flex items-center text-[10px]">
                                    <Flame className="mr-0.5 h-3 w-3 text-orange-500" />
                                    {habit.streak}
                                  </span>
                                )}
                              </li>
                            );
                          })}
                          {getHabitsForDate(date).length === 0 && (
                            <li className="text-muted-foreground py-1 text-xs">
                              No habits active
                            </li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <h3 className="mb-2 flex items-center text-sm font-bold">
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-blue-400" />
                          Tasks
                        </h3>
                        <div className="mb-2 border-b border-gray-200"></div>
                        <ul className="space-y-1">
                          {getTasksForDate(date).map((task, idx) => {
                            const category = getCategoryInfo(task.category);

                            return (
                              <li
                                key={idx}
                                className="flex items-center gap-2 py-1"
                              >
                                <Checkbox
                                  id={`task-${date.getTime()}-${idx}`}
                                  checked={task.completed}
                                  onCheckedChange={() =>
                                    toggleTaskCompletion(idx)
                                  }
                                  className="h-3.5 w-3.5 rounded-sm"
                                />
                                <div
                                  className={cn(
                                    "h-2 w-2 rounded-full",
                                    category.color,
                                  )}
                                ></div>
                                <ContextMenu>
                                  <ContextMenuTrigger className="flex-1">
                                    <span
                                      className={cn(
                                        "text-xs",
                                        task.completed &&
                                          "text-muted-foreground line-through",
                                      )}
                                    >
                                      {task.title}
                                    </span>
                                  </ContextMenuTrigger>
                                  <ContextMenuContent className="w-48">
                                    <ContextMenuItem
                                      onClick={() =>
                                        toggleTaskCompletion(
                                          tasks.findIndex(
                                            (t) =>
                                              t.title === task.title &&
                                              format(
                                                t.dueDate,
                                                "yyyy-MM-dd",
                                              ) === format(date, "yyyy-MM-dd"),
                                          ),
                                        )
                                      }
                                    >
                                      {task.completed
                                        ? "Mark as Incomplete"
                                        : "Mark as Complete"}
                                    </ContextMenuItem>
                                    <ContextMenuItem>Edit Task</ContextMenuItem>
                                    <ContextMenuSeparator />
                                    <ContextMenuItem
                                      onClick={() => {
                                        const taskIndex = tasks.findIndex(
                                          (t) =>
                                            t.title === task.title &&
                                            format(t.dueDate, "yyyy-MM-dd") ===
                                              format(date, "yyyy-MM-dd"),
                                        );
                                        handleOpenCategoryDialog(
                                          "task",
                                          taskIndex,
                                        );
                                      }}
                                    >
                                      Change Category
                                    </ContextMenuItem>
                                    <ContextMenuItem>
                                      Change Priority
                                    </ContextMenuItem>
                                    <ContextMenuSeparator />
                                    <ContextMenuItem className="text-red-500">
                                      Delete Task
                                    </ContextMenuItem>
                                  </ContextMenuContent>
                                </ContextMenu>
                                {task.priority && (
                                  <div className="ml-auto flex items-center">
                                    {Array.from({ length: task.priority }).map(
                                      (_, i) => (
                                        <Star
                                          key={i}
                                          className="h-2.5 w-2.5 fill-amber-400 text-amber-400"
                                        />
                                      ),
                                    )}
                                  </div>
                                )}
                              </li>
                            );
                          })}
                          {getTasksForDate(date).length === 0 && (
                            <li className="text-muted-foreground py-1 text-xs">
                              No tasks scheduled
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Pagination at the bottom of content */}
              <div className="mt-2 flex items-center justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousDayPage}
                  disabled={dayViewPage === 0}
                  className="h-7"
                >
                  Previous Page
                </Button>
                <span className="mx-2 text-xs font-medium">
                  Page {dayViewPage + 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextDayPage}
                  className="h-7"
                >
                  Next Page
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Weekly View - Calendar with 7 columns */}
        <TabsContent value="weekly" className="mt-0">
          <div className="grid w-full grid-cols-7 gap-1.5">
            {weekDates.map((date, index) => (
              <div key={index} className="flex w-full flex-col">
                <div className="mb-2 text-center">
                  <div
                    className={cn(
                      "rounded-md py-1 text-xs font-medium",
                      isSameDay(date, new Date()) &&
                        "bg-primary text-primary-foreground mb-1.5",
                    )}
                  >
                    {format(date, "EEE")}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {format(date, "MMM d")}
                  </div>
                </div>
                <Card className="h-full min-h-[350px] w-full flex-1 overflow-hidden">
                  <CardContent className="flex h-full flex-col p-1.5 sm:p-2">
                    <div className="mb-3">
                      <h3 className="mb-1.5 flex items-center text-xs font-bold">
                        <Heart className="mr-1 h-3.5 w-3.5 flex-shrink-0 text-red-400" />
                        Habits
                      </h3>
                      <div className="mb-1.5 border-b border-gray-100"></div>
                      <ul className="-mx-1 space-y-0.5">
                        {getHabitsForDate(date).map((habit, idx) => (
                          <li key={idx} className="py-0.5">
                            <CompactHabitItem habit={habit} index={idx} />
                          </li>
                        ))}
                        {getHabitsForDate(date).length === 0 && (
                          <li className="text-muted-foreground p-0.5 text-[10px]">
                            No habits
                          </li>
                        )}
                      </ul>
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1.5 flex items-center text-xs font-bold">
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5 flex-shrink-0 text-blue-400" />
                        Tasks
                      </h3>
                      <div className="mb-1.5 border-b border-gray-100"></div>
                      <ul className="-mx-1 space-y-0.5">
                        {getTasksForDate(date).map((task, idx) => (
                          <li key={idx} className="py-0.5">
                            <CompactTaskItem task={task} index={idx} />
                          </li>
                        ))}
                        {getTasksForDate(date).length === 0 && (
                          <li className="text-muted-foreground p-0.5 text-[10px]">
                            No tasks
                          </li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Monthly View - Full Calendar */}
        <TabsContent value="monthly" className="mt-0">
          <div className="rounded-lg border">
            <div className="bg-muted grid grid-cols-7 gap-px">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div
                  key={day}
                  className="bg-background p-1 text-center text-xs font-medium"
                >
                  {day}
                </div>
              ))}

              {calendarRows.map((week, weekIndex) => (
                <React.Fragment key={weekIndex}>
                  {week.map((day, dayIndex) => {
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isToday = isSameDay(day, new Date());
                    const dayTasks = getTasksForDate(day);
                    const dayHabits = getHabitsForDate(day);

                    return (
                      <div
                        key={dayIndex}
                        className={cn(
                          "bg-background min-h-[80px] p-1 transition-colors",
                          !isCurrentMonth &&
                            "text-muted-foreground bg-muted/10",
                          isToday && "bg-primary/5 border-primary/20 border",
                        )}
                        onDoubleClick={() =>
                          isCurrentMonth && handleDayDetailOpen(day)
                        }
                      >
                        <div className="flex items-start justify-between">
                          <span
                            className={cn(
                              "flex h-5 w-5 items-center justify-center text-xs font-medium",
                              isToday &&
                                "bg-primary text-primary-foreground rounded-full",
                            )}
                          >
                            {format(day, "d")}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {dayTasks.length > 0 && (
                              <span className="flex items-center rounded-sm bg-blue-100 px-1 text-[10px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                <CheckCircle2 className="mr-0.5 h-2 w-2" />
                                {dayTasks.length}
                              </span>
                            )}
                            {dayHabits.length > 0 && (
                              <span className="flex items-center rounded-sm bg-red-100 px-1 text-[10px] font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                <Heart className="mr-0.5 h-2 w-2" />
                                {dayHabits.length}
                              </span>
                            )}
                          </div>
                        </div>

                        {isCurrentMonth && (
                          <div className="mt-1 space-y-1">
                            {/* Tasks */}
                            {dayTasks.slice(0, 3).map((task, idx) => {
                              const category = getCategoryInfo(task.category);
                              return (
                                <ContextMenu key={`task-${idx}`}>
                                  <ContextMenuTrigger>
                                    <div className="flex items-center gap-0.5 text-[10px] leading-tight">
                                      <div
                                        className={cn(
                                          "h-1.5 w-1.5 flex-shrink-0 rounded-full",
                                          category.color,
                                        )}
                                      />
                                      <span
                                        className={cn(
                                          "truncate",
                                          task.completed &&
                                            "line-through opacity-60",
                                        )}
                                      >
                                        {task.title}
                                      </span>
                                    </div>
                                  </ContextMenuTrigger>
                                  <ContextMenuContent className="w-48">
                                    <ContextMenuItem
                                      onClick={() =>
                                        toggleTaskCompletion(
                                          tasks.findIndex(
                                            (t) =>
                                              t.title === task.title &&
                                              format(
                                                t.dueDate,
                                                "yyyy-MM-dd",
                                              ) === format(day, "yyyy-MM-dd"),
                                          ),
                                        )
                                      }
                                    >
                                      {task.completed
                                        ? "Mark as Incomplete"
                                        : "Mark as Complete"}
                                    </ContextMenuItem>
                                    <ContextMenuItem>Edit Task</ContextMenuItem>
                                    <ContextMenuSeparator />
                                    <ContextMenuItem
                                      onClick={() => {
                                        const taskIndex = tasks.findIndex(
                                          (t) =>
                                            t.title === task.title &&
                                            format(t.dueDate, "yyyy-MM-dd") ===
                                              format(day, "yyyy-MM-dd"),
                                        );
                                        handleOpenCategoryDialog(
                                          "task",
                                          taskIndex,
                                        );
                                      }}
                                    >
                                      Change Category
                                    </ContextMenuItem>
                                    <ContextMenuItem>
                                      Change Priority
                                    </ContextMenuItem>
                                    <ContextMenuSeparator />
                                    <ContextMenuItem className="text-red-500">
                                      Delete Task
                                    </ContextMenuItem>
                                  </ContextMenuContent>
                                </ContextMenu>
                              );
                            })}

                            {/* Show more indicator if needed */}
                            {(dayTasks.length > 3 ||
                              (dayTasks.length > 0 &&
                                dayHabits.length > 0)) && (
                              <div className="text-muted-foreground text-[10px]">
                                + more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
