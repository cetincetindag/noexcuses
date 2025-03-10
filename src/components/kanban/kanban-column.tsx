import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Goal, Task } from "~/lib/utils";
import { TaskCard } from "./task-card";
import { PlusCircle } from "lucide-react";
import { AnimatePresence } from "framer-motion";

// Import or define the KanbanTask interface
interface KanbanTask extends Omit<Task, "frequency"> {
  frequency: string | unknown;
}

interface KanbanColumnProps {
  title: string;
  color?: string;
  tasks: KanbanTask[];
  goals: Goal[];
  onCompleteTask?: (taskId: string) => Promise<void>;
  onUndoCompleteTask?: (taskId: string) => Promise<void>;
  onCompleteGoal?: (goalId: string) => Promise<void>;
  onUndoCompleteGoal?: (goalId: string) => Promise<void>;
}

export function KanbanColumn({
  title,
  color,
  tasks,
  goals,
  onCompleteTask,
  onUndoCompleteTask,
  onCompleteGoal,
  onUndoCompleteGoal,
}: KanbanColumnProps) {
  // Separate completed and incomplete tasks/goals
  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  const incompleteGoals = goals.filter((goal) => !goal.completed);
  const completedGoals = goals.filter((goal) => goal.completed);

  // Sort tasks by priority - use a stable sort algorithm
  const sortedIncompleteTasks = [...incompleteTasks].sort(
    (a, b) => a.priority - b.priority || a.id.localeCompare(b.id),
  );
  const sortedIncompleteGoals = [...incompleteGoals].sort(
    (a, b) => a.priority - b.priority || a.id.localeCompare(b.id),
  );

  // Sort completed tasks by title (they're all the same priority since they're done)
  // Use a stable sort algorithm with a secondary sort key
  const sortedCompletedTasks = [...completedTasks].sort(
    (a, b) => a.title.localeCompare(b.title) || a.id.localeCompare(b.id),
  );
  const sortedCompletedGoals = [...completedGoals].sort(
    (a, b) => a.title.localeCompare(b.title) || a.id.localeCompare(b.id),
  );

  const isEmpty = tasks.length === 0 && goals.length === 0;

  return (
    <Card className="kanban-column flex-shrink-0">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <div className="text-muted-foreground flex h-5 items-center text-sm">
            {tasks.length + goals.length}
            {completedTasks.length > 0 &&
              ` (${completedTasks.length} completed)`}
            {completedGoals.length > 0 &&
              ` (${completedGoals.length} goals completed)`}
          </div>
        </div>
        {color && (
          <div
            className="h-1 w-full rounded-full"
            style={{ backgroundColor: color }}
          />
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-2 overflow-hidden">
        <div className="space-y-2">
          {/* Incomplete Tasks */}
          <AnimatePresence mode="sync" initial={false}>
            {sortedIncompleteTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={onCompleteTask}
                onUndoComplete={onUndoCompleteTask}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Divider if there are completed items */}
        {(sortedCompletedTasks.length > 0 ||
          sortedCompletedGoals.length > 0) && (
          <div className="my-2 flex items-center gap-2">
            <div className="bg-muted/50 h-px flex-grow"></div>
            <span className="text-muted-foreground text-xs font-medium">
              Completed
            </span>
            <div className="bg-muted/50 h-px flex-grow"></div>
          </div>
        )}

        <div className="space-y-2">
          {/* Completed Tasks */}
          <AnimatePresence mode="sync" initial={false}>
            {sortedCompletedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={onCompleteTask}
                onUndoComplete={onUndoCompleteTask}
              />
            ))}
          </AnimatePresence>
        </div>

        {isEmpty && (
          <div className="flex h-24 flex-col items-center justify-center rounded-md border border-dashed px-3 py-6 text-center">
            <PlusCircle className="text-muted-foreground mb-2 h-5 w-5" />
            <p className="text-muted-foreground text-sm">
              No {title.toLowerCase()} items
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Click the + button to add
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
