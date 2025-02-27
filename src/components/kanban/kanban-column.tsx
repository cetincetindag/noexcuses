import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import type { Goal, Task } from "~/lib/utils"
import { TaskCard } from "./task-card"
import { GoalCard } from "./goal-card"

interface KanbanColumnProps {
  title: string
  color?: string
  tasks: Task[]
  goals: Goal[]
}

export function KanbanColumn({ title, color, tasks, goals }: KanbanColumnProps) {
  // Sort tasks by priority
  const sortedTasks = [...tasks].sort((a, b) => a.priority - b.priority)
  const sortedGoals = [...goals].sort((a, b) => a.priority - b.priority)

  return (
    <Card className="kanban-column flex-shrink-0">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <div className="flex h-5 items-center text-sm text-muted-foreground">{tasks.length + goals.length}</div>
        </div>
        {color && <div className="h-1 w-full rounded-full" style={{ backgroundColor: color }} />}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {sortedGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
        {sortedTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && goals.length === 0 && (
          <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
            <p className="text-sm text-muted-foreground">No items</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

