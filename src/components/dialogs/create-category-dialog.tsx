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
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Apple,
  Book,
  Briefcase,
  DollarSign,
  Dumbbell,
  GraduationCap,
  Heart,
  Home,
  Laptop,
  NotebookIcon as Lotus,
  Paintbrush,
  Plane,
  SpadeIcon as Spa,
  Users,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
  icon: z.string().min(1, "Icon is required"),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CreateCategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CreateCategoryDialog({
  open,
  setOpen,
}: CreateCategoryDialogProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      color: "#3498DB",
      icon: "Heart",
    },
  });

  const icons = [
    { name: "Heart", component: Heart },
    { name: "Dumbbell", component: Dumbbell },
    { name: "Lotus", component: Lotus },
    { name: "Briefcase", component: Briefcase },
    { name: "Book", component: Book },
    { name: "Graduation Cap", component: GraduationCap },
    { name: "Dollar Sign", component: DollarSign },
    { name: "Home", component: Home },
    { name: "Users", component: Users },
    { name: "Paintbrush", component: Paintbrush },
    { name: "Laptop", component: Laptop },
    { name: "Plane", component: Plane },
    { name: "Apple", component: Apple },
    { name: "Spa", component: Spa },
  ];

  async function onSubmit(data: CategoryFormValues) {
    try {
      const categoryData = {
        name: data.name,
        color: data.color,
        icon: data.icon,
        priority: 1,
        order: 1,
      };

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating category:", errorData);
        toast.error("Failed to create category");
      } else {
        const createdCategory = await response.json();
        console.log("Category created successfully:", createdCategory);
        toast.success("Category created successfully");
        form.reset();
        setOpen(false);

        // Refresh tasks that might be using this category
        sessionStorage.setItem("refreshTaskData", "true");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>
            Add a new category to organize your tasks and goals.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        {...field}
                        className="h-10 w-12 p-1"
                      />
                      <Input
                        type="text"
                        value={field.value}
                        onChange={field.onChange}
                        className="flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {icons.map((icon) => (
                        <SelectItem key={icon.name} value={icon.name}>
                          <div className="flex items-center gap-2">
                            <icon.component className="h-4 w-4" />
                            {icon.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Create Category</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

type Goal = {
  id: string; // or number
  title: string;
  // Add other properties as needed
};

function GoalsList() {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const fetchGoals = async () => {
      const response = await fetch("/api/goals");
      const data = await response.json();
      setGoals(data);
    };

    fetchGoals();
  }, []);

  return (
    <ul>
      {goals.map((goal) => (
        <li key={goal.id}>{goal.title}</li>
      ))}
    </ul>
  );
}
