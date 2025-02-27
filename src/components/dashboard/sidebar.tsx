"use client"

import { cn } from "~/lib/utils"
import {
  BarChart3,
  Briefcase,
  Dumbbell,
  GraduationCap,
  Heart,
  Home,
  Layers,
  NotebookIcon as Lotus,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Kanban Board",
    href: "/dashboard/kanban",
    icon: Layers,
  },
  {
    title: "Categories",
    href: "/dashboard/categories",
    icon: Briefcase,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-56 border-r bg-background lg:block">
      <div className="flex h-full flex-col gap-2 p-4">
        <nav className="grid gap-1">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent" : "transparent",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <div className="rounded-md bg-muted p-3">
            <h4 className="mb-1 text-sm font-medium">Quick Access</h4>
            <div className="grid grid-cols-4 gap-1">
              <Link
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                title="Health"
              >
                <Heart className="h-4 w-4 text-[#3498DB]" />
              </Link>
              <Link
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                title="Fitness"
              >
                <Dumbbell className="h-4 w-4 text-[#E74C3C]" />
              </Link>
              <Link
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                title="Mindfulness"
              >
                <Lotus className="h-4 w-4 text-[#9B59B6]" />
              </Link>
              <Link
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                title="Work"
              >
                <Briefcase className="h-4 w-4 text-[#34495E]" />
              </Link>
              <Link
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                title="Home"
              >
                <Home className="h-4 w-4 text-[#795548]" />
              </Link>
              <Link
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                title="Social"
              >
                <Users className="h-4 w-4 text-[#E91E63]" />
              </Link>
              <Link
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                title="Education"
              >
                <GraduationCap className="h-4 w-4 text-[#F39C12]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

