// pages/api/clerk-webhook.js or app/api/clerk-webhook/route.js (App Router)

import { Webhook } from "svix";
import { headers } from "next/headers"; // For App Router
import { userService } from "~/services/user";

interface WebhookEvent {
  type: string;
  data: {
    id: string;
    username?: string;
    user_id: string;
    email_addresses?: { email_address: string }[];
  };
}

export async function POST(req: Request) {
  // Verify the webhook (App Router version)
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Get the webhook secret from environment variables
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET is not set");
  }

  // Verify the payload
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(webhookSecret);
  let evt;

  try {
    if (!svix_id || !svix_timestamp || !svix_signature) {
      throw new Error("Missing svix headers");
    }
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }

  // Handle the webhook event
  const eventType = evt.type;

  if (eventType === "user.created") {
    // A new user has signed up
    const { id, username } = evt.data;
    if (!id) {
      throw new Error("id is not defined");
    }
    if (!username) {
      throw new Error("username is not defined");
    }

    await userService.createUserWithDefaultCategories({
      clerkId: id,
      username: username,
    });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    if (!id) {
      throw new Error("id is not defined");
    }
    await userService.deleteUser(id);
  }

  /*if (eventType === "session.created") {
    // User has signed in
    const { user_id } = evt.data;

    if (!user_id) {
      throw new Error("user_id is not defined");
    }

    // Example: Update last login timestamp
    await userService.updateUserLoginTimestamp(user_id);

    // Example: Track analytics
    await userService.logUserSignIn(user_id);
  }*/

  return new Response("Webhook received", { status: 200 });
}

// For Pages Router, the export would be different:
// export default async function handler(req, res) {
//   // Similar logic but using req.body and res.status().json()
// }
