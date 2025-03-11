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
import { Settings, Save, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";

// Define the user settings type
type UserSettings = {
  theme: "system" | "light" | "dark";
  compactMode: boolean;
  showCompletedTasks: boolean;
  defaultView: "today" | "upcoming" | "completed";
  reminderTime: string;
  weekStartsOn: "monday" | "sunday";
  enableNotifications: boolean;
  enableSounds: boolean;
};

// Default settings
const defaultSettings: UserSettings = {
  theme: "system",
  compactMode: false,
  showCompletedTasks: true,
  defaultView: "today",
  reminderTime: "09:00",
  weekStartsOn: "monday",
  enableNotifications: true,
  enableSounds: true,
};

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user settings
  useEffect(() => {
    const loadSettings = async () => {
      if (!isLoaded || !user) return;

      try {
        const response = await fetch("/api/user/settings");

        if (response.ok) {
          const data = await response.json();
          setSettings({
            ...defaultSettings,
            ...data,
          });
        }
      } catch (error) {
        console.error("Error loading settings:", error);
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
      const response = await fetch("/api/user/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    toast.info("Settings reset to defaults");
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Settings</h1>
      <p className="text-muted-foreground mb-8">Customize your experience</p>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Application Settings</CardTitle>
          </div>
          <CardDescription>
            Customize how the application looks and behaves
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Appearance</h3>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme">Theme</Label>
                <p className="text-muted-foreground text-sm">
                  Choose your preferred color theme
                </p>
              </div>
              <Select
                value={settings.theme}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    theme: value as "system" | "light" | "dark",
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compactMode">Compact Mode</Label>
                <p className="text-muted-foreground text-sm">
                  Display more content with less spacing
                </p>
              </div>
              <Switch
                id="compactMode"
                checked={settings.compactMode}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, compactMode: checked })
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Task Preferences</h3>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showCompletedTasks">Show Completed Tasks</Label>
                <p className="text-muted-foreground text-sm">
                  Display completed tasks in task lists
                </p>
              </div>
              <Switch
                id="showCompletedTasks"
                checked={settings.showCompletedTasks}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, showCompletedTasks: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="defaultView">Default Task View</Label>
                <p className="text-muted-foreground text-sm">
                  Choose which task view to show by default
                </p>
              </div>
              <Select
                value={settings.defaultView}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    defaultView: value as "today" | "upcoming" | "completed",
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select default view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notifications</h3>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableNotifications">
                  Enable Notifications
                </Label>
                <p className="text-muted-foreground text-sm">
                  Receive notifications for tasks and habits
                </p>
              </div>
              <Switch
                id="enableNotifications"
                checked={settings.enableNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, enableNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableSounds">Enable Sounds</Label>
                <p className="text-muted-foreground text-sm">
                  Play sounds for notifications and actions
                </p>
              </div>
              <Switch
                id="enableSounds"
                checked={settings.enableSounds}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, enableSounds: checked })
                }
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetToDefaults}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveSettings} disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
