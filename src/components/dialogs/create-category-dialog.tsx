"use client"

import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
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
} from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
  icon: z.string().min(1, "Icon is required"),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

interface CreateCategoryDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function CreateCategoryDialog({ open, setOpen }: CreateCategoryDialogProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      color: "#3498DB",
      icon: "Heart",
    },
  })

  const icons = [
    { name: "Heart", component: Heart },
    { name: "Dumbbell", component: Dumbbell },
    { name: "Lotus", component: Lotus },
    { name: "Briefcase", component: Briefcase },
    { name: "Book", component: Book },
    { name: "GraduationCap", component: GraduationCap },
    { name: "DollarSign", component: DollarSign },
    { name: "Home", component: Home },
    { name: "Users", component: Users },
    { name: "Paintbrush", component: Paintbrush },
    { name: "Laptop", component: Laptop },
    { name: "Plane", component: Plane },
    { name: "Apple", component: Apple },
    { name: "Spa", component: Spa },
  ]

  function onSubmit(data: CategoryFormValues) {
    console.log(data)
    // Here you would typically save the category to your database
    setOpen(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>Add a new category to organize your tasks and goals.</DialogDescription>
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
                      <Input type="color" {...field} className="w-12 h-10 p-1" />
                      <Input type="text" value={field.value} onChange={field.onChange} className="flex-1" />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
  )
}

