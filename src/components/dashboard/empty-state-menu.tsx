"use client";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { PlusCircle, ListTodo, Target, Folder } from "lucide-react";
import { useState } from "react";
import { CreateTaskDialog } from "../dialogs/create-task-dialog";
import { CreateCategoryDialog } from "../dialogs/create-category-dialog";

export function EmptyStateMenu() {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [tutorialComplete, setTutorialComplete] = useState(false);

  const handleCreateTask = () => {
    setTaskDialogOpen(true);
  };

  const handleTaskCreated = () => {
    setTaskDialogOpen(false);
    window.location.reload(); // Refresh the page to show the new task
    setShowPopup(true); // Show the pop-up message
  };

  const handlePopupAgree = () => {
    setShowPopup(false);
    setTutorialComplete(true); // Mark the tutorial as complete
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-thin">no more excuses.</CardTitle>
          <CardDescription>
            It is all in your head. Start by creating your first task.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleCreateTask}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create your first task
          </Button>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleCreateTask}>
            <ListTodo className="mr-2 h-4 w-4" />
            Get Started
          </Button>
        </CardFooter>
      </Card>

      <CreateTaskDialog open={taskDialogOpen} setOpen={setTaskDialogOpen} />
      <CreateCategoryDialog
        open={categoryDialogOpen}
        setOpen={setCategoryDialogOpen}
      />

      {showPopup && (
        <div className="fixed top-0 right-0 m-4 rounded border bg-white p-4 shadow-lg">
          <p>You can create more tasks using the button to the top right!</p>
          <Button onClick={handlePopupAgree}>Got it!</Button>
        </div>
      )}
    </div>
  );
}
