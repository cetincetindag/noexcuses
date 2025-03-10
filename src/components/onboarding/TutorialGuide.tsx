"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle,
  ListChecks,
  BarChart2,
  Repeat,
  Flame,
  PlusCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "~/components/ui/use-toast";

type TutorialStep = {
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
};

export function TutorialGuide() {
  const [step, setStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTutorialStatus = async () => {
      try {
        setIsFetching(true);
        console.log("Fetching tutorial status...");
        const response = await fetch("/api/user/tutorial-status");

        if (response.ok) {
          const data = await response.json();
          console.log("Tutorial status response:", data);
          setIsOpen(data.showTutorial);
        } else {
          console.error(
            "Error fetching tutorial status:",
            response.status,
            response.statusText,
          );
          const errorText = await response.text();
          console.error("Error details:", errorText);
        }
      } catch (error) {
        console.error("Error fetching tutorial status:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchTutorialStatus();
  }, []);

  const finishTutorial = async () => {
    try {
      console.log("Marking tutorial as complete...");
      // Send request to mark tutorial as complete
      const response = await fetch("/api/user/tutorial-complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error details:", errorText);
        throw new Error(
          `Failed to update tutorial status: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      console.log("Tutorial complete response:", data);

      setIsOpen(false);

      // Add a slight delay before reloading to ensure the tutorial dialog closes smoothly
      setTimeout(() => {
        console.log("Reloading page to refresh task and habit data...");
        window.location.href = "/dashboard"; // Force navigation to dashboard with fresh data
      }, 500);
    } catch (error) {
      console.error("Error completing tutorial:", error);
      toast({
        title: "Error",
        description: "Failed to complete tutorial",
        variant: "destructive",
      });
    }
  };

  const tutorialSteps: TutorialStep[] = [
    {
      title: "Welcome to NoExcuses",
      description: "Let's get you started with your productivity journey",
      icon: <CheckCircle className="text-primary h-8 w-8" />,
      content: (
        <div className="space-y-4">
          <p>
            Welcome to NoExcuses, your all-in-one productivity tool designed to
            help you build lasting habits, complete tasks, and achieve your
            goals.
          </p>
          <p>
            We've added powerful new features to help you track your progress
            and maintain motivation through streaks, analytics, and more. Let's
            explore them together!
          </p>
        </div>
      ),
    },
    {
      title: "Tasks",
      description: "One-time or recurring items you need to complete",
      icon: <ListChecks className="h-8 w-8 text-green-500" />,
      content: (
        <div className="space-y-4">
          <p>
            Tasks are specific actions or activities that need to be completed.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>One-time tasks for specific activities</li>
            <li>Recurring tasks that repeat daily, weekly, or monthly</li>
            <li>Organize tasks by category for better management</li>
            <li>Track completion status and progress over time</li>
          </ul>
          <p className="font-medium">
            Tip: Break down larger goals into smaller, manageable tasks!
          </p>
        </div>
      ),
    },
    {
      title: "Habits",
      description: "Build consistent daily behaviors",
      icon: <Flame className="h-8 w-8 text-orange-500" />,
      content: (
        <div className="space-y-4">
          <p>
            Habits are actions you want to do regularly, like drinking water or
            meditating.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Each habit has a daily target number of completions</li>
            <li>Mark habits as complete throughout the day</li>
            <li>Build streaks by completing habits consistently</li>
            <li>Habits automatically reset at midnight</li>
          </ul>
          <p className="font-medium">
            Tip: Start with just 1-3 habits to avoid overwhelming yourself!
          </p>
        </div>
      ),
    },
    {
      title: "Routines",
      description: "Combine tasks and habits into a workflow",
      icon: <Repeat className="h-8 w-8 text-indigo-500" />,
      content: (
        <div className="space-y-4">
          <p>
            Routines let you group related tasks and habits together, like a
            "Morning Routine" or "Workout Day".
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Create routines that contain multiple tasks and habits</li>
            <li>Complete an entire routine in one click</li>
            <li>Set frequency: daily, weekly, or monthly</li>
            <li>Build streaks by completing routines consistently</li>
          </ul>
          <p className="font-medium">
            Tip: Morning and evening routines are a great way to start and end
            your day!
          </p>
        </div>
      ),
    },
    {
      title: "Analytics",
      description: "Track your progress and gain insights",
      icon: <BarChart2 className="h-8 w-8 text-blue-500" />,
      content: (
        <div className="space-y-4">
          <p>
            Our new analytics dashboard helps you visualize your productivity
            and identify patterns.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Track streaks for tasks, habits, and routines</li>
            <li>See daily, weekly, and monthly completion rates</li>
            <li>Identify your most and least completed activities</li>
            <li>Find out which categories you focus on most</li>
            <li>View historical data to track your progress over time</li>
          </ul>
          <p className="font-medium">
            Tip: Check your analytics weekly to celebrate wins and identify
            areas for improvement!
          </p>
        </div>
      ),
    },
    {
      title: "Get Started",
      description: "Create your first habits and tasks",
      icon: <PlusCircle className="h-8 w-8 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <p>
            Let's set up your first habits and tasks to get you started on your
            productivity journey.
          </p>
          <p>
            We recommend creating at least 3 habits and 3 tasks to get a good
            feel for how NoExcuses works.
          </p>
          <div className="mt-4 space-y-4">
            <Button
              variant="default"
              className="w-full"
              onClick={() => {
                const event = new CustomEvent("create-onboarding-habit");
                window.dispatchEvent(event);
              }}
            >
              Create New Habit
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const event = new CustomEvent("create-onboarding-task");
                window.dispatchEvent(event);
              }}
            >
              Create New Task
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "You're Ready!",
      description: "Start building better habits today",
      icon: <ListChecks className="h-8 w-8 text-green-500" />,
      content: (
        <div className="space-y-4">
          <p>
            You're all set to start your productivity journey with NoExcuses!
          </p>
          <p>
            Remember that consistency is key to building long-term habits. Focus
            on making small, sustainable changes and celebrate your progress
            along the way.
          </p>
          <p className="font-medium">
            Let's get started by creating your first habit or routine!
          </p>
        </div>
      ),
    },
  ];

  // Ensure step is within bounds
  const safeStep = Math.min(Math.max(0, step), tutorialSteps.length - 1);
  const currentStep = tutorialSteps[safeStep]!;

  const nextStep = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else {
      finishTutorial();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Only render the dialog content if we have valid steps
  if (tutorialSteps.length === 0) {
    return null;
  }

  if (isFetching) {
    return null; // Don't render anything while fetching
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[650px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {currentStep.icon}
            <DialogTitle>{currentStep.title}</DialogTitle>
          </div>
          <DialogDescription>{currentStep.description}</DialogDescription>
        </DialogHeader>

        <div className="py-4">{currentStep.content}</div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex space-x-2">
            {tutorialSteps.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-6 rounded-full ${
                  i === safeStep ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={safeStep === 0}
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button onClick={nextStep}>
              {safeStep === tutorialSteps.length - 1 ? (
                "Get Started"
              ) : (
                <>
                  Next
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
