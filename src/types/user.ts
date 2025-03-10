import { z } from "zod";

export const UserSchema = z.object({
  username: z.string().min(1),
  clerkId: z.string().min(1),
});

// Add the .partial() method to the schema
UserSchema.partial = () => UserSchema.extend({}).partial();

export type UserType = z.infer<typeof UserSchema>;
