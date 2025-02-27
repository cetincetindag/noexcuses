"use client"

import { ModeToggle } from "~/components/mode-toggle"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Plus, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CreateTaskDialog } from "../dialogs/create-task-dialog"
import { CreateGoalDialog } from "../dialogs/create-goal-dialog"
import { CreateCategoryDialog } from "../dialogs/create-category-dialog"
import { useState } from "react"

export function DashboardHeader() {
  const pathname = usePathname()
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [goalDialogOpen, setGoalDialogOpen] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)

  return (
    <header className="fixed top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold">TaskTrack Pro</span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Create New</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTaskDialogOpen(true)}>Task</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setGoalDialogOpen(true)}>Goal</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategoryDialogOpen(true)}>Category</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CreateTaskDialog open={taskDialogOpen} setOpen={setTaskDialogOpen} />
      <CreateGoalDialog open={goalDialogOpen} setOpen={setGoalDialogOpen} />
      <CreateCategoryDialog open={categoryDialogOpen} setOpen={setCategoryDialogOpen} />
    </header>
  )
}

