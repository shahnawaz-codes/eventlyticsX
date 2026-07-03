import { Request, Response } from "express";
import { trackEventService } from "./service.js";
import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";
import emitEvent from "../../socket/analytics.emit.js";

export const tracking = async (req: Request, res: Response) => {
  try {
    const { event, projectKey, sessionId, path, referrer } = req.body || {};

    if (!projectKey) {
      return res
        .status(400)
        .json({ success: false, error: "projectKey is required" });
    }
    const forwardedFor = req.headers["x-forwarded-for"];
    const ip =
      (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)
        ?.split(",")[0]
        ?.trim() || req.socket.remoteAddress;
    console.log("forwardedFor", forwardedFor);
    console.log("ip", ip);
    let geo: any = ip ? geoip.lookup(ip) : null;
    if (!geo || ip === "::1" || ip === "127.0.0.1" || ip?.includes("192.168.") || ip?.includes("10.")) {
      const mockLocations = [
        { country: "United States", region: "California", city: "Mountain View" },
        { country: "India", region: "Maharashtra", city: "Mumbai" },
        { country: "United Kingdom", region: "England", city: "London" },
        { country: "Germany", region: "Bavaria", city: "Munich" },
        { country: "Japan", region: "Tokyo", city: "Tokyo" },
        { country: "United States", region: "New York", city: "New York" },
      ];
      const idx = sessionId
        ? Math.abs(sessionId.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)) % mockLocations.length
        : 0;
      geo = mockLocations[idx];
    }
    console.log("geo resolved", geo);
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
      country: geo?.country || "unknown",
      city: geo?.city || "unknown",
      region: geo?.region || "unknown",
    };
    // business logic____
    const newEvent = await trackEventService(payload);
    // Emit to analytics dashboard____
    const emit = emitEvent(projectKey);
    await emit.emit_overview();
    await emit.emit_breakdowns();
    await emit.emit_realtime();
    await emit.emit_timeseries();
    console.log("✅ Event tracked:", newEvent);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error tracking event:", error);
    res.status(500).json({ success: false, error: "Failed to track event" });
  }
};
