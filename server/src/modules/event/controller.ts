import { Request, Response } from "express";
import { trackEventService } from "./service.js";
import { UAParser } from "ua-parser-js";

export const tracking = async (req: Request, res: Response) => {
  try {
    const { event, projectKey, sessionId, path, referrer } = req.body || {};
    const ua = req.headers["user-agent"];
    const result = new UAParser(ua).getResult();
    const payload = {
      event,
      projectKey,
      sessionId,
      path,
      referrer,
      browser: result.browser.name as string,
      os: result.os.name as string,
      device: result.device.type || "desktop",
      country: "india",
    };
    const newEvent = await trackEventService(payload);
    const io = req.app.get("io");
    io.to(`dashboard:${newEvent.projectKey}`).emit("new-event", { event: newEvent });
    console.log("✅ Event tracked:", newEvent);
    res.status(200).json({ success: true, event: newEvent });
  } catch (error) {
    console.error("❌ Error tracking event:", error);
    res.status(500).json({ success: false, error: "Failed to track event" });
  }
};
