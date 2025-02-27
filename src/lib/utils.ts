import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Category = {
  id: string
  name: string
  color: string
  icon: string
  priority: number
  order: number
}

export type Task = {
  id: string
  title: string
  description: string
  priority: number
  category: Category
  frequency: "daily" | "weekly" | "monthly"
  order: number
  completed: boolean
}

export type Goal = {
  id: string
  title: string
  description: string
  task: Task
  frequency: "daily" | "weekly" | "monthly"
  category: Category
  order: number
  progress: number
  total: number
}

export const defaultCategories: Category[] = [
  {
    id: "1",
    name: "Health",
    color: "#3498DB",
    icon: "Heart",
    priority: 1,
    order: 1,
  },
  {
    id: "2",
    name: "Fitness",
    color: "#E74C3C",
    icon: "Dumbbell",
    priority: 2,
    order: 2,
  },
  {
    id: "3",
    name: "Mindfulness",
    color: "#9B59B6",
    icon: "Lotus",
    priority: 3,
    order: 3,
  },
  {
    id: "4",
    name: "Work",
    color: "#34495E",
    icon: "Briefcase",
    priority: 4,
    order: 4,
  },
  {
    id: "5",
    name: "Personal Development",
    color: "#2ECC71",
    icon: "Book",
    priority: 5,
    order: 5,
  },
  {
    id: "6",
    name: "Education",
    color: "#F39C12",
    icon: "GraduationCap",
    priority: 6,
    order: 6,
  },
  {
    id: "7",
    name: "Finance",
    color: "#F1C40F",
    icon: "DollarSign",
    priority: 7,
    order: 7,
  },
  {
    id: "8",
    name: "Home",
    color: "#795548",
    icon: "Home",
    priority: 8,
    order: 8,
  },
  {
    id: "9",
    name: "Social",
    color: "#E91E63",
    icon: "Users",
    priority: 9,
    order: 9,
  },
  {
    id: "10",
    name: "Creativity",
    color: "#1ABC9C",
    icon: "Paintbrush",
    priority: 10,
    order: 10,
  },
  {
    id: "11",
    name: "Technology",
    color: "#003366",
    icon: "Laptop",
    priority: 11,
    order: 11,
  },
  {
    id: "12",
    name: "Travel",
    color: "#87CEEB",
    icon: "Plane",
    priority: 12,
    order: 12,
  },
  {
    id: "13",
    name: "Family",
    color: "#D7BDE2",
    icon: "Users",
    priority: 13,
    order: 13,
  },
  {
    id: "14",
    name: "Nutrition",
    color: "#CDDC39",
    icon: "Apple",
    priority: 14,
    order: 14,
  },
  {
    id: "15",
    name: "Self-Care",
    color: "#FFCBA4",
    icon: "Spa",
    priority: 15,
    order: 15,
  },
]

