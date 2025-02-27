import { Badge } from "~/components/ui/badge"
import type { Task } from "~/lib/utils"
import { CheckCircle2, Circle } from "lucide-react"

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div
      className="task-card flex flex-col gap-2 rounded-md border p-3"
      style={{
        borderLeftWidth: "4px",
        borderLeftColor: task.category.color,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {task.completed ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="font-medium">{task.title}</span>
        </div>
        <Badge
          variant="outline"
          className="ml-auto"
          style={{
            backgroundColor: `${task.category.color}20`,
            color: task.category.color,
          }}
        >
          {task.category.name}
        </Badge>
      </div>
      {task.description && <p className="text-xs text-muted-foreground">{task.description}</p>}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Priority: {task.priority}</span>
        <span>{task.frequency}</span>
      </div>
    </div>
  )
}

