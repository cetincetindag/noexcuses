"use client";

import type React from "react";
import { AppSidebar } from "~/components/app-sidebar";
import { TutorialWrapper } from "~/components/onboarding/TutorialWrapper";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { DashboardHeader } from "~/components/dashboard/dashboard-header";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex-1 p-4 md:p-6">
          {children}
          <TutorialWrapper />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
