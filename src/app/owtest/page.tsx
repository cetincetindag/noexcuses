"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"

interface HabitProgress {
  name: string
  progress: number
  color: string
}

const habitProgress: HabitProgress[] = [
  { name: "Reading", progress: 80, color: "bg-blue-500" },
  { name: "Exercise", progress: 60, color: "bg-green-500" },
  { name: "Meditation", progress: 40, color: "bg-purple-500" },
  { name: "Coding", progress: 70, color: "bg-red-500" },
  { name: "Journaling", progress: 50, color: "bg-yellow-500" },
]

export default function OverallProgressGraph() {
  const [hoveredHabit, setHoveredHabit] = useState<HabitProgress | null>(null)
  
  // Calculate total for progress percentage scaling
  const totalProgress = habitProgress.reduce((sum, habit) => sum + habit.progress, 0)
  const averageProgress = totalProgress / habitProgress.length
  
  // Normalize to 100% max
  const maxProgress = 100 * habitProgress.length
  const normalizedTotal = Math.min(totalProgress, maxProgress)
  const scaleFactor = normalizedTotal / totalProgress
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <TooltipProvider>
            <div className="h-8 w-full bg-gray-200 rounded-full overflow-hidden flex">
              {habitProgress.map((habit, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div
                      className={`h-full ${habit.color} cursor-pointer transition-all duration-200 hover:brightness-110`}
                      style={{ width: `${(habit.progress / maxProgress) * 100}%` }}
                      onMouseEnter={() => setHoveredHabit(habit)}
                      onMouseLeave={() => setHoveredHabit(null)}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <div>
                      <p className="font-bold">{habit.name}</p>
                      <p>Progress: {habit.progress}%</p>
                      <p className="text-xs text-muted-foreground">
                        {((habit.progress / totalProgress) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
          
          <div className="flex justify-between items-center text-sm">
            <div className="text-muted-foreground">Average Progress: {averageProgress.toFixed(0)}%</div>
            <div className="text-muted-foreground">Total: {(totalProgress / maxProgress * 100).toFixed(0)}% completed</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm mt-2">
            {habitProgress.map((habit, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${habit.color}`} />
                <span>
                  {habit.name}: {habit.progress}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}