import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "~/services/category";
import { auth } from "@clerk/nextjs/server";

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

    // Check if the category exists
    const category = await categoryService.getCategoryById(id, userId);

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    // Get usage statistics for the category
    const usageInfo = await categoryService.checkCategoryInUse(id, userId);

    return NextResponse.json({
      categoryId: id,
      tasksCount: usageInfo.tasksCount,
      goalsCount: usageInfo.goalsCount,
    });
  } catch (error) {
    console.error("Error fetching category stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch category statistics" },
      { status: 500 },
    );
  }
}
