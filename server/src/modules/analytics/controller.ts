import { Request, Response } from "express";
import { logAnalyticsService } from "./service.js";

export const tracking = async (req: Request, res: Response) => {
  const result = await logAnalyticsService(req.body || {});
  res.status(200).json(result);
};
