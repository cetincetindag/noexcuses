"use client";

import { ModeToggle } from "~/components/mode-toggle";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  BarChart3,
  Briefcase,
  Layers,
  Menu,
  Plus,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CreateTaskDialog } from "../dialogs/create-task-dialog";
import { CreateCategoryDialog } from "../dialogs/create-category-dialog";
import { CreateHabitDialog } from "../dialogs/create-habit-dialog";
import { useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "~/components/ui/sheet";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    subItems: [
      {
        title: "Board View",
        href: "/dashboard/board",
        icon: Layers,
      },
      {
        title: "Categories",
        href: "/dashboard/categories",
        icon: Briefcase,
      },
    ],
  },
];

export function DashboardHeader() {
  const { signOut } = useClerk();
  const pathname = usePathname();
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [routineDialogOpen, setRoutineDialogOpen] = useState(false);
  const [habitDialogOpen, setHabitDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="px-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Application navigation links and options
              </SheetDescription>
              <div className="flex flex-col gap-2 py-4">
                <div className="mb-2 px-4">
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2"
                  >
                    <span className="inline-block font-bold">
                      <span className="text-foreground">no</span>
                      <span className="text-muted-foreground">excuses</span>
                    </span>
                  </Link>
                </div>
                <nav className="grid gap-1 px-2">
                  {navigationItems.map((item, index) => (
                    <div key={index}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                          "hover:bg-accent hover:text-accent-foreground",
                          pathname === item.href ? "bg-accent" : "transparent",
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                      {item.subItems && (
                        <div className="mt-1 ml-6 grid gap-1">
                          {item.subItems.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                                "hover:bg-accent hover:text-accent-foreground",
                                pathname === subItem.href
                                  ? "bg-accent"
                                  : "transparent",
                              )}
                            >
                              <subItem.icon className="h-4 w-4" />
                              <span>{subItem.title}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="inline-block font-bold">
              <span className="text-foreground">no</span>
              <span className="text-muted-foreground">excuses</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Create new</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Create New</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTaskDialogOpen(true)}>
                Task
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setHabitDialogOpen(true)}>
                Habit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoutineDialogOpen(true)}>
                Routine
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryDialogOpen(true)}>
                Category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <User className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CreateTaskDialog open={taskDialogOpen} setOpen={setTaskDialogOpen} />
      <CreateHabitDialog open={habitDialogOpen} setOpen={setHabitDialogOpen} />
      <CreateCategoryDialog
        open={categoryDialogOpen}
        setOpen={setCategoryDialogOpen}
      />
    </header>
  );
}
