import { Badge } from "~/components/ui/badge";
import type { Task } from "~/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { motion } from "framer-motion";

// Define KanbanTask interface for compatibility with the board view
interface KanbanTask extends Omit<Task, "frequency"> {
  frequency: string | unknown;
}

interface TaskCardProps {
  task: KanbanTask;
  onComplete?: (taskId: string) => Promise<void>;
  onUndoComplete?: (taskId: string) => Promise<void>;
}

export function TaskCard({ task, onComplete, onUndoComplete }: TaskCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggleComplete = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      if (task.completed) {
        // Undo completion if the task is already completed
        if (onUndoComplete) {
          await onUndoComplete(task.id);
        }
      } else {
        // Complete the task if it's not completed
        if (onComplete) {
          await onComplete(task.id);
        }
      }
    } catch (error) {
      console.error(
        `Failed to ${task.completed ? "undo" : "complete"} task:`,
        error,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      className={cn(
        "task-card flex flex-col gap-2 rounded-md p-3",
        isProcessing && "pointer-events-none",
        task.completed && "opacity-80",
      )}
      style={{
        backgroundColor: `${task.category.color}20`,
        borderLeft: `4px solid ${task.category.color}`,
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.2 },
      }}
      exit={{
        opacity: 0,
        y: -5,
        height: 0,
        marginBottom: 0,
        padding: 0,
        transition: { duration: 0.3, ease: "easeInOut" },
      }}
      layout="position"
      layoutId={`task-${task.id}`}
      transition={{
        layout: {
          type: "spring",
          damping: 30,
          stiffness: 200,
          mass: 0.8,
          duration: 0.4,
        },
        opacity: { duration: 0.2 },
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleComplete}
            className="transition-transform hover:scale-110 focus:outline-none active:scale-95"
            disabled={
              isProcessing ||
              (!onComplete && !task.completed) ||
              (!onUndoComplete && task.completed)
            }
            aria-label={
              task.completed
                ? "Mark task as incomplete"
                : "Mark task as complete"
            }
            title={
              task.completed
                ? "Click to mark as incomplete"
                : "Click to mark as complete"
            }
          >
            {task.completed ? (
              <CheckCircle2
                className={cn(
                  "h-4 w-4 text-green-500",
                  isProcessing && "animate-pulse",
                )}
              />
            ) : (
              <Circle
                className={cn(
                  "h-4 w-4",
                  isProcessing
                    ? "animate-pulse text-green-500"
                    : "text-muted-foreground",
                )}
              />
            )}
          </button>
          <span
            className={cn(
              "font-medium",
              task.completed && "text-muted-foreground line-through",
            )}
          >
            {task.title}
          </span>
        </div>
        <Badge
          variant="secondary"
          className="ml-auto"
          style={{
            backgroundColor: task.category.color,
            color: "white",
          }}
        >
          {task.category.name}
        </Badge>
      </div>
      {task.description && (
        <p className="text-muted-foreground text-xs">{task.description}</p>
      )}
      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <span>Priority: {task.priority}</span>
        <span>{task.frequency ? String(task.frequency) : ""}</span>
      </div>
    </motion.div>
  );
}
