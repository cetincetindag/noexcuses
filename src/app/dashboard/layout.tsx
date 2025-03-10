import type React from "react";
import { DashboardHeader } from "~/components/dashboard/header";
import { DashboardSidebar } from "~/components/dashboard/sidebar";
import { TutorialWrapper } from "~/components/onboarding/TutorialWrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-4 sm:px-6 md:px-8 lg:pr-8 lg:pl-64">
          {children}
          <TutorialWrapper />
        </main>
      </div>
    </div>
  );
}
