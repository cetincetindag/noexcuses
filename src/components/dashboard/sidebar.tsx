"use client";

import { cn } from "~/lib/utils";
import {
  BarChart3,
  Briefcase,
  Clock,
  ListTodo,
  Calendar,
  User,
  Settings,
  Bell,
  Sun,
  Moon,
  Heart,
  ChevronUpCircle,
  CheckCircle,
  PieChart,
  History,
  HeartHandshake,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";

const sidebarItems = [
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
    subItems: [
      {
        title: "Account",
        href: "/dashboard/profile/account",
        icon: User,
      },
      {
        title: "Settings",
        href: "/dashboard/profile/settings",
        icon: Settings,
      },
      {
        title: "Notifications",
        href: "/dashboard/profile/notifications",
        icon: Bell,
      },
    ],
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    subItems: [
      {
        title: "Overview",
        href: "/dashboard/overview",
        icon: Calendar,
      },
      {
        title: "Categories",
        href: "/dashboard/categories",
        icon: Briefcase,
      },
    ],
  },
  {
    title: "Tasks",
    href: "/dashboard/tasks",
    icon: ListTodo,
    subItems: [
      {
        title: "Today",
        href: "/dashboard/tasks/today",
        icon: Clock,
      },
      {
        title: "Upcoming",
        href: "/dashboard/tasks/upcoming",
        icon: ChevronUpCircle,
      },
      {
        title: "Completed",
        href: "/dashboard/tasks/completed",
        icon: CheckCircle,
      },
    ],
  },
  {
    title: "Habits",
    href: "/dashboard/habits",
    icon: Heart,
    subItems: [
      {
        title: "Active",
        href: "/dashboard/habits/active",
        icon: Heart,
      },
      {
        title: "Statistics",
        href: "/dashboard/habits/statistics",
        icon: PieChart,
      },
      {
        title: "History",
        href: "/dashboard/habits/history",
        icon: History,
      },
    ],
  },
  {
    title: "Support",
    href: "/dashboard/donations",
    icon: HeartHandshake,
    subItems: [],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

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

              {item.subItems && item.subItems.length > 0 && (
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

        {/* Theme toggle at the bottom */}
        <div className="mt-auto flex flex-col gap-2">
          <div className="bg-muted rounded-md p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="flex w-full items-center justify-between"
            >
              <span>Theme</span>
              <div className="flex items-center">
                {theme === "light" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </div>
            </Button>
          </div>

          <div className="text-muted-foreground text-center text-xs">
            <p>noexcuses v1.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
