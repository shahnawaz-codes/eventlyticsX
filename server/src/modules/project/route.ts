import express from "express";
import {
  createProject,
  getProjects,
  getProjectDetail,
  deleteProject,
  updateProject,
} from "./controller.js";
import { protectedRoute } from "../../middleware/auth.js";

const route = express.Router();

// Project routes - Protected endpoints
route.post("/", protectedRoute, createProject);
route.get("/", protectedRoute, getProjects);
route.get("/:projectId", protectedRoute, getProjectDetail);
route.delete("/:projectId", protectedRoute, deleteProject);
route.put("/:projectId", protectedRoute, updateProject);

export default route;
