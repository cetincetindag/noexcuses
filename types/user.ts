import { z } from "zod";

// Define the User schema for validation
export const UserSchema = z.object({
  clerkId: z.string().min(1, "Clerk ID is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format").optional(),
  name: z.string().optional(),
  timezone: z.string().optional(),
  tutorialComplete: z.boolean().default(false),
});

export type UserType = z.infer<typeof UserSchema>;
