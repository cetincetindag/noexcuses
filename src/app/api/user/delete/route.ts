import { NextRequest, NextResponse } from "next/server";
import { userService } from "~/services/user";
import { z } from "zod";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await userService.deleteUser(body.userId);
    return NextResponse.json(user, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid data",
          details: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
