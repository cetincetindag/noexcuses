import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Category = {
  id?: string;
  name: string;
  color: string;
  icon: string;
  priority: number;
  order: number;
};

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: number;
  category: Category;
  frequency: string;
  order: number;
  completed: boolean;
  userId?: string; // Add userId as optional for debugging
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  targetCompletions: number;
  completedToday: number;
  isCompletedToday: boolean;
  active: boolean;
  dailyStreak: number;
  longestStreak: number;
  category: Category;
  color?: string;
  userId?: string; // Add userId as optional for debugging
}

export interface Routine {
  id: string;
  title: string;
  description?: string;
  frequency: string;
  isCompletedToday: boolean;
  streak: number;
  lastCompletedAt?: string;
  color?: string;
  category: Category;
  tasks?: Task[];
  habits?: Habit[];
  userId?: string;
}

export type Goal = {
  id: string;
  title: string;
  description?: string;
  priority: number;
  order: number;
  progress: number;
  total: number;
  frequency: string;
  completed?: boolean;
  category: Category;
  task: Task;
};

export const defaultCategories: Category[] = [
  {
    name: "Health",
    color: "#3498DB",
    icon: "Heart",
    priority: 1,
    order: 1,
  },
  {
    name: "Fitness",
    color: "#E74C3C",
    icon: "Dumbbell",
    priority: 2,
    order: 2,
  },
  {
    name: "Mindfulness",
    color: "#9B59B6",
    icon: "Lotus",
    priority: 3,
    order: 3,
  },
  {
    name: "Work",
    color: "#34495E",
    icon: "Briefcase",
    priority: 4,
    order: 4,
  },
  {
    name: "Personal Development",
    color: "#2ECC71",
    icon: "Book",
    priority: 5,
    order: 5,
  },
  {
    name: "Education",
    color: "#F39C12",
    icon: "GraduationCap",
    priority: 6,
    order: 6,
  },
  {
    name: "Finance",
    color: "#F1C40F",
    icon: "DollarSign",
    priority: 7,
    order: 7,
  },
  {
    name: "Home",
    color: "#795548",
    icon: "Home",
    priority: 8,
    order: 8,
  },
  {
    name: "Social",
    color: "#E91E63",
    icon: "Users",
    priority: 9,
    order: 9,
  },
  {
    name: "Creativity",
    color: "#1ABC9C",
    icon: "Paintbrush",
    priority: 10,
    order: 10,
  },
  {
    name: "Technology",
    color: "#003366",
    icon: "Laptop",
    priority: 11,
    order: 11,
  },
  {
    name: "Travel",
    color: "#87CEEB",
    icon: "Plane",
    priority: 12,
    order: 12,
  },
  {
    name: "Family",
    color: "#D7BDE2",
    icon: "Users",
    priority: 13,
    order: 13,
  },
  {
    name: "Nutrition",
    color: "#CDDC39",
    icon: "Apple",
    priority: 14,
    order: 14,
  },
  {
    name: "Self-Care",
    color: "#FFCBA4",
    icon: "Spa",
    priority: 15,
    order: 15,
  },
];

