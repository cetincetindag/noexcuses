import { Badge } from "~/components/ui/badge"
import type { Goal } from "~/lib/utils"
import { Target } from "lucide-react"

interface GoalCardProps {
  goal: Goal
}

export function GoalCard({ goal }: GoalCardProps) {
  const progressPercentage = Math.round((goal.progress / goal.total) * 100)

  return (
    <div
      className="task-card flex flex-col gap-2 rounded-md border p-3"
      style={{
        borderLeftWidth: "4px",
        borderLeftColor: goal.category.color,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-500" />
          <span className="font-medium">{goal.title}</span>
        </div>
        <Badge
          variant="outline"
          className="ml-auto"
          style={{
            backgroundColor: `${goal.category.color}20`,
            color: goal.category.color,
          }}
        >
          {goal.category.name}
        </Badge>
      </div>
      {goal.description && <p className="text-xs text-muted-foreground">{goal.description}</p>}
      <div className="flex items-center gap-2">
        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-secondary">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[#3b82f6]"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="text-xs font-medium">
          {goal.progress}/{goal.total}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Linked to: {goal.task.title}</span>
        <span>{goal.frequency}</span>
      </div>
    </div>
  )
}

