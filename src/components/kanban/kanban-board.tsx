"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import {
  defaultCategories,
  getGoalsByCategory,
  getGoalsByFrequency,
  getTasksByCategory,
  getTasksByFrequency,
} from "~/lib/utils"
import { useState } from "react"
import { KanbanColumn } from "./kanban-column"

interface KanbanBoardProps {
  viewType: "frequency" | "category"
}

export function KanbanBoard({ viewType }: KanbanBoardProps) {
  const [filter, setFilter] = useState<string>("all")

  const renderFrequencyView = () => {
    const dailyTasks = getTasksByFrequency("daily")
    const weeklyTasks = getTasksByFrequency("weekly")
    const monthlyTasks = getTasksByFrequency("monthly")

    const dailyGoals = getGoalsByFrequency("daily")
    const weeklyGoals = getGoalsByFrequency("weekly")
    const monthlyGoals = getGoalsByFrequency("monthly")

    // Filter by category if a filter is selected
    const filteredDailyTasks = filter === "all" ? dailyTasks : dailyTasks.filter((task) => task.category.id === filter)
    const filteredWeeklyTasks =
      filter === "all" ? weeklyTasks : weeklyTasks.filter((task) => task.category.id === filter)
    const filteredMonthlyTasks =
      filter === "all" ? monthlyTasks : monthlyTasks.filter((task) => task.category.id === filter)

    const filteredDailyGoals = filter === "all" ? dailyGoals : dailyGoals.filter((goal) => goal.category.id === filter)
    const filteredWeeklyGoals =
      filter === "all" ? weeklyGoals : weeklyGoals.filter((goal) => goal.category.id === filter)
    const filteredMonthlyGoals =
      filter === "all" ? monthlyGoals : monthlyGoals.filter((goal) => goal.category.id === filter)

    return (
      <div className="kanban-container flex space-x-4 pb-4">
        <KanbanColumn title="Daily" tasks={filteredDailyTasks} goals={filteredDailyGoals} />
        <KanbanColumn title="Weekly" tasks={filteredWeeklyTasks} goals={filteredWeeklyGoals} />
        <KanbanColumn title="Monthly" tasks={filteredMonthlyTasks} goals={filteredMonthlyGoals} />
      </div>
    )
  }

  const renderCategoryView = () => {
    // Filter by frequency if a filter is selected
    const frequencyFilter = filter === "all" ? null : (filter as "daily" | "weekly" | "monthly")

    return (
      <div className="kanban-container flex space-x-4 pb-4">
        {defaultCategories.map((category) => {
          const categoryTasks = getTasksByCategory(category.id)
          const categoryGoals = getGoalsByCategory(category.id)

          // Apply frequency filter if selected
          const filteredTasks = frequencyFilter
            ? categoryTasks.filter((task) => task.frequency === frequencyFilter)
            : categoryTasks
          const filteredGoals = frequencyFilter
            ? categoryGoals.filter((goal) => goal.frequency === frequencyFilter)
            : categoryGoals

          // Only show categories that have tasks or goals after filtering
          if (filteredTasks.length === 0 && filteredGoals.length === 0) {
            return null
          }

          return (
            <KanbanColumn
              key={category.id}
              title={category.name}
              color={category.color}
              tasks={filteredTasks}
              goals={filteredGoals}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {viewType === "frequency" ? "Tasks by Frequency" : "Tasks by Category"}
        </h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All {viewType === "frequency" ? "Categories" : "Frequencies"}</SelectItem>
            {viewType === "frequency" ? (
              // Show category filters for frequency view
              defaultCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))
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
      </div>

      {viewType === "frequency" ? renderFrequencyView() : renderCategoryView()}
    </div>
  )
}

