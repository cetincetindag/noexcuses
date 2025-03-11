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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { User, Mail, Calendar, Edit } from "lucide-react";
import { format } from "date-fns";

export default function AccountPage() {
  const { user, isLoaded } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      setUsername(user.username || "");
      setEmail(user.primaryEmailAddress?.emailAddress || "");
    }
  }, [isLoaded, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setIsSubmitting(true);

    try {
      // Update user profile
      await user.update({
        username,
      });

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Account</h1>
      <p className="text-muted-foreground mb-8">
        Manage your account information
      </p>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>Profile Information</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="mr-2 h-4 w-4" />
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>
            <CardDescription>
              Your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your username"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={email}
                    disabled
                    placeholder="Your email"
                  />
                  <p className="text-muted-foreground text-xs">
                    Email can only be changed in account settings
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Username</p>
                  <p className="text-muted-foreground">
                    {user?.username || "Not set"}
                  </p>
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress || "Not set"}
                  </p>
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-muted-foreground">
                    {user?.createdAt
                      ? format(new Date(user.createdAt), "MMMM d, yyyy")
                      : "Unknown"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-muted-foreground text-xs">
              Last sign in:{" "}
              {user?.lastSignInAt
                ? format(
                    new Date(user.lastSignInAt),
                    "MMMM d, yyyy 'at' h:mm a",
                  )
                : "Unknown"}
            </p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <CardTitle>Email Preferences</CardTitle>
            </div>
            <CardDescription>
              Manage your email notification settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Email notification preferences can be managed in the Notifications
              tab.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
