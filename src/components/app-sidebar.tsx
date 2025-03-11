"use client";

import * as React from "react";
import {
  BarChart3,
  Layers,
  Calendar,
  Briefcase,
  User,
  Settings,
  LogOut,
  Clock,
  CheckCheck,
  ListTodo,
  HeartHandshake,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { NavMain } from "~/components/nav-main";
import { NavUser } from "~/components/nav-user";
import { TeamSwitcher } from "~/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "~/components/ui/sidebar";
import { useClerk } from "@clerk/nextjs";

// Application data
const data = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/user.jpg",
    id: "user123",
  },
  teams: [
    {
      name: "noexcuses",
      logo: CheckCheck,
      plan: "Personal",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard/overview",
        },
        {
          title: "Categories",
          url: "/dashboard/categories",
        },
      ],
    },
    {
      title: "Tasks",
      url: "/dashboard/tasks",
      icon: ListTodo,
      items: [
        {
          title: "Today",
          url: "/dashboard/tasks/today",
        },
        {
          title: "Upcoming",
          url: "/dashboard/tasks/upcoming",
        },
        {
          title: "Completed",
          url: "/dashboard/tasks/completed",
        },
      ],
    },
    {
      title: "Habits",
      url: "/dashboard/habits",
      icon: Clock,
      items: [
        {
          title: "Active",
          url: "/dashboard/habits/active",
        },
        {
          title: "Statistics",
          url: "/dashboard/habits/statistics",
        },
        {
          title: "History",
          url: "/dashboard/habits/history",
        },
      ],
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
      items: [
        {
          title: "Account",
          url: "/dashboard/profile/account",
        },
        {
          title: "Public Profile",
          url: "/profile/user123",
        },
        {
          title: "Settings",
          url: "/dashboard/profile/settings",
        },
        {
          title: "Notifications",
          url: "/dashboard/profile/notifications",
        },
      ],
    },
    {
      title: "Support",
      url: "/dashboard/donations",
      icon: HeartHandshake,
      items: [],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { signOut } = useClerk();
  const pathname = usePathname();
  const { setOpen } = useSidebar();

  // Track if we've already handled the initial sidebar collapse for overview
  const initialOverviewCollapseHandled = React.useRef(false);

  // Check if we're on the overview page and collapse sidebar if needed
  React.useEffect(() => {
    // Only collapse when navigating to overview and we haven't handled it yet
    if (
      pathname === "/dashboard/overview" &&
      !initialOverviewCollapseHandled.current
    ) {
      setOpen(false);
      initialOverviewCollapseHandled.current = true;
    } else if (pathname !== "/dashboard/overview") {
      // Reset the flag when navigating away from overview
      initialOverviewCollapseHandled.current = false;
    }
  }, [pathname, setOpen]);

  const handleSignOut = () => {
    signOut();
  };

  // Get the user ID for consistent use
  const userId = data.user.id || "user123";

  // Update the Profile section's Public Profile URL with the user ID
  const navMainWithUserProfile = data.navMain.map((item) => {
    if (item.title === "Profile" && item.items) {
      return {
        ...item,
        items: item.items.map((subItem) =>
          subItem.title === "Public Profile"
            ? { ...subItem, url: `/profile/${userId}` }
            : subItem,
        ),
      };
    }
    return item;
  });

  // Customize user data with sign out function
  const userData = {
    ...data.user,
    signOut: handleSignOut,
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithUserProfile} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
