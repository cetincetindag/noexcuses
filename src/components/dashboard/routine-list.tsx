import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Flame,
  Calendar,
  List,
  Check,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import type { Routine } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface RoutineListProps {
  routines: Routine[];
}

export function RoutineList({ routines }: RoutineListProps) {
  if (!routines.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="bg-background mb-4 rounded-full p-3">
          <List className="h-6 w-6" />
        </div>
        <h3 className="mb-1 text-lg font-semibold">No routines yet</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          Create your first routine to combine tasks and habits into a sequence.
        </p>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Routine
        </Button>
      </div>
    );
  }

  // Group routines by frequency
  const routinesByFrequency: Record<string, Routine[]> = {};

  routines.forEach((routine) => {
    const frequency = routine.frequency.toLowerCase();
    if (!routinesByFrequency[frequency]) {
      routinesByFrequency[frequency] = [];
    }
    routinesByFrequency[frequency].push(routine);
  });

  return (
    <div className="grid gap-4 sm:gap-6">
      {Object.entries(routinesByFrequency).map(
        ([frequency, frequencyRoutines]) => (
          <div key={frequency} className="grid gap-3">
            <h3 className="text-lg font-semibold capitalize">
              {frequency} Routines
            </h3>
            <div className="grid gap-3">
              {frequencyRoutines.map((routine) => (
                <Card key={routine.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded-full text-xs text-white"
                        style={{
                          backgroundColor:
                            routine.category.color || routine.color,
                        }}
                      >
                        {routine.title.charAt(0)}
                      </div>
                      <CardTitle className="line-clamp-1 text-sm font-medium">
                        {routine.title}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        {routine.isCompletedToday ? (
                          <Check className="mr-1 h-3 w-3" />
                        ) : (
                          <Calendar className="mr-1 h-3 w-3" />
                        )}
                        {frequency}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {routine.description && (
                      <div className="border-t px-4 py-2 text-sm">
                        {routine.description}
                      </div>
                    )}
                    {((routine.tasks && routine.tasks.length > 0) ||
                      (routine.habits && routine.habits.length > 0)) && (
                      <div className="border-t px-4 py-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">
                            Contains:
                          </span>
                          {routine.tasks && routine.tasks.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {routine.tasks.length} task
                              {routine.tasks.length !== 1 ? "s" : ""}
                            </Badge>
                          )}
                          {routine.habits && routine.habits.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {routine.habits.length} habit
                              {routine.habits.length !== 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    {routine.streak > 0 && (
                      <div className="bg-muted/50 flex items-center gap-1 border-t px-4 py-2 text-xs">
                        <Flame className="h-3 w-3 text-orange-500" />
                        <span>{routine.streak} day streak</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ),
      )}
    </div>
  );
}
