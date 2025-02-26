"use client"

import { useState } from "react"
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd"
import { Card, CardContent } from "~/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { HabitItem } from "./HabitItem"

// Mock data for habits with added category
const initialHabits = [
  {
    id: "1",
    name: "Reading",
    frequency: "Daily",
    completed: false,
    color: "bg-blue-200",
    icon: "Book",
    category: "Personal Development",
  },
  {
    id: "2",
    name: "Exercise",
    frequency: "3 times a week",
    completed: true,
    color: "bg-green-200",
    icon: "Dumbbell",
    category: "Health",
  },
  {
    id: "3",
    name: "Meditation",
    frequency: "Daily",
    completed: false,
    color: "bg-purple-200",
    icon: "Brain",
    category: "Wellness",
  },
  {
    id: "4",
    name: "Journaling",
    frequency: "Daily",
    completed: true,
    color: "bg-yellow-200",
    icon: "Edit3",
    category: "Personal Development",
  },
  {
    id: "5",
    name: "Coding",
    frequency: "5 times a week",
    completed: false,
    color: "bg-red-200",
    icon: "Code",
    category: "Professional",
  },
  {
    id: "6",
    name: "Drinking Water",
    frequency: "Daily",
    completed: true,
    color: "bg-cyan-200",
    icon: "Droplet",
    category: "Health",
  },
  {
    id: "7",
    name: "Stretching",
    frequency: "Daily",
    completed: false,
    color: "bg-orange-200",
    icon: "Stretch",
    category: "Health",
  },
  {
    id: "8",
    name: "Learning a Language",
    frequency: "3 times a week",
    completed: false,
    color: "bg-indigo-200",
    icon: "Globe",
    category: "Personal Development",
  },
]

export function HabitsTab() {
  const [habits, setHabits] = useState(initialHabits)
  const [selectedCategory, setSelectedCategory] = useState("All")

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    // Drop outside the list
    if (!destination) return

    // Same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return

    // Get source and destination lists
    const sourceListId = source.droppableId
    const destListId = destination.droppableId

    // Get filtered habits based on current category
    const filteredHabits = selectedCategory === "All"
      ? habits
      : habits.filter(h => h.category === selectedCategory)

    // Create a copy of our habits
    const newHabits = [...habits]

    // Find the actual indices in the original array for source and destination
    let sourceIndex = -1
    let destIndex = -1
    let sourceItem = null

    // Find the source item and its index in the original array
    if (sourceListId === "all-habits") {
      sourceIndex = habits.findIndex(h => h.id === filteredHabits[source.index]?.id)
      sourceItem = habits[sourceIndex]
    } else if (sourceListId === "completed-habits") {
      const completedHabits = filteredHabits.filter(h => h.completed)
      sourceIndex = habits.findIndex(h => h.id === completedHabits[source.index]?.id)
      sourceItem = habits[sourceIndex]
    } else if (sourceListId === "remaining-habits") {
      const remainingHabits = filteredHabits.filter(h => !h.completed)
      sourceIndex = habits.findIndex(h => h.id === remainingHabits[source.index]?.id)
      sourceItem = habits[sourceIndex]
    }

    // Create a modified item if moving between completed/remaining lists
    let modifiedItem = { ...sourceItem }

    // Update completion status if moving between completed and remaining
    if (
      (sourceListId === "completed-habits" && destListId === "remaining-habits") ||
      (sourceListId === "remaining-habits" && destListId === "completed-habits")
    ) {
      modifiedItem.completed = destListId === "completed-habits"
    }

    // Remove the source item
    newHabits.splice(sourceIndex, 1)

    // Find the destination index in the original array
    if (destListId === "all-habits") {
      // If moving to the 'all' list, just insert at the visual index
      destIndex = Math.min(destination.index, newHabits.length)
    } else if (destListId === "completed-habits") {
      // If moving to completed list, find the right position among completed items
      const completedItems = newHabits.filter(h => {
        if (selectedCategory !== "All") {
          return h.completed && h.category === selectedCategory
        }
        return h.completed
      })

      // Find the position in the original array
      if (destination.index >= completedItems.length) {
        // Add to the end of the completed items
        const lastCompletedIndex = newHabits.findIndex(h => {
          if (selectedCategory !== "All") {
            return h.completed && h.category === selectedCategory
          }
          return h.completed
        })
        destIndex = lastCompletedIndex === -1 ? 0 : lastCompletedIndex + 1
      } else {
        const targetId = completedItems[destination.index]?.id
        destIndex = newHabits.findIndex(h => h.id === targetId)
      }
    } else if (destListId === "remaining-habits") {
      // If moving to remaining list, find the right position among remaining items
      const remainingItems = newHabits.filter(h => {
        if (selectedCategory !== "All") {
          return !h.completed && h.category === selectedCategory
        }
        return !h.completed
      })

      // Find the position in the original array
      if (destination.index >= remainingItems.length) {
        // Add to the end of the remaining items
        const lastRemainingIndex = newHabits.findIndex(h => {
          if (selectedCategory !== "All") {
            return !h.completed && h.category === selectedCategory
          }
          return !h.completed
        })
        destIndex = lastRemainingIndex === -1 ? 0 : lastRemainingIndex + 1
      } else {
        const targetId = remainingItems[destination.index]?.id
        destIndex = newHabits.findIndex(h => h.id === targetId)
      }
    }

    // Insert the modified item at the destination
    newHabits.splice(destIndex, 0, modifiedItem)

    // Update state
    setHabits(newHabits)
  }

  const categories = ["All", ...new Set(habits.map((h) => h.category))]
  const filteredHabits = selectedCategory === "All" ? habits : habits.filter((h) => h.category === selectedCategory)
  const completedHabits = filteredHabits.filter((h) => h.completed)
  const remainingHabits = filteredHabits.filter((h) => !h.completed)

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Habits</h2>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">All Habits</h3>
              <Droppable droppableId="all-habits">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px]"
                  >
                    {filteredHabits.map((habit, index) => (
                      <HabitItem key={habit.id} habit={habit} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Completed Today</h3>
              <Droppable droppableId="completed-habits">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px]"
                  >
                    {completedHabits.map((habit, index) => (
                      <HabitItem key={habit.id} habit={habit} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Remaining Today</h3>
              <Droppable droppableId="remaining-habits">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px]"
                  >
                    {remainingHabits.map((habit, index) => (
                      <HabitItem key={habit.id} habit={habit} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
        </div>
      </div>
    </DragDropContext>
  )
}
