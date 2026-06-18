import express from "express";
import {
  createProject,
  getProjects,
  getProjectDetail,
  deleteProject,
} from "./controller.js";
import { requireAuth } from "../../middleware/auth.js";

const route = express.Router();

// Project routes - Protected endpoints
route.post("/", requireAuth, createProject);
route.get("/", requireAuth, getProjects);
route.get("/:projectId", requireAuth, getProjectDetail);
route.delete("/:projectId", requireAuth, deleteProject);

export default route;
