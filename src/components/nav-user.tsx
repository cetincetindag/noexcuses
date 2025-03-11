"use client";

import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useSidebar } from "~/components/ui/sidebar";

interface UserProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    id?: string;
    signOut?: () => void;
  };
}

export function NavUser({ user }: UserProps) {
  const { setTheme, theme } = useTheme();
  const { open, setOpen, toggleSidebar } = useSidebar();

  const userId = user.id || "user123";

  return (
    <div>
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-x-2 px-4 py-2">
          <div className="hidden items-center gap-x-4 group-data-[state=expanded]/sidebar:flex">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 leading-none">
              <span className="line-clamp-1 text-sm font-medium">
                {user.name}
              </span>
              <span className="text-muted-foreground line-clamp-1 text-xs">
                {user.email}
              </span>
            </div>
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="text-foreground h-4 w-4" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a
                      href={`/profile/${userId}`}
                      className="flex cursor-pointer items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>View Public Profile</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  >
                    <span>Toggle theme</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user.signOut && (
                    <DropdownMenuItem onClick={user.signOut}>
                      <span>Logout</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="hidden items-center text-sm font-medium group-data-[state=collapsed]/sidebar:flex">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="text-foreground h-4 w-4" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a
                      href={`/profile/${userId}`}
                      className="flex cursor-pointer items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>View Public Profile</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  >
                    <span>Toggle theme</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user.signOut && (
                    <DropdownMenuItem onClick={user.signOut}>
                      <span>Logout</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div>
          <Button
            size="icon"
            variant="ghost"
            className="mr-2"
            onClick={toggleSidebar}
          >
            {open ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span className="sr-only">
              {open ? "Collapse sidebar" : "Expand sidebar"}
            </span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
