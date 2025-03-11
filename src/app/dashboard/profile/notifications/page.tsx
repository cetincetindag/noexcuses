"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Bell, Save } from "lucide-react";
import { Separator } from "~/components/ui/separator";

// Define the notification settings type
type NotificationSettings = {
  email: {
    taskReminders: boolean;
    habitReminders: boolean;
    weeklyDigest: boolean;
    accountUpdates: boolean;
  };
  push: {
    taskReminders: boolean;
    habitReminders: boolean;
    achievementUnlocked: boolean;
    streakMilestones: boolean;
  };
};

// Default notification settings
const defaultSettings: NotificationSettings = {
  email: {
    taskReminders: true,
    habitReminders: true,
    weeklyDigest: true,
    accountUpdates: true,
  },
  push: {
    taskReminders: true,
    habitReminders: true,
    achievementUnlocked: true,
    streakMilestones: true,
  },
};

export default function NotificationsPage() {
  const { user, isLoaded } = useUser();
  const [settings, setSettings] =
    useState<NotificationSettings>(defaultSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load notification settings
  useEffect(() => {
    const loadSettings = async () => {
      if (!isLoaded || !user) return;

      try {
        const response = await fetch("/api/user/notifications");

        if (response.ok) {
          const data = await response.json();
          setSettings({
            ...defaultSettings,
            ...data,
          });
        }
      } catch (error) {
        console.error("Error loading notification settings:", error);
        // Fall back to default settings
        setSettings(defaultSettings);
      }
    };

    loadSettings();
  }, [isLoaded, user]);

  const handleSaveSettings = async () => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/user/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error("Failed to save notification settings");
      }

      toast.success("Notification settings saved successfully");
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateEmailSetting = (
    key: keyof NotificationSettings["email"],
    value: boolean,
  ) => {
    setSettings({
      ...settings,
      email: {
        ...settings.email,
        [key]: value,
      },
    });
  };

  const updatePushSetting = (
    key: keyof NotificationSettings["push"],
    value: boolean,
  ) => {
    setSettings({
      ...settings,
      push: {
        ...settings.push,
        [key]: value,
      },
    });
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <p>Loading notification settings...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Notifications</h1>
      <p className="text-muted-foreground mb-8">
        Manage your notification preferences
      </p>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notification Settings</CardTitle>
          </div>
          <CardDescription>
            Choose which notifications you want to receive and how
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Email Notifications</h3>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-task-reminders">Task Reminders</Label>
                <p className="text-muted-foreground text-sm">
                  Receive email reminders for upcoming and due tasks
                </p>
              </div>
              <Switch
                id="email-task-reminders"
                checked={settings.email.taskReminders}
                onCheckedChange={(checked: boolean) =>
                  updateEmailSetting("taskReminders", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-habit-reminders">Habit Reminders</Label>
                <p className="text-muted-foreground text-sm">
                  Receive email reminders for your daily habits
                </p>
              </div>
              <Switch
                id="email-habit-reminders"
                checked={settings.email.habitReminders}
                onCheckedChange={(checked: boolean) =>
                  updateEmailSetting("habitReminders", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-weekly-digest">Weekly Digest</Label>
                <p className="text-muted-foreground text-sm">
                  Receive a weekly summary of your progress
                </p>
              </div>
              <Switch
                id="email-weekly-digest"
                checked={settings.email.weeklyDigest}
                onCheckedChange={(checked: boolean) =>
                  updateEmailSetting("weeklyDigest", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-account-updates">Account Updates</Label>
                <p className="text-muted-foreground text-sm">
                  Receive important updates about your account
                </p>
              </div>
              <Switch
                id="email-account-updates"
                checked={settings.email.accountUpdates}
                onCheckedChange={(checked: boolean) =>
                  updateEmailSetting("accountUpdates", checked)
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Push Notifications</h3>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-task-reminders">Task Reminders</Label>
                <p className="text-muted-foreground text-sm">
                  Receive push notifications for upcoming and due tasks
                </p>
              </div>
              <Switch
                id="push-task-reminders"
                checked={settings.push.taskReminders}
                onCheckedChange={(checked: boolean) =>
                  updatePushSetting("taskReminders", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-habit-reminders">Habit Reminders</Label>
                <p className="text-muted-foreground text-sm">
                  Receive push notifications for your daily habits
                </p>
              </div>
              <Switch
                id="push-habit-reminders"
                checked={settings.push.habitReminders}
                onCheckedChange={(checked: boolean) =>
                  updatePushSetting("habitReminders", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-achievement-unlocked">
                  Achievement Notifications
                </Label>
                <p className="text-muted-foreground text-sm">
                  Receive notifications when you unlock achievements
                </p>
              </div>
              <Switch
                id="push-achievement-unlocked"
                checked={settings.push.achievementUnlocked}
                onCheckedChange={(checked: boolean) =>
                  updatePushSetting("achievementUnlocked", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-streak-milestones">
                  Streak Milestones
                </Label>
                <p className="text-muted-foreground text-sm">
                  Receive notifications when you reach streak milestones
                </p>
              </div>
              <Switch
                id="push-streak-milestones"
                checked={settings.push.streakMilestones}
                onCheckedChange={(checked: boolean) =>
                  updatePushSetting("streakMilestones", checked)
                }
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSaveSettings} disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
