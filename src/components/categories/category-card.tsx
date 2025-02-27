import type React from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { type Category, getTasksByCategory, getGoalsByCategory } from "~/lib/utils"
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
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const tasks = getTasksByCategory(category.id)
  const goals = getGoalsByCategory(category.id)

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
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader
        className="flex flex-row items-center justify-between pb-2"
        style={{ backgroundColor: `${category.color}20` }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: category.color, color: "white" }}
          >
            {iconMap[category.icon] || <Briefcase className="h-5 w-5" />}
          </div>
          <CardTitle>{category.name}</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md bg-muted p-2 text-center">
            <p className="text-sm font-medium">Tasks</p>
            <p className="text-2xl font-bold">{tasks.length}</p>
          </div>
          <div className="rounded-md bg-muted p-2 text-center">
            <p className="text-sm font-medium">Goals</p>
            <p className="text-2xl font-bold">{goals.length}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <Button variant="outline" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

