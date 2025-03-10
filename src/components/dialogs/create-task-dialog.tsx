"use client";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { triggerKanbanRefresh } from "~/components/kanban/kanban-board";
import { Frequency } from "@prisma/client";
import { CalendarIcon, CheckCircle2, Circle, Clock, Star } from "lucide-react";
import { cn } from "~/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

// Define form schema
const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  description: z.string().optional(),
  priority: z.number().min(1).max(5).default(3),
  categoryId: z.string({
    required_error: "Please select a category",
  }),
  frequency: z.enum(["ONCE", "DAILY", "WEEKLY", "MONTHLY"]).default("ONCE"),
  dueDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type CreateTaskDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onTaskCreated?: () => void;
};

export function CreateTaskDialog({
  open,
  setOpen,
  onTaskCreated,
}: CreateTaskDialogProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: 3,
      frequency: "ONCE",
    },
  });

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();

        // Ensure data is an array
        if (Array.isArray(data)) {
          setCategories(data);

          // If there are categories, set the first one as default
          if (data.length > 0) {
            form.setValue("categoryId", data[0].id);
          }
        } else if (data && Array.isArray(data.categories)) {
          // Handle case where API returns an object with categories array
          setCategories(data.categories);

          // If there are categories, set the first one as default
          if (data.categories.length > 0) {
            form.setValue("categoryId", data.categories[0].id);
          }
        } else {
          console.warn("Unexpected categories data format:", data);
          setCategories([]);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
      setCategories([]);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("You must be logged in to create a task");
      return;
    }

    setIsLoading(true);
    try {
      // Create task data with all required fields
      const taskData = {
        ...data,
        userId: user.id,
        order: 0,
        completed: false,
        dailyStreak: 0,
        weeklyStreak: 0,
        monthlyStreak: 0,
        isCompletedToday: false,
        // Handle empty fields
        description: data.description || "",
        // Properly handle the dueDate field
        dueDate: data.dueDate instanceof Date ? data.dueDate : null,
      };

      console.log(
        "Creating task with data:",
        JSON.stringify(
          taskData,
          (key, value) => {
            // Special handling for Date objects in JSON.stringify
            if (value instanceof Date) {
              return value.toISOString();
            }
            return value;
          },
          2,
        ),
      );

      try {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });

        // Log response status to help with debugging
        console.log(
          `Response status: ${response.status} ${response.statusText}`,
        );

        // Try to get response body regardless of success or failure
        let responseData;
        try {
          const text = await response.text();
          console.log("Raw response:", text);

          // Try to parse as JSON if possible
          try {
            responseData = text ? JSON.parse(text) : {};
            console.log("Parsed response data:", responseData);
          } catch (parseError) {
            console.log("Could not parse response as JSON:", parseError);
            responseData = { error: text || "Unknown error" };
          }
        } catch (readError) {
          console.error("Error reading response:", readError);
          responseData = { error: "Could not read response" };
        }

        if (!response.ok) {
          console.error("Error creating task:", responseData);
          let errorMessage = "Failed to create task";

          if (responseData.error) {
            errorMessage = responseData.error;
          }

          if (responseData.details) {
            errorMessage +=
              ": " +
              (Array.isArray(responseData.details)
                ? responseData.details
                    .map((d: { path: string; message: string } | string) =>
                      typeof d === "object" ? `${d.path}: ${d.message}` : d,
                    )
                    .join(", ")
                : responseData.details);
          }

          toast.error(errorMessage);
        } else {
          toast.success("Task created successfully!");
          form.reset();
          setOpen(false);

          // If this task was created during onboarding, ensure data refresh on dashboard
          if (
            window.location.pathname.includes("onboarding") ||
            document.querySelector('[data-onboarding="true"]')
          ) {
            console.log(
              "Task created during onboarding - ensuring data refresh",
            );
            // Store a flag in sessionStorage indicating fresh data is needed
            sessionStorage.setItem("refreshTaskData", "true");
          }

          onTaskCreated?.();
          triggerKanbanRefresh();
        }
      } catch (fetchError) {
        // This catches network errors like CORS, network offline, etc.
        console.error("Network error creating task:", fetchError);
        toast.error(
          `Network error: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`,
        );
      }
    } catch (error) {
      console.error("Error preparing task data:", error);
      toast.error(
        `An error occurred: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New Task
          </DialogTitle>
          <DialogDescription>
            Add a new task to track your progress and stay organized.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter task title"
                          {...field}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add more details about this task"
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.isArray(categories) ? (
                            categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: category.color }}
                                  />
                                  {category.name}
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-category" disabled>
                              No categories available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="details" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          defaultValue={field.value.toString()}
                          className="flex space-x-1"
                        >
                          {[1, 2, 3, 4, 5].map((priority) => (
                            <FormItem
                              key={priority}
                              className="flex flex-col items-center space-y-1"
                            >
                              <FormControl>
                                <RadioGroupItem
                                  value={priority.toString()}
                                  id={`priority-${priority}`}
                                  className="peer sr-only"
                                />
                              </FormControl>
                              <FormLabel
                                htmlFor={`priority-${priority}`}
                                className={cn(
                                  "flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 p-2 text-center font-medium",
                                  "peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground",
                                  "hover:bg-muted",
                                  parseInt(field.value.toString()) === priority
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-muted",
                                )}
                              >
                                {priority}
                                {priority === 5 && (
                                  <Star className="ml-1 h-3 w-3" />
                                )}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ONCE">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Once
                            </div>
                          </SelectItem>
                          <SelectItem value="DAILY">
                            <div className="flex items-center gap-2">
                              <Circle className="h-4 w-4" />
                              Daily
                            </div>
                          </SelectItem>
                          <SelectItem value="WEEKLY">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Weekly
                            </div>
                          </SelectItem>
                          <SelectItem value="MONTHLY">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4" />
                              Monthly
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="relative">
                {isLoading ? "Creating..." : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
