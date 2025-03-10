import type React from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useState } from "react";
import { ViewCategoryDialog } from "~/components/dialogs/view-category-dialog";
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
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<number>(0);
  const [goals, setGoals] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Map icon name to component
  const iconMap: Record<string, React.ReactNode> = {
    Heart: <Heart className="h-5 w-5" />,
    Dumbbell: <Dumbbell className="h-5 w-5" />,
    Lotus: <Lotus className="h-5 w-5" />,
    Briefcase: <Briefcase className="h-5 w-5" />,
    Book: <Book className="h-5 w-5" />,
    GraduationCap: <GraduationCap className="h-5 w-5" />,
    DollarSign: <DollarSign className="h-5 w-5" />,
    Home: <Home className="h-5 w-5" />,
    Users: <Users className="h-5 w-5" />,
    Paintbrush: <Paintbrush className="h-5 w-5" />,
    Laptop: <Laptop className="h-5 w-5" />,
    Plane: <Plane className="h-5 w-5" />,
    Apple: <Apple className="h-5 w-5" />,
    Spa: <Spa className="h-5 w-5" />,
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
        setGoals(data.goalsCount || 0);
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
      <Card className="flex h-full min-w-[180px] flex-col overflow-hidden">
        <CardHeader
          className="flex flex-row items-center justify-between px-3 py-2"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 pr-1">
            <div
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: category.color, color: "white" }}
            >
              {iconMap[category.icon] || <Briefcase className="h-4 w-4" />}
            </div>
            <CardTitle className="truncate overflow-hidden text-base text-ellipsis whitespace-nowrap">
              {category.name}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewDialogOpen(true)}>
                <Briefcase className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
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
        <CardContent className="flex-grow p-3">
          <div className="grid h-full grid-cols-2 gap-2">
            <div className="bg-muted rounded-md p-2 text-center">
              <p className="text-xs font-medium">Tasks</p>
              <p className="text-xl font-bold">{isLoading ? "..." : tasks}</p>
            </div>
            <div className="bg-muted rounded-md p-2 text-center">
              <p className="text-xs font-medium">Goals</p>
              <p className="text-xl font-bold">{isLoading ? "..." : goals}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t p-2">
          <Button
            variant="outline"
            className="w-full text-sm"
            onClick={() => setViewDialogOpen(true)}
          >
            View Details
          </Button>
        </CardFooter>
      </Card>

      {/* Dialogs */}
      <ViewCategoryDialog
        open={viewDialogOpen}
        setOpen={setViewDialogOpen}
        category={category}
      />

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
