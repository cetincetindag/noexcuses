import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { mockTasks } from "~/lib/utils"
import { CheckCircle, Circle } from "lucide-react"

export function RecentActivity() {
  // Sort tasks by completion status (completed first) and then by order
  const sortedTasks = [...mockTasks]
    .sort((a, b) => {
      if (a.completed === b.completed) {
        return a.order - b.order
      }
      return a.completed ? -1 : 1
    })
    .slice(0, 5) // Take only the first 5 tasks

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest task updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-3">
              {task.completed ? (
                <CheckCircle className="h-5 w-5 text-[#22c55e]" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{task.title}</p>
                <p className="text-xs text-muted-foreground">
                  {task.category.name} • {task.frequency}
                </p>
              </div>
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: task.category.color }} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

