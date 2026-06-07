import { Request, Response } from "express";
export const tracking = (req: Request, res: Response) => {
  const { event, projectKey, path, referrer, ...data } = req.body || {};
  console.log("event", event, projectKey, path, referrer);
  console.log("data", data);
  res.status(200).json({ success: true });
};
