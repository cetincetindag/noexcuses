"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle2, XCircle } from "lucide-react";

type HabitHistoryEntry = {
  id: string;
  habitId: string;
  habitName: string;
  categoryName: string;
  categoryColor: string;
  date: string;
  completed: boolean;
};

type GroupedHistory = Record<string, HabitHistoryEntry[]>;

export default function HabitHistoryPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<HabitHistoryEntry[]>([]);
  const [groupedHistory, setGroupedHistory] = useState<GroupedHistory>({});
  const [sortedDates, setSortedDates] = useState<string[]>([]);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/habits/history");

      if (!response.ok) {
        throw new Error("Failed to fetch habit history");
      }

      const data = await response.json();
      setHistory(data || []);
    } catch (error) {
      console.error("Error fetching habit history:", error);
      toast.error("Failed to load history. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate placeholder data for development
  const generatePlaceholderData = (): HabitHistoryEntry[] => {
    const habits = [
      {
        id: "1",
        name: "Morning Meditation",
        category: "Mindfulness",
        color: "#9B59B6",
      },
      {
        id: "2",
        name: "Daily Exercise",
        category: "Fitness",
        color: "#E74C3C",
      },
      {
        id: "3",
        name: "Read 30 Minutes",
        category: "Education",
        color: "#F39C12",
      },
      { id: "4", name: "Drink Water", category: "Health", color: "#3498DB" },
    ];

    const history: HabitHistoryEntry[] = [];

    // Generate 30 days of history
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      habits.forEach((habit) => {
        // Random completion status
        const completed = Math.random() > 0.3;

        history.push({
          id: `history-${i}-${habit.id}`,
          habitId: habit.id,
          habitName: habit.name,
          categoryName: habit.category,
          categoryColor: habit.color,
          date: date.toISOString(),
          completed,
        });
      });
    }

    return history;
  };

  // Process history data when it changes
  useEffect(() => {
    if (history.length > 0) {
      // Group history by date
      const grouped = history.reduce((acc, entry) => {
        const date = entry.date.split("T")[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(entry);
        return acc;
      }, {} as GroupedHistory);

      // Sort dates in descending order
      const sorted = Object.keys(grouped).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime(),
      );

      setGroupedHistory(grouped);
      setSortedDates(sorted);
    }
  }, [history]);

  useEffect(() => {
    // In production, use fetchHistory()
    // For now, generating placeholder data for UI development
    setIsLoading(true);
    setTimeout(() => {
      setHistory(generatePlaceholderData());
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="container max-w-6xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Habit History</h1>
      <p className="text-muted-foreground mb-8">
        Review your habit completion history
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <p>Loading history...</p>
        </div>
      ) : history.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground text-center">
              No habit history found. Start completing habits to see your
              history here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => {
            const entries = groupedHistory[date] || [];
            const completedCount = entries.filter(
              (entry) => entry.completed,
            ).length;

            return (
              <Card key={date}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {format(new Date(date), "EEEE, MMMM d, yyyy")}
                  </CardTitle>
                  <CardDescription>
                    {completedCount} of {entries.length} habits completed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Habit</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">
                            {entry.habitName}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              style={{
                                backgroundColor: `${entry.categoryColor}15`,
                                borderColor: entry.categoryColor,
                                color: entry.categoryColor,
                              }}
                            >
                              {entry.categoryName}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {entry.completed ? (
                              <div className="flex items-center justify-end gap-1 text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Completed</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-1 text-red-500">
                                <XCircle className="h-4 w-4" />
                                <span>Missed</span>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
