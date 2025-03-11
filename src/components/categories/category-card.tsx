"use client";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { type Category } from "~/lib/utils";
import {
  Apple,
  Book,
  Briefcase,
  DollarSign,
  Dumbbell,
  Edit,
  GraduationCap,
  Heart,
  Home,
  Laptop,
  NotebookIcon as Lotus,
  MoreHorizontal,
  Paintbrush,
  Plane,
  SpadeIcon as Spa,
  Trash,
  ListTodo,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useState } from "react";
import { EditCategoryDialog } from "~/components/dialogs/edit-category-dialog";
import { DeleteCategoryDialog } from "~/components/dialogs/delete-category-dialog";

interface CategoryCardProps {
  category: Category;
  onCategoryUpdated: () => void;
}

export function CategoryCard({
  category,
  onCategoryUpdated,
}: CategoryCardProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<number>(0);
  const [habits, setHabits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Map icon name to component
  const iconMap: Record<string, React.ReactNode> = {
    Heart: <Heart className="h-4 w-4" />,
    Dumbbell: <Dumbbell className="h-4 w-4" />,
    Lotus: <Lotus className="h-4 w-4" />,
    Briefcase: <Briefcase className="h-4 w-4" />,
    Book: <Book className="h-4 w-4" />,
    GraduationCap: <GraduationCap className="h-4 w-4" />,
    DollarSign: <DollarSign className="h-4 w-4" />,
    Home: <Home className="h-4 w-4" />,
    Paintbrush: <Paintbrush className="h-4 w-4" />,
    Laptop: <Laptop className="h-4 w-4" />,
    Plane: <Plane className="h-4 w-4" />,
    Apple: <Apple className="h-4 w-4" />,
    Spa: <Spa className="h-4 w-4" />,
  };

  // Fetch real category stats
  useState(() => {
    setIsLoading(true);

    fetch(`/api/categories/${category.id}/stats`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch category stats: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTasks(data.tasksCount || 0);
        setHabits(data.habitsCount || 0);
      })
      .catch((error) => {
        console.error("Error fetching category stats:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  });

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-sm">
        <CardHeader
          className="flex flex-row items-center justify-between p-3"
          style={{ backgroundColor: `${category.color}15` }}
        >
          <div className="flex min-w-0 items-center gap-2">
            <div
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: category.color, color: "white" }}
            >
              {iconMap[category.icon] || <Briefcase className="h-3 w-3" />}
            </div>
            <CardTitle className="truncate text-sm font-medium">
              {category.name}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 flex-shrink-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-3">
          <div className="text-muted-foreground flex justify-between text-xs">
            <div className="flex items-center gap-1">
              <ListTodo className="h-3.5 w-3.5" />
              <span>{isLoading ? "..." : tasks} tasks</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{isLoading ? "..." : habits} habits</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EditCategoryDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        category={category}
        onCategoryUpdated={onCategoryUpdated}
      />

      <DeleteCategoryDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        category={category}
        onCategoryDeleted={onCategoryUpdated}
      />
    </>
  );
}
