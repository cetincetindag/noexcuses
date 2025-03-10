"use client";

import type React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { CheckCircle, Target, BarChart2, Calendar } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
import { ModeToggle } from "~/components/mode-toggle";

function LandingPage() {
  const { openSignIn, user } = useClerk();

  const handleGetStarted = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user) {
      openSignIn();
    } else {
      redirect("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center px-4 lg:px-6">
        <Link className="flex items-center justify-center" href="/">
          <span className="text-2xl font-bold">
            <span className="text-primary">no</span>
            <span className="text-muted-foreground">excuses</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center space-x-2">
          <ModeToggle />
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Achieve Your Goals with noexcuses
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  The ultimate task and goal tracking app to boost your
                  productivity and reach your full potential.
                </p>
              </div>
              <div className="space-x-4">
                <Button onClick={handleGetStarted}>Get Started</Button>
                <Button variant="outline" asChild>
                  <Link href="/features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          ©{new Date().getFullYear()} noexcuses. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
}

export default function Home() {
  return <LandingPage />;
}
