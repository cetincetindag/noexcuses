"use client"

import { KanbanBoard } from "~/components/kanban/kanban-board"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"

export default function KanbanPage() {
  return (
    <div className="flex flex-col gap-6 pl-0 lg:pl-56">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Kanban Board</h1>
        <p className="text-muted-foreground">Organize your tasks and goals visually</p>
      </div>

      <Tabs defaultValue="frequency" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="frequency">By Frequency</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
        </TabsList>
        <TabsContent value="frequency" className="animate-in">
          <KanbanBoard viewType="frequency" />
        </TabsContent>
        <TabsContent value="category" className="animate-in">
          <KanbanBoard viewType="category" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