// Mock data for tasks
export const mockTasks: Task[] = [
  {
    id: "task1",
    title: "Morning Meditation",
    description: "15 minutes of mindfulness meditation",
    priority: 1,
    category: defaultCategories[2], // Mindfulness
    frequency: "daily",
    order: 1,
    completed: false,
  },
  {
    id: "task2",
    title: "Workout Session",
    description: "30 minutes of cardio and strength training",
    priority: 2,
    category: defaultCategories[1], // Fitness
    frequency: "daily",
    order: 2,
    completed: true,
  },
  {
    id: "task3",
    title: "Read a Book",
    description: "Read 30 pages of current book",
    priority: 3,
    category: defaultCategories[4], // Personal Development
    frequency: "daily",
    order: 3,
    completed: false,
  },
  {
    id: "task4",
    title: "Project Planning",
    description: "Plan weekly project milestones",
    priority: 1,
    category: defaultCategories[3], // Work
    frequency: "weekly",
    order: 1,
    completed: false,
  },
  {
    id: "task5",
    title: "Budget Review",
    description: "Review monthly expenses and budget",
    priority: 2,
    category: defaultCategories[6], // Finance
    frequency: "monthly",
    order: 1,
    completed: false,
  },
  {
    id: "task6",
    title: "Family Dinner",
    description: "Prepare and have dinner with family",
    priority: 1,
    category: defaultCategories[12], // Family
    frequency: "weekly",
    order: 2,
    completed: true,
  },
  {
    id: "task7",
    title: "Learn New Technology",
    description: "Spend 1 hour learning a new programming language",
    priority: 3,
    category: defaultCategories[10], // Technology
    frequency: "weekly",
    order: 3,
    completed: false,
  },
  {
    id: "task8",
    title: "Meal Prep",
    description: "Prepare meals for the week",
    priority: 2,
    category: defaultCategories[13], // Nutrition
    frequency: "weekly",
    order: 4,
    completed: true,
  },
  {
    id: "task9",
    title: "Home Cleaning",
    description: "Deep clean the house",
    priority: 3,
    category: defaultCategories[7], // Home
    frequency: "monthly",
    order: 2,
    completed: false,
  },
  {
    id: "task10",
    title: "Art Project",
    description: "Work on personal art project",
    priority: 4,
    category: defaultCategories[9], // Creativity
    frequency: "weekly",
    order: 5,
    completed: false,
  },
]

// Mock data for goals
export const mockGoals: Goal[] = [
  {
    id: "goal1",
    title: "Improve Mindfulness",
    description: "Practice meditation daily for a month",
    task: mockTasks[0], // Morning Meditation
    frequency: "daily",
    category: defaultCategories[2], // Mindfulness
    order: 1,
    progress: 18,
    total: 30,
  },
  {
    id: "goal2",
    title: "Get Fit",
    description: "Complete 20 workout sessions",
    task: mockTasks[1], // Workout Session
    frequency: "daily",
    category: defaultCategories[1], // Fitness
    order: 2,
    progress: 12,
    total: 20,
  },
  {
    id: "goal3",
    title: "Read More",
    description: "Finish 2 books this month",
    task: mockTasks[2], // Read a Book
    frequency: "daily",
    category: defaultCategories[4], // Personal Development
    order: 3,
    progress: 1,
    total: 2,
  },
  {
    id: "goal4",
    title: "Project Completion",
    description: "Complete current work project",
    task: mockTasks[3], // Project Planning
    frequency: "weekly",
    category: defaultCategories[3], // Work
    order: 1,
    progress: 2,
    total: 4,
  },
  {
    id: "goal5",
    title: "Save Money",
    description: "Save $500 this month",
    task: mockTasks[4], // Budget Review
    frequency: "monthly",
    category: defaultCategories[6], // Finance
    order: 1,
    progress: 300,
    total: 500,
  },
]

// Helper function to get icon component by name
export function getIconByName(name: string) {
  // This would be implemented to return the actual icon component
  return name
}

// Helper function to get tasks by frequency
export function getTasksByFrequency(frequency: "daily" | "weekly" | "monthly") {
  return mockTasks.filter((task) => task.frequency === frequency)
}

// Helper function to get goals by frequency
export function getGoalsByFrequency(frequency: "daily" | "weekly" | "monthly") {
  return mockGoals.filter((goal) => goal.frequency === frequency)
}

// Helper function to get tasks by category
export function getTasksByCategory(categoryId: string) {
  return mockTasks.filter((task) => task.category.id === categoryId)
}

// Helper function to get goals by category
export function getGoalsByCategory(categoryId: string) {
  return mockGoals.filter((goal) => goal.category.id === categoryId)
}

// Helper function to get completion data for charts
export function getCompletionData() {
  // This would be implemented to return actual completion data
  return {
    daily: [4, 6, 5, 7, 3, 5, 6],
    weekly: [18, 22, 20, 25, 19],
    streak: 12,
  }
}

