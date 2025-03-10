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
import { AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { type Category } from "~/lib/utils";

interface DeleteCategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  category: Category | null;
  onCategoryDeleted: () => void;
}

export function DeleteCategoryDialog({
  open,
  setOpen,
  category,
  onCategoryDeleted,
}: DeleteCategoryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [usageInfo, setUsageInfo] = useState<{
    tasksCount: number;
    goalsCount: number;
    inUse: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if category is in use when dialog opens
  useEffect(() => {
    if (category?.id && open) {
      setIsLoading(true);
      setUsageInfo(null);

      fetch(`/api/categories/${category.id}/stats`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Failed to fetch category stats: ${response.status}`,
            );
          }
          return response.json();
        })
        .then((data) => {
          const inUse = data.tasksCount > 0 || data.goalsCount > 0;
          setUsageInfo({
            tasksCount: data.tasksCount || 0,
            goalsCount: data.goalsCount || 0,
            inUse,
          });
        })
        .catch((error) => {
          console.error("Error fetching category stats:", error);
          toast.error("Failed to check if category can be deleted");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (!open) {
      // Reset state when dialog closes
      setIsLoading(true);
      setUsageInfo(null);
    }
  }, [category, open]);

  async function deleteCategory() {
    if (!category) return;

    try {
      setIsDeleting(true);

      const response = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting category:", errorData);

        if (errorData.error === "Cannot delete category that is in use") {
          toast.error(
            "Cannot delete category that is in use by tasks or goals",
          );
        } else {
          toast.error("Failed to delete category");
        }
      } else {
        toast.success("Category deleted successfully");
        setOpen(false);
        onCategoryDeleted(); // Callback to refresh categories list
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("An error occurred");
    } finally {
      setIsDeleting(false);
    }
  }

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Delete Category
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the category &quot;{category.name}
            &quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-6 text-center">Checking category usage...</div>
        ) : usageInfo?.inUse ? (
          <div className="border-destructive bg-destructive/10 text-destructive rounded-md border p-4">
            <p className="mb-2 font-medium">
              This category cannot be deleted because it is in use:
            </p>
            <ul className="ml-6 list-disc">
              {usageInfo.tasksCount > 0 && (
                <li>Used by {usageInfo.tasksCount} task(s)</li>
              )}
              {usageInfo.goalsCount > 0 && (
                <li>Used by {usageInfo.goalsCount} goal(s)</li>
              )}
            </ul>
            <p className="mt-2 text-sm">
              Please reassign or delete these items before deleting this
              category.
            </p>
          </div>
        ) : (
          <p className="py-2">This will permanently delete the category.</p>
        )}

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={deleteCategory}
            disabled={isDeleting || isLoading || (usageInfo?.inUse ?? false)}
          >
            {isDeleting ? "Deleting..." : "Delete Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
