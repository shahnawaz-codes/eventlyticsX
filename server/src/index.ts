import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import trackRoute from "./modules/event/route.js";
import projectRoute from "./modules/project/route.js";
import analyticsRoute from "./modules/analytics/route.js";
import { clerkMiddleware } from "@clerk/express";
import morgan from "morgan";
import { Webhook } from "svix";
import { prisma } from "./config/db.js";
import { app, server } from "./socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(
  "/api/webhooks/clerk",
  // Parsed as a raw Buffer
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("run webhook");
    const payload = req.body?.toString();
    const headers = req.headers;
    console.log("Webhook payload length:", payload?.length);
    console.log(
      "Webhook secret exists in env:",
      !!process.env.CLERK_WEBHOOK_SECRET,
    );
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
  },
);
// Middleware
app.use(
  cors({
    origin: (origin, callback) => callback(null, origin || true),
    credentials: true,
  }),
);
app.use(clerkMiddleware()); //checks the request's cookies and headers for  session JWT and, if found, attaches the Auth object tao the request object under the auth key.
app.use(express.json());
app.use(express.static("public"));

/**
 * Morgan HTTP request logger - logs requests in development environment only
 * Helps debug API requests and response times
 */
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// Routes
app.use("/api", trackRoute);
app.use("/api/projects", projectRoute);
app.use("/api/analytics", analyticsRoute);

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
