import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.js";

export const getOverview = async (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({ success: true, message: "Overview analytics stub" });
};

export const getRealtime = async (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({ success: true, message: "Realtime analytics stub" });
};

export const getBreakdowns = async (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({ success: true, message: "Breakdowns analytics stub" });
};

export const getTimeseries = async (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({ success: true, message: "Timeseries analytics stub" });
};
