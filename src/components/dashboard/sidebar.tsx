"use client";

import { cn } from "~/lib/utils";
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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

const sidebarItems = [
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

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="lg:bg-background/95 lg:supports-[backdrop-filter]:bg-background/60 hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-64 lg:flex-col lg:border-r lg:pt-20 lg:backdrop-blur">
      <div className="flex flex-1 flex-col gap-2 p-4">
        <nav className="grid gap-1">
          {sidebarItems.map((item, index) => (
            <div key={index}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
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
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {item.subItems && (
                <div className="mt-1 ml-6 grid gap-1">
                  {item.subItems.map((subItem, subIndex) => (
                    <TooltipProvider key={subIndex}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
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
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          {subItem.title}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="mt-auto">
          <div className="bg-muted rounded-md p-3">
            <h4 className="mb-1 text-sm font-medium">Quick Access</h4>
            <div className="grid grid-cols-4 gap-1">
              <Link
                href="#"
                className="bg-background text-foreground hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center rounded-md"
                title="Health"
              >
                <Heart className="h-4 w-4 text-[#3498DB]" />
              </Link>
              <Link
                href="#"
                className="bg-background text-foreground hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center rounded-md"
                title="Fitness"
              >
                <Dumbbell className="h-4 w-4 text-[#E74C3C]" />
              </Link>
              <Link
                href="#"
                className="bg-background text-foreground hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center rounded-md"
                title="Mindfulness"
              >
                <Lotus className="h-4 w-4 text-[#9B59B6]" />
              </Link>
              <Link
                href="#"
                className="bg-background text-foreground hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center rounded-md"
                title="Work"
              >
                <Briefcase className="h-4 w-4 text-[#34495E]" />
              </Link>
              <Link
                href="#"
                className="bg-background text-foreground hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center rounded-md"
                title="Home"
              >
                <Home className="h-4 w-4 text-[#795548]" />
              </Link>
              <Link
                href="#"
                className="bg-background text-foreground hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center rounded-md"
                title="Social"
              >
                <Users className="h-4 w-4 text-[#E91E63]" />
              </Link>
              <Link
                href="#"
                className="bg-background text-foreground hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center rounded-md"
                title="Education"
              >
                <GraduationCap className="h-4 w-4 text-[#F39C12]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
