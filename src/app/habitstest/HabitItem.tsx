

import { Draggable } from "@hello-pangea/dnd"
import { Card, CardContent } from "~/components/ui/card"
import { Checkbox } from "~/components/ui/checkbox"
import { cn } from "~/lib/utils"
import * as Icons from "lucide-react"

interface HabitItemProps {
  habit: {
    id: string
    name: string
    frequency: string
    completed: boolean
    color: string
    icon: string
    category: string
  }
  index: number
}

export function HabitItem({ habit, index }: HabitItemProps) {
  const Icon = Icons[habit.icon as keyof typeof Icons]

  return (
    <Draggable draggableId={habit.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn("mb-2", habit.color)}
        >
          <CardContent className="p-4 flex items-center space-x-4">
            <Checkbox id={`habit-${habit.id}`} checked={habit.completed} />
            {Icon && <Icon className="h-5 w-5" />}
            <div className="grow">
              <label
                htmlFor={`habit-${habit.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {habit.name}
              </label>
              <p className="text-xs text-gray-500">{habit.frequency}</p>
            </div>
            <span className="text-xs text-gray-500">{habit.category}</span>
          </CardContent>
        </Card>
      )}
    </Draggable>
  )
}

