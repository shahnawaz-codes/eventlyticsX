import { Request, Response } from "express";
import { trackEventService } from "./service.js";
import { UAParser } from "ua-parser-js";
import eventRepo from "./repository.js";

export const tracking = async (req: Request, res: Response) => {
  try {
    const { event, projectKey, sessionId, path, referrer } = req.body || {};

    if (!projectKey) {
      return res
        .status(400)
        .json({ success: false, error: "projectKey is required" });
    }
    const ua = req.headers["user-agent"];
    const result = new UAParser(ua).getResult();
    const payload = {
      event: event || "pageview",
      projectKey,
      sessionId,
      path,
      referrer,
      browser: result.browser.name || "unknown",
      os: result.os.name || "unknown",
      device: result.device.type || "desktop",
      country: "india",
    };

    const newEvent = await trackEventService(payload);
    const io = req.app.get("io");
    const sockets = await io
      .in(`dashboard:${newEvent.projectKey}`)
      .fetchSockets();
    for (const socket of sockets) {
      const { startDate, endDate } = socket.data.filters || {};

      // Run the server-side aggregation from eventRepo!
      const totalEvents = await eventRepo.totalEvents(
        newEvent.projectKey,
        startDate,
        endDate,
      );
      const totalPageviews = await eventRepo.totalPageviews(
        newEvent.projectKey,
        startDate,
        endDate,
      );
      const uniqueVisitors = await eventRepo.uniqueVisitorCount(
        newEvent.projectKey,
        startDate,
        endDate,
      );
      // Send the fresh aggregates directly to this specific developer's socket
      socket.emit("update-overview", {
        totalEvents,
        totalPageviews,
        uniqueVisitors,
      });
    }

    console.log("✅ Event tracked:", newEvent);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error tracking event:", error);
    res.status(500).json({ success: false, error: "Failed to track event" });
  }
};
