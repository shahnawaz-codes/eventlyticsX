import { Request, Response } from "express";
import { prisma } from "../../db.js";

export const tracking = async (req: Request, res: Response) => {
  try {
    const { event, projectKey, path, referrer, sessionId } = req.body || {};
    // Create event entry in the database
    const newEvent = await prisma.event.create({
      data: {
        eventType: event || "pageview",
        projectKey: projectKey || "default",
        path: path || "/",
        referrer: referrer || "",
        sessionId: sessionId || "session_unknown",
      },
    });
    console.log("✅ Event tracked:", newEvent);
    res.status(200).json({ success: true, event: newEvent });
  } catch (error) {
    console.error("❌ Error tracking event:", error);
    res.status(500).json({ success: false, error: "Failed to track event" });
  }
};
