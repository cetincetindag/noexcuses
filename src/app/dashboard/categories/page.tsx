"use client";

import { CategoryCard } from "~/components/categories/category-card";
import { type Category } from "~/lib/utils";
import { useEffect, useState, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { CreateCategoryDialog } from "~/components/dialogs/create-category-dialog";
import { toast } from "sonner";

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 16,
    totalPages: 1,
  });

  // Calculate appropriate limit based on screen size
  const calculateLimit = useCallback(() => {
    // Default to 16 cards (4x4 grid on large screens)
    let limit = 16;

    // Adjust based on viewport width
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width >= 1440) {
        // 2xl: 8 columns, so 16 items (8x2)
        limit = 16;
      } else if (width >= 1280) {
        // xl: 6 columns, so 18 items (6x3)
        limit = 18;
      } else if (width >= 1024) {
        // lg: 5 columns, so 15 items (5x3)
        limit = 15;
      } else if (width >= 768) {
        // md: 4 columns, so 12 items (4x3)
        limit = 12;
      } else if (width >= 640) {
        // sm: 3 columns, so 9 items (3x3)
        limit = 9;
      } else {
        // xs: 2 columns, so 6 items (2x3)
        limit = 6;
      }
    }

    return limit;
  }, []);

  // Function to fetch categories with pagination
  async function fetchCategories(page = 1, forceRefresh = false) {
    const currentLimit = calculateLimit();

    try {
      setIsLoading(true);
      console.log(`Fetching categories: page ${page}, limit ${currentLimit}`);

      const response = await fetch(
        `/api/categories?page=${page}&limit=${currentLimit}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data);

      setCategories(data.categories || []);
      setPagination((prevState) => {
        const newState = {
          ...(data.pagination || {
            total: 0,
            page: page,
            totalPages: 1,
          }),
          limit: currentLimit,
        };
        console.log("Updating pagination:", newState);
        return newState;
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Handle window resize
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;

    const handleResize = () => {
      // Debounce the resize event
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newLimit = calculateLimit();
        if (newLimit !== pagination.limit) {
          // Only refetch if the limit has changed, maintain current page
          fetchCategories(pagination.page, true);
        }
      }, 300); // 300ms debounce
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [pagination.limit, pagination.page, calculateLimit]);

  // Initial fetch when dialog closes
  useEffect(() => {
    fetchCategories(1);
  }, [createDialogOpen]);

  // Handle pagination
  const goToNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      const nextPage = pagination.page + 1;
      console.log(`Navigating to next page: ${nextPage}`);
      fetchCategories(nextPage);
    }
  };

  const goToPreviousPage = () => {
    if (pagination.page > 1) {
      const prevPage = pagination.page - 1;
      console.log(`Navigating to previous page: ${prevPage}`);
      fetchCategories(prevPage);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Manage your task and habit categories
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      {/* Pagination controls at the top */}
      {!isLoading && categories.length > 0 && pagination.totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={pagination.page === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={pagination.page === pagination.totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <p>Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-xl font-semibold">No categories found</h2>
          <p className="text-muted-foreground mt-2">
            Create your first category to get started.
          </p>
          <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Category
          </Button>
        </div>
      ) : (
        <div className="min-h-[400px]">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onCategoryUpdated={() => fetchCategories(pagination.page)}
              />
            ))}
          </div>
        </div>
      )}

      <CreateCategoryDialog
        open={createDialogOpen}
        setOpen={setCreateDialogOpen}
      />
    </div>
  );
}