// Mock data for tasks
export const mockTasks: Task[] = [
  {
    id: "task1",
    title: "Morning Meditation",
    description: "15 minutes of mindfulness meditation",
    priority: 1,
    category: {
      name: "Mindfulness",
      color: "#9B59B6",
      icon: "Lotus",
      priority: 3,
      order: 3,
    },
    frequency: "daily",
    order: 1,
    completed: false,
  },
  {
    id: "task2",
    title: "Workout Session",
    description: "30 minutes of cardio and strength training",
    priority: 2,
    category: {
      name: "Fitness",
      color: "#E74C3C",
      icon: "Dumbbell",
      priority: 2,
      order: 2,
    },
    frequency: "daily",
    order: 2,
    completed: true,
  },
  {
    id: "task3",
    title: "Read a Book",
    description: "Read 30 pages of current book",
    priority: 3,
    category: {
      name: "Personal Development",
      color: "#2ECC71",
      icon: "Book",
      priority: 5,
      order: 5,
    },
    frequency: "daily",
    order: 3,
    completed: false,
  },
  {
    id: "task4",
    title: "Project Planning",
    description: "Plan weekly project milestones",
    priority: 1,
    category: {
      name: "Work",
      color: "#34495E",
      icon: "Briefcase",
      priority: 4,
      order: 4,
    },
    frequency: "weekly",
    order: 1,
    completed: false,
  },
  {
    id: "task5",
    title: "Budget Review",
    description: "Review monthly expenses and budget",
    priority: 2,
    category: {
      name: "Finance",
      color: "#F1C40F",
      icon: "DollarSign",
      priority: 7,
      order: 7,
    },
    frequency: "monthly",
    order: 1,
    completed: false,
  },
  {
    id: "task6",
    title: "Family Dinner",
    description: "Prepare and have dinner with family",
    priority: 1,
    category: {
      name: "Family",
      color: "#D7BDE2",
      icon: "Users",
      priority: 13,
      order: 13,
    },
    frequency: "weekly",
    order: 2,
    completed: true,
  },
  {
    id: "task7",
    title: "Learn New Technology",
    description: "Spend 1 hour learning a new programming language",
    priority: 3,
    category: {
      name: "Technology",
      color: "#003366",
      icon: "Laptop",
      priority: 11,
      order: 11,
    },
    frequency: "weekly",
    order: 3,
    completed: false,
  },
  {
    id: "task8",
    title: "Meal Prep",
    description: "Prepare meals for the week",
    priority: 2,
    category: {
      name: "Nutrition",
      color: "#CDDC39",
      icon: "Apple",
      priority: 14,
      order: 14,
    },
    frequency: "weekly",
    order: 4,
    completed: true,
  },
  {
    id: "task9",
    title: "Home Cleaning",
    description: "Deep clean the house",
    priority: 3,
    category: defaultCategories[7] as Category, // Home
    frequency: "monthly",
    order: 2,
    completed: false,
  },
  {
    id: "task10",
    title: "Art Project",
    description: "Work on personal art project",
    priority: 4,
    category: defaultCategories[9] as Category, // Creativity
    frequency: "weekly",
    order: 5,
    completed: false,
  },
];

// Mock data for goals
export const mockGoals: Goal[] = [
  {
    id: "goal1",
    title: "Improve Mindfulness",
    description: "Practice meditation daily for a month",
    priority: 1,
    task: mockTasks[0] as Task, // Morning Meditation
    frequency: "daily",
    category: defaultCategories[2] as Category, // Mindfulness
    order: 1,
    progress: 18,
    total: 30,
    completed: false,
  },
  {
    id: "goal2",
    title: "Get Fit",
    description: "Complete 20 workout sessions",
    priority: 2,
    task: mockTasks[1] as Task, // Workout Session
    frequency: "daily",
    category: defaultCategories[1] as Category, // Fitness
    order: 2,
    progress: 12,
    total: 20,
    completed: false,
  },
  {
    id: "goal3",
    title: "Read More",
    description: "Finish 2 books this month",
    priority: 3,
    task: mockTasks[2] as Task, // Read a Book
    frequency: "daily",
    category: defaultCategories[4] as Category, // Personal Development
    order: 3,
    progress: 1,
    total: 2,
    completed: false,
  },
  {
    id: "goal4",
    title: "Project Completion",
    description: "Complete current work project",
    priority: 4,
    task: mockTasks[3] as Task, // Project Planning
    frequency: "weekly",
    category: defaultCategories[3] as Category, // Work
    order: 1,
    progress: 2,
    total: 4,
    completed: false,
  },
  {
    id: "goal5",
    title: "Save Money",
    description: "Save $500 this month",
    priority: 5,
    task: mockTasks[4] as Task, // Budget Review
    frequency: "monthly",
    category: defaultCategories[6] as Category, // Finance
    order: 1,
    progress: 300,
    total: 500,
    completed: false,
  },
];

// Helper function to get icon component by name
export function getIconByName(name: string) {
  // This would be implemented to return the actual icon component
  return name;
}

// Helper function to get tasks by frequency
export function getTasksByFrequency(frequency: "daily" | "weekly" | "monthly") {
  return mockTasks.filter((task) => task.frequency === frequency);
}

// Helper function to get goals by frequency
export function getGoalsByFrequency(frequency: "daily" | "weekly" | "monthly") {
  return mockGoals.filter((goal) => goal.frequency === frequency);
}

// Helper function to get tasks by category
export function getTasksByCategory(categoryName: string) {
  return mockTasks.filter((task) => task.category.name === categoryName);
}

// Helper function to get goals by category
export function getGoalsByCategory(categoryName: string) {
  return mockGoals.filter((goal) => goal.category.name === categoryName);
}

// Helper function to get completion data for charts
export function getCompletionData() {
  // This would be implemented to return actual completion data
  return {
    daily: [4, 6, 5, 7, 3, 5, 6],
    weekly: [18, 22, 20, 25, 19],
    streak: 12,
  };
}

// Helper functions for type safety
export function safeString(value: any): string {
  if (value === undefined || value === null) {
    return "";
  }
  return String(value);
}
