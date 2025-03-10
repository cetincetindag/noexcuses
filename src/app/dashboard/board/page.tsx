"use client"

import { KanbanBoard } from "~/components/kanban/kanban-board"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"

export default function BoardViewPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Board View</h1>
        <p className="text-muted-foreground">Organize your tasks and goals visually</p>
      </div>

      <Tabs defaultValue="frequency" className="w-full">
        <div className="sticky top-14 z-10 bg-background pb-4">
          <TabsList>
            <TabsTrigger value="frequency">By Frequency</TabsTrigger>
            <TabsTrigger value="category">By Category</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="frequency">
          <KanbanBoard viewType="frequency" />
        </TabsContent>
        <TabsContent value="category">
          <KanbanBoard viewType="category" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

