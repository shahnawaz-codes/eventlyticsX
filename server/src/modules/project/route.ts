import express from "express";
import {
  createProject,
  getProjects,
  getProjectDetail,
  getProjectAnalytics,
} from "./controller.js";
import { requireAuth } from "../../middleware/auth.js";

const route = express.Router();

// Project routes - Protected endpoints
route.post("/", requireAuth, createProject);
route.get("/", requireAuth, getProjects);
route.get("/:projectId", requireAuth, getProjectDetail);
route.get("/:projectId/analytics", requireAuth, getProjectAnalytics);

export default route;

