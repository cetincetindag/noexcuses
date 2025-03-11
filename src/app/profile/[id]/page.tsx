"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Edit, Trophy, Medal, Star, Calendar, Save, X } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";

// Mocked data - In a real app, this would come from an API
const mockUserData = {
  id: "user123",
  username: "JaneDoe",
  fullName: "Jane Doe",
  avatar: "/avatars/user.jpg",
  bio: "Focused on building better habits and creating a more productive life one step at a time.",
  joinedDate: "January 2023",
  stats: {
    longestStreak: 42,
    currentStreak: 12,
    habitsCompleted: 345,
    tasksCompleted: 278,
  },
  badges: [
    { id: 1, name: "30 Day Streak", icon: <Trophy className="h-4 w-4" /> },
    { id: 2, name: "Habit Master", icon: <Medal className="h-4 w-4" /> },
    { id: 3, name: "Early Riser", icon: <Star className="h-4 w-4" /> },
    { id: 4, name: "100 Tasks", icon: <Calendar className="h-4 w-4" /> },
  ],
};

interface EditableFieldProps {
  value: string;
  isEditing: boolean;
  fieldKey: string;
  isMultiline?: boolean;
  onUpdate: (key: string, value: string) => void;
}

function EditableField({
  value,
  isEditing,
  fieldKey,
  isMultiline = false,
  onUpdate,
}: EditableFieldProps) {
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value, isEditing]);

  if (!isEditing) {
    return <>{value}</>;
  }

  return isMultiline ? (
    <Textarea
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={() => onUpdate(fieldKey, editValue)}
      className="min-h-24"
    />
  ) : (
    <Input
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={() => onUpdate(fieldKey, editValue)}
    />
  );
}

export default function ProfilePage() {
  const params = useParams();
  const userId = (params?.id as string) || "unknown";

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(mockUserData);
  const [isOwner, setIsOwner] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editFields, setEditFields] = useState({
    username: false,
    fullName: false,
    bio: false,
  });

  useEffect(() => {
    // In a real app, fetch the user data based on the user ID
    // and check if the current user is the owner
    setTimeout(() => {
      setIsLoading(false);
      // Mock check if the current user is the profile owner
      setIsOwner(true); // For demo purposes, assume we're the owner
    }, 1000);
  }, [userId]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    // Reset all edit fields when toggling edit mode
    setEditFields({
      username: false,
      fullName: false,
      bio: false,
    });
  };

  const toggleField = (field: keyof typeof editFields) => {
    if (editMode) {
      setEditFields({
        ...editFields,
        [field]: !editFields[field],
      });
    }
  };

  const updateField = (field: string, value: string) => {
    setUserData({
      ...userData,
      [field]: value,
    });
    setEditFields({
      ...editFields,
      [field]: false,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="overflow-hidden">
        <div className="h-32 w-full bg-gradient-to-r from-indigo-500 to-purple-600" />
        <CardHeader className="-mt-16 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
              <Avatar className="border-background h-24 w-24 border-4">
                <AvatarImage src={userData.avatar} alt={userData.username} />
                <AvatarFallback>
                  {userData.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle
                  className={cn(
                    "text-2xl font-bold",
                    editMode && "hover:text-primary cursor-pointer",
                  )}
                  onClick={() => toggleField("fullName")}
                >
                  <EditableField
                    value={userData.fullName}
                    isEditing={editFields.fullName}
                    fieldKey="fullName"
                    onUpdate={updateField}
                  />
                </CardTitle>
                <CardDescription
                  className={cn(
                    "text-sm",
                    editMode && "hover:text-primary cursor-pointer",
                  )}
                  onClick={() => toggleField("username")}
                >
                  @
                  <EditableField
                    value={userData.username}
                    isEditing={editFields.username}
                    fieldKey="username"
                    onUpdate={updateField}
                  />
                </CardDescription>
                <CardDescription>
                  Member since {userData.joinedDate}
                </CardDescription>
              </div>
            </div>
            {isOwner && (
              <Button
                variant={editMode ? "destructive" : "outline"}
                onClick={toggleEditMode}
                className="mt-4 md:mt-0"
              >
                {editMode ? (
                  <>
                    <X className="mr-2 h-4 w-4" /> Cancel Editing
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label
              htmlFor="bio"
              className={cn(
                "text-sm font-medium",
                editMode && "hover:text-primary cursor-pointer",
              )}
              onClick={() => toggleField("bio")}
            >
              Bio
            </Label>
            <div className="text-muted-foreground mt-1 text-sm">
              <EditableField
                value={userData.bio}
                isEditing={editFields.bio}
                fieldKey="bio"
                isMultiline={true}
                onUpdate={updateField}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Stats</h3>
            <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg border p-3 text-center">
                <p className="text-muted-foreground text-xs">Current Streak</p>
                <p className="mt-1 text-2xl font-bold">
                  {userData.stats.currentStreak}
                </p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <p className="text-muted-foreground text-xs">Longest Streak</p>
                <p className="mt-1 text-2xl font-bold">
                  {userData.stats.longestStreak}
                </p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <p className="text-muted-foreground text-xs">
                  Habits Completed
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {userData.stats.habitsCompleted}
                </p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <p className="text-muted-foreground text-xs">Tasks Completed</p>
                <p className="mt-1 text-2xl font-bold">
                  {userData.stats.tasksCompleted}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Badges</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {userData.badges.map((badge) => (
                <Badge key={badge.id} className="px-3 py-1" variant="outline">
                  <span className="mr-1">{badge.icon}</span> {badge.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-between border-t px-6 py-4">
          <p className="text-muted-foreground text-xs">Profile ID: {userId}</p>
          {editMode && (
            <Button variant="default" onClick={toggleEditMode}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
