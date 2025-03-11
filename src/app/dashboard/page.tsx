import { BarChart3, CalendarDays, CheckSquare, Clock } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CardDescription>All your tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-muted-foreground text-xs">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-success/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Tasks
            </CardTitle>
            <CardDescription>Tasks you've finished</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-muted-foreground text-xs">67% completion rate</p>
          </CardContent>
        </Card>

        <Card className="bg-amber-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Current Streak
            </CardTitle>
            <CardDescription>Your habit streak</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 days</div>
            <p className="text-muted-foreground text-xs">+2 from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Habits</CardTitle>
            <CardDescription>Habits you're tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-muted-foreground text-xs">2 completed today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Quick Navigation
            </CardTitle>
            <CardDescription>
              Access key areas of your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/dashboard/overview"
                className="hover:bg-muted flex items-center justify-center rounded-md border border-dashed p-4"
              >
                <div className="flex flex-col items-center gap-1 text-center">
                  <CalendarDays className="text-primary h-6 w-6" />
                  <span className="text-sm font-medium">Overview</span>
                </div>
              </Link>

              <Link
                href="/dashboard/tasks/today"
                className="hover:bg-muted flex items-center justify-center rounded-md border border-dashed p-4"
              >
                <div className="flex flex-col items-center gap-1 text-center">
                  <CheckSquare className="text-primary h-6 w-6" />
                  <span className="text-sm font-medium">Today's Tasks</span>
                </div>
              </Link>

              <Link
                href="/dashboard/habits/active"
                className="hover:bg-muted flex items-center justify-center rounded-md border border-dashed p-4"
              >
                <div className="flex flex-col items-center gap-1 text-center">
                  <Clock className="text-primary h-6 w-6" />
                  <span className="text-sm font-medium">Active Habits</span>
                </div>
              </Link>

              <Link
                href="/dashboard/categories"
                className="hover:bg-muted flex items-center justify-center rounded-md border border-dashed p-4"
              >
                <div className="flex flex-col items-center gap-1 text-center">
                  <BarChart3 className="text-primary h-6 w-6" />
                  <span className="text-sm font-medium">Categories</span>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest updates and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 rounded-full p-2">
                  <CheckSquare className="text-primary h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Completed "Morning Exercise"
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Today at 7:30 AM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 rounded-full p-2">
                  <CheckSquare className="text-primary h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Added new task "Submit Report"
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Yesterday at 4:15 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 rounded-full p-2">
                  <Clock className="text-primary h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Achieved 5-day streak on "Reading"
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Yesterday at 9:00 PM
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
