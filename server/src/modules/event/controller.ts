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
      const { startDate, endDate, label } = socket.data.filters || {};

      let resolvedStartDate = startDate ? new Date(startDate) : undefined;
      let resolvedEndDate = endDate ? new Date(endDate) : undefined;

      if (label) {
        const now = new Date();
        resolvedEndDate = now;
        if (label === "Last 24 Hours") {
          resolvedStartDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        } else if (label === "Last 7 Days") {
          resolvedStartDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (label === "Last 30 Days") {
          resolvedStartDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
      }

      // Run the server-side aggregation from eventRepo!
      const totalEvents = await eventRepo.totalEvents(
        newEvent.projectKey,
        resolvedStartDate,
        resolvedEndDate,
      );
      const totalPageviews = await eventRepo.totalPageviews(
        newEvent.projectKey,
        resolvedStartDate,
        resolvedEndDate,
      );
      const uniqueVisitors = await eventRepo.uniqueVisitorCount(
        newEvent.projectKey,
        resolvedStartDate,
        resolvedEndDate,
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
