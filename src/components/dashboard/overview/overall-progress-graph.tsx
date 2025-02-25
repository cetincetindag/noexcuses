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

export function OverallProgressGraph() {
  const [hoveredHabit, setHoveredHabit] = useState<HabitProgress | null>(null)
  const totalProgress = habitProgress.reduce((sum, habit) => sum + habit.progress, 0) / habitProgress.length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-8 w-full bg-gray-200 rounded-full overflow-hidden">
                  {habitProgress.map((habit, index) => (
                    <div
                      key={index}
                      className={`h-full ${habit.color} inline-block`}
                      style={{ width: `${habit.progress}%` }}
                      onMouseEnter={() => setHoveredHabit(habit)}
                      onMouseLeave={() => setHoveredHabit(null)}
                    />
                  ))}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {hoveredHabit ? (
                  <div>
                    <p className="font-bold">{hoveredHabit.name}</p>
                    <p>Progress: {hoveredHabit.progress}%</p>
                  </div>
                ) : (
                  <p>Hover over a section to see details</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="text-sm text-muted-foreground">Total Progress: {totalProgress.toFixed(0)}%</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
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


