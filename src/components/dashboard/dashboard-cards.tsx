import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { mockTasks, mockGoals } from "~/lib/utils"
import { CheckCircle2, Circle, Target } from "lucide-react"

export function DashboardCards() {
  const completedTasks = mockTasks.filter((task) => task.completed).length
  const totalTasks = mockTasks.length
  const completionPercentage = Math.round((completedTasks / totalTasks) * 100)

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {completedTasks}/{totalTasks}
          </div>
          <p className="text-xs text-muted-foreground">{completionPercentage}% completion rate</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockGoals.length}</div>
          <p className="text-xs text-muted-foreground">
            Across {new Set(mockGoals.map((g) => g.category.id)).size} categories
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
          <Circle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12 days</div>
          <p className="text-xs text-muted-foreground">Keep it up! You're doing great.</p>
        </CardContent>
      </Card>
    </>
  )
}

