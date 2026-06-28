import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.js";
import {
  getOverviewService,
  getRealtimeService,
  getBreakdownsService,
  getTimeseriesService,
} from "./service.js";

// Helper to extract and validate date query parameters 
const parseDateParams = (startDateStr: any, endDateStr: any) => {
  const startDate = startDateStr ? new Date(startDateStr as string) : undefined;
  const endDate = endDateStr ? new Date(endDateStr as string) : undefined;

  if (startDate && isNaN(startDate.getTime())) {
    throw new Error("Invalid startDate format");
  }
  if (endDate && isNaN(endDate.getTime())) {
    throw new Error("Invalid endDate format");
  }

  return { startDate, endDate };
};

export const getOverview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId, startDate, endDate } = req.query;
    if (!projectId) {
      return res.status(400).json({ success: false, message: "projectId is required" });
    }

    const dates = parseDateParams(startDate, endDate);
    const data = await getOverviewService(
      projectId as string,
      req.user?.id as string,
      dates.startDate,
      dates.endDate,
    );

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error("Error in getOverview controller:", error);
    const status = error.message.includes("not found") ? 404 : 400;
    res.status(status).json({ success: false, message: error.message || "Internal server error" });
  }
};

export const getRealtime = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId } = req.query;
    if (!projectId) {
      return res.status(400).json({ success: false, message: "projectId is required" });
    }

    const data = await getRealtimeService(
      projectId as string,
      req.user?.id as string,
    );

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error("Error in getRealtime controller:", error);
    const status = error.message.includes("not found") ? 404 : 400;
    res.status(status).json({ success: false, message: error.message || "Internal server error" });
  }
};

export const getBreakdowns = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId, startDate, endDate } = req.query;
    if (!projectId) {
      return res.status(400).json({ success: false, message: "projectId is required" });
    }

    const dates = parseDateParams(startDate, endDate);
    const data = await getBreakdownsService(
      projectId as string,
      req.user?.id as string,
      dates.startDate,
      dates.endDate,
    );

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error("Error in getBreakdowns controller:", error);
    const status = error.message.includes("not found") ? 404 : 400;
    res.status(status).json({ success: false, message: error.message || "Internal server error" });
  }
};

export const getTimeseries = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId, startDate, endDate } = req.query;
    if (!projectId) {
      return res.status(400).json({ success: false, message: "projectId is required" });
    }

    const dates = parseDateParams(startDate, endDate);
    const data = await getTimeseriesService(
      projectId as string,
      req.user?.id as string,
      dates.startDate,
      dates.endDate,
    );

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error("Error in getTimeseries controller:", error);
    const status = error.message.includes("not found") ? 404 : 400;
    res.status(status).json({ success: false, message: error.message || "Internal server error" });
  }
};
