import { NextRequest, NextResponse } from "next/server";
import { categoryService, CategorySchema } from "~/services/category";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

// This route handles requests to /api/categories by forwarding to the same
// logic as /api/categories/index

export async function GET(req: NextRequest) {
  try {
    // Get user ID from Clerk auth
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Fetching categories for userId:", userId);

    // Get pagination parameters from URL
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");

    // Get categories from database using categoryService
    const categories = await categoryService.getCategoriesByUserId(userId);

    console.log("Found categories:", categories.length);

    // Apply pagination (simple implementation)
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCategories = categories.slice(startIndex, endIndex);

    // Return results with pagination metadata
    return NextResponse.json({
      categories: paginatedCategories,
      pagination: {
        total: categories.length,
        page,
        limit,
        totalPages: Math.ceil(categories.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate the request body
    const body = await req.json();
    const validatedData = CategorySchema.parse(body);

    // Create the category using categoryService
    const category = await categoryService.createCategory(
      userId,
      validatedData,
    );

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          errors: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
