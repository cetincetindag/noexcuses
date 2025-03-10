"use client";

import React, { useEffect, useState } from "react";
import { TutorialGuide } from "./TutorialGuide";
import { CreateTaskDialog } from "../dialogs/create-task-dialog";
import { CreateHabitDialog } from "../dialogs/create-habit-dialog";

export function TutorialWrapper() {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [habitDialogOpen, setHabitDialogOpen] = useState(false);

  useEffect(() => {
    // Create event listeners for onboarding create actions
    const handleCreateTask = () => {
      console.log("Create task event received");
      setTaskDialogOpen(true);
    };
    const handleCreateHabit = () => {
      console.log("Create habit event received");
      setHabitDialogOpen(true);
    };

    // Add event listeners
    window.addEventListener("create-onboarding-task", handleCreateTask);
    window.addEventListener("create-onboarding-habit", handleCreateHabit);

    console.log("Tutorial wrapper initialized and listening for events");

    // Clean up
    return () => {
      window.removeEventListener("create-onboarding-task", handleCreateTask);
      window.removeEventListener("create-onboarding-habit", handleCreateHabit);
      console.log("Tutorial wrapper event listeners removed");
    };
  }, []);

  return (
    <>
      <div data-onboarding="true" className="onboarding-context">
        <TutorialGuide />
        <CreateTaskDialog open={taskDialogOpen} setOpen={setTaskDialogOpen} />
        <CreateHabitDialog
          open={habitDialogOpen}
          setOpen={setHabitDialogOpen}
        />
      </div>
    </>
  );
}
