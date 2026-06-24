import express from "express";
import { protectedRoute } from "../../middleware/auth.js";
import {
  getOverview,
  getRealtime,
  getBreakdowns,
  getTimeseries,
} from "./controller.js";

const route = express.Router();

// Analytics endpoints - Protected by auth middleware
route.get("/overview", protectedRoute, getOverview);
route.get("/realtime", protectedRoute, getRealtime);
route.get("/breakdowns", protectedRoute, getBreakdowns);
route.get("/timeseries", protectedRoute, getTimeseries);

export default route;
