import { Request, Response } from "express";
import { trackEventService } from "./service.js";

export const tracking = async (req: Request, res: Response) => {
  try {
    const newEvent = await trackEventService(req.body || {});
    console.log("✅ Event tracked:", newEvent);
    res.status(200).json({ success: true, event: newEvent });
  } catch (error) {
    console.error("❌ Error tracking event:", error);
    res.status(500).json({ success: false, error: "Failed to track event" });
  }
};
