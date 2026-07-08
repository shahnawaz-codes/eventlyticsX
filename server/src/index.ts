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
import { clerkWebhook } from "./webhook/clerkWebhook.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(
  "/api/webhooks/clerk",
  // Parsed as a raw Buffer
  express.raw({ type: "application/json" }),
  clerkWebhook,
);
app.set("trust proxy", true);
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
