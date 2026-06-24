import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import trackRoute from "./modules/event/route.js";
import projectRoute from "./modules/project/route.js";
import analyticsRoute from "./modules/analytics/route.js";
import { clerkMiddleware } from "@clerk/express";
import morgan from "morgan";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(clerkMiddleware()); //checks the request's cookies and headers for a session JWT and, if found, attaches the Auth object to the request object under the auth key.
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

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
