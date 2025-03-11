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
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { type Category } from "~/lib/utils";
import { useUser } from "@clerk/nextjs";

const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
  icon: z.string().min(1, "Icon is required"),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface EditCategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  category: Category | null;
  onCategoryUpdated: () => void;
}

export function EditCategoryDialog({
  open,
  setOpen,
  category,
  onCategoryUpdated,
}: EditCategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || "",
      color: category?.color || "#3498DB",
      icon: category?.icon || "Heart",
    },
  });

  // Update form when category changes
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        color: category.color,
        icon: category.icon,
      });
    }
  }, [category, form]);

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
    if (!category) return;

    try {
      setIsSubmitting(true);
      const categoryData = {
        name: data.name,
        color: data.color,
        icon: data.icon,
      };

      const response = await fetch(`/api/categories/${category.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating category:", errorData);
        toast.error("Failed to update category");
      } else {
        const updatedCategory = await response.json();
        console.log("Category updated successfully:", updatedCategory);
        toast.success("Category updated successfully");
        form.reset();
        setOpen(false);
        onCategoryUpdated(); // Callback to refresh categories list

        // Refresh tasks that might be using this category
        sessionStorage.setItem("refreshTaskData", "true");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update details for this category.
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
                    value={field.value}
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
