import { CompletionStatus } from "~/components/dashboard/completion-status"
import { DashboardCards } from "~/components/dashboard/dashboard-cards"
import { DashboardHeader } from "~/components/dashboard/dashboard-header"
import { RecentActivity } from "~/components/dashboard/recent-activity"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 pl-0 lg:pl-56">
      <DashboardHeader />
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="animate-in">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCards />
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <CompletionStatus />
            <RecentActivity />
          </div>
        </TabsContent>
        <TabsContent value="tasks" className="animate-in">
          <div className="grid gap-6">
            <h2 className="text-2xl font-bold">Your Tasks</h2>
            {/* Task content would go here */}
          </div>
        </TabsContent>
        <TabsContent value="goals" className="animate-in">
          <div className="grid gap-6">
            <h2 className="text-2xl font-bold">Your Goals</h2>
            {/* Goal content would go here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

