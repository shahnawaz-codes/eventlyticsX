import express from "express";
import { requireAuth } from "../../middleware/auth.js";
import {
  getOverview,
  getRealtime,
  getBreakdowns,
  getTimeseries,
} from "./controller.js";

const route = express.Router();

// Analytics endpoints - Protected by auth middleware
route.get("/overview", requireAuth, getOverview);
route.get("/realtime", requireAuth, getRealtime);
route.get("/breakdowns", requireAuth, getBreakdowns);
route.get("/timeseries", requireAuth, getTimeseries);

export default route;
