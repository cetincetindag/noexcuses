"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

// Define types for our statistics data
type CategoryData = {
  name: string;
  value: number;
  color: string;
};

type WeeklyData = {
  name: string;
  completed: number;
  total: number;
};

type HabitStats = {
  totalHabits: number;
  completedToday: number;
  averageCompletion: number;
  categoryDistribution: CategoryData[];
  weeklyData: WeeklyData[];
  longestStreak: number;
};

export default function HabitStatisticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<HabitStats>({
    totalHabits: 0,
    completedToday: 0,
    averageCompletion: 0,
    categoryDistribution: [],
    weeklyData: [],
    longestStreak: 0,
  });

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/habits/statistics");

      if (!response.ok) {
        throw new Error("Failed to fetch habit statistics");
      }

      const data = await response.json();
      setStats(
        data || {
          totalHabits: 0,
          completedToday: 0,
          averageCompletion: 0,
          categoryDistribution: [],
          weeklyData: [],
          longestStreak: 0,
        },
      );
    } catch (error) {
      console.error("Error fetching habit statistics:", error);
      toast.error("Failed to load statistics. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate placeholder data for development
  const generatePlaceholderData = (): HabitStats => {
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return {
      totalHabits: 7,
      completedToday: 4,
      averageCompletion: 68,
      longestStreak: 12,
      weeklyData: daysOfWeek.map((day) => ({
        name: day,
        completed: Math.floor(Math.random() * 7),
        total: 7,
      })),
      categoryDistribution: [
        { name: "Health", value: 3, color: "#3498DB" },
        { name: "Fitness", value: 2, color: "#E74C3C" },
        { name: "Mindfulness", value: 1, color: "#9B59B6" },
        { name: "Work", value: 1, color: "#34495E" },
      ],
    };
  };

  useEffect(() => {
    // In production, use fetchStats()
    // For now, generating placeholder data for UI development
    setIsLoading(true);
    setTimeout(() => {
      setStats(generatePlaceholderData());
      setIsLoading(false);
    }, 1000);
  }, []);

  const COLORS = [
    "#3498DB",
    "#E74C3C",
    "#9B59B6",
    "#34495E",
    "#1ABC9C",
    "#F39C12",
  ];

  // Define chart config for the pie chart
  const chartConfig = {
    visitors: {
      label: "Habits",
    },
    Health: {
      label: "Health",
      color: "#3498DB",
    },
    Fitness: {
      label: "Fitness",
      color: "#E74C3C",
    },
    Mindfulness: {
      label: "Mindfulness",
      color: "#9B59B6",
    },
    Work: {
      label: "Work",
      color: "#34495E",
    },
    Other: {
      label: "Other",
      color: "#1ABC9C",
    },
  } satisfies ChartConfig;

  // Define bar chart config
  const barChartConfig = {
    completed: {
      label: "Completed",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  // Convert the categoryDistribution data to a format compatible with the new chart
  const pieChartData = stats.categoryDistribution.map((item, index) => {
    // Map category names to the browser keys expected by the chart
    const browserKey = ["chrome", "safari", "firefox", "edge", "other"][
      index % 5
    ];
    return {
      browser: browserKey,
      category: item.name, // Keep original category name for reference
      visitors: item.value,
      fill: item.color,
    };
  });

  // Create dynamic CSS variables for the chart colors
  const chartStyle = {
    "--color-chrome": stats.categoryDistribution[0]?.color || "#3498DB",
    "--color-safari": stats.categoryDistribution[1]?.color || "#E74C3C",
    "--color-firefox": stats.categoryDistribution[2]?.color || "#9B59B6",
    "--color-edge": stats.categoryDistribution[3]?.color || "#34495E",
    "--color-other": stats.categoryDistribution[4]?.color || "#1ABC9C",
    "--color-completed": "#3498DB",
  } as React.CSSProperties;

  return (
    <div className="container max-w-6xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Habit Statistics</h1>
      <p className="text-muted-foreground mb-8">
        Track your habit performance and trends
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <p>Loading statistics...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Habits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHabits}</div>
              <p className="text-muted-foreground text-xs">
                Active habits being tracked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedToday}</div>
              <p className="text-muted-foreground text-xs">
                Habits completed today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.averageCompletion}%
              </div>
              <p className="text-muted-foreground text-xs">
                Average completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Longest Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.longestStreak} days
              </div>
              <p className="text-muted-foreground text-xs">Your best streak</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
              <CardDescription>
                Your habit completion over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={barChartConfig} style={chartStyle}>
                <BarChart accessibilityLayer data={stats.weeklyData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value, name, entry) => {
                          return (
                            <div className="flex justify-between gap-2">
                              <span>Completed</span>
                              <span className="font-semibold">
                                {value} of {entry.payload.total}
                              </span>
                            </div>
                          );
                        }}
                      />
                    }
                  />
                  <Bar
                    dataKey="completed"
                    fill="var(--color-completed)"
                    radius={8}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 leading-none font-medium">
                Trending up by 5.2% this week <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground leading-none">
                Showing habit completion for the past week
              </div>
            </CardFooter>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>
                Distribution of habits by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.categoryDistribution.length > 0 ? (
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square w-full max-w-[350px]"
                  style={chartStyle}
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          hideLabel
                          formatter={(value, name, entry) => {
                            // Display the actual category name and value
                            const categoryName = entry.payload.category;
                            return (
                              <div className="flex justify-between gap-2">
                                <span>{categoryName}</span>
                                <span className="font-semibold">{value}</span>
                              </div>
                            );
                          }}
                        />
                      }
                    />
                    <Pie
                      data={pieChartData}
                      dataKey="visitors"
                      nameKey="browser"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                    />
                  </PieChart>
                </ChartContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">
                    No category data available
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 leading-none font-medium">
                Trending up by 5.2% this month{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground leading-none">
                Showing category distribution for all habits
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
