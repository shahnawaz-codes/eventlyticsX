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
  try {
    // Initialize Svix Webhook validator
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
    // Verify signature. If it matches, returns the verified JSON payload object
    const event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-signature": svixSignature,
      "svix-timestamp": svixTimestamp,
    }) as any;

    // extract id and type
    const { id } = event.data;
    const eventType = event.type;
    const isUserExist = await prisma.user.findUnique({
      where: { id: id },
    });
    // Sync with your Database (User model)
    if (eventType === "user.created") {
      if (isUserExist) return;
      const email = event.data.email_addresses[0]?.email_address;
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
    }
    if (eventType === "user.deleted") {
      if (isUserExist) {
        await prisma.user.delete({ where: { id } });
      }
      console.log("successfully user deleted");
    }
    // Return a 200 response to acknowledge receipt of the webhook
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return res.status(400).json({ error: "Invalid signature" });
  }
};
