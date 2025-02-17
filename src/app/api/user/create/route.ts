import { NextRequest, NextResponse } from "next/server";
import { UserService } from "~/services/user";
import { userDataSchema } from "~/types/user";
import { z } from "zod";

const userService = new UserService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = userDataSchema.parse(body);

    const usernameExists = await userService.checkUsernameExists(validatedData.username);
    if (usernameExists) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    console.log(validatedData);
    const user = await userService.createUser(validatedData);
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

    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
