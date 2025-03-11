import { NextRequest, NextResponse } from "next/server";
import { categoryService, CategorySchema } from "~/services/category";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    // Await the entire context.params before destructuring
    const params = await Promise.resolve(context.params);
    const id = params.id;

    // Get authenticated user's ID using Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the category by ID, ensuring it belongs to the authenticated user
    const category = await categoryService.getCategoryById(id, userId);

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    // Await the entire context.params before destructuring
    const params = await Promise.resolve(context.params);
    const id = params.id;

    // Get authenticated user's ID using Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();

    try {
      CategorySchema.partial().parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: "Validation error",
            details: validationError.errors.map((err) => ({
              path: err.path.join("."),
              message: err.message,
            })),
          },
          { status: 400 },
        );
      }
    }

    // Check if the category exists first to give a proper 404 response if needed
    const existingCategory = await categoryService.getCategoryById(id, userId);

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    // Update the category using categoryService
    const updatedCategory = await categoryService.updateCategory(
      id,
      body,
      userId,
    );

    console.log("Category updated successfully:", updatedCategory);
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    // Await the entire context.params before destructuring
    const params = await Promise.resolve(context.params);
    const id = params.id;

    // Get authenticated user's ID using Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the category exists first to give a proper 404 response if needed
    const existingCategory = await categoryService.getCategoryById(id, userId);

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    // Check if category is in use by tasks, habits, or routines
    const usageInfo = await categoryService.checkCategoryInUse(id, userId);

    // If category is in use, prevent deletion
    if (usageInfo.inUse) {
      return NextResponse.json(
        {
          error: "Cannot delete category that is in use",
          details: {
            tasksUsingCategory: usageInfo.tasksCount,
            habitsUsingCategory: usageInfo.habitsCount,
            routinesUsingCategory: usageInfo.routinesCount,
          },
        },
        { status: 400 },
      );
    }

    // Delete the category
    await categoryService.deleteCategory(id, userId);

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
