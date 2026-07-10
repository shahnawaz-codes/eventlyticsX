import { Request, Response } from "express";
import { Webhook } from "svix";
import { prisma } from "../config/db.js";

export const clerkWebhook = async (req: Request, res: Response) => {
  console.log("run webhook");
  const payload = req.body?.toString();
  const headers = req.headers;
  // Retrieve Svix headers
  const svixId = headers["svix-id"] as string;
  const svixTimestamp = headers["svix-timestamp"] as string;
  const svixSignature = headers["svix-signature"] as string;
  if (!svixId || !svixTimestamp || !svixSignature) {
    console.warn("Missing Svix headers in webhook request:", {
      svixId,
      svixTimestamp,
      svixSignature,
    });
    return res.status(400).json({ error: "Missing Svix headers" });
  }
  let event: any;
  try {
    // Initialize Svix Webhook validator
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
    // Verify signature. If it matches, returns the verified JSON payload object
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-signature": svixSignature,
      "svix-timestamp": svixTimestamp,
    }) as any;
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).json({ error: "Invalid signature" });
  }

  try {
    // extract id and type
    const { id } = event.data;
    const eventType = event.type;

    // Sync with your Database (User model)
    if (eventType === "user.created") {
      const email = event.data.email_addresses?.[0]?.email_address;
      if (!email) {
        console.error("No email address found in user.created event:", event.data);
        return res.status(400).json({ error: "Email is required" });
      }

      // Check if user already exists by ID
      const userById = await prisma.user.findUnique({
        where: { id: id },
      });
      if (userById) {
        console.log(`User already exists with ID: ${id}, skipping creation.`);
        return res.status(200).json({ success: true, message: "User already exists" });
      }

      // Check if user already exists by email (stale record check)
      const userByEmail = await prisma.user.findUnique({
        where: { email: email },
      });
      if (userByEmail) {
        console.warn(
          `Stale user record found with email ${email} (ID: ${userByEmail.id}). Deleting stale record to proceed with new registration.`
        );
        await prisma.user.delete({ where: { id: userByEmail.id } });
      }

      const name =
        `${event.data.first_name || ""} ${event.data.last_name || ""}`.trim();
      await prisma.user.create({
        data: {
          email,
          name,
          id,
        },
      });
      console.log("successfully user created");
    } else if (eventType === "user.deleted") {
      const userById = await prisma.user.findUnique({
        where: { id: id },
      });
      if (userById) {
        await prisma.user.delete({ where: { id } });
        console.log(`successfully user deleted: ${id}`);
      } else {
        console.log(`User with ID: ${id} does not exist in DB, skipping deletion.`);
      }
    }
    // Return a 200 response to acknowledge receipt of the webhook
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error processing Clerk webhook event:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
