import express from "express";
import { createProject, getProjects } from "./controller.js";
import { requireAuth } from "../../middleware/auth.js";

const route = express.Router();

// Get all projects - Protected endpoint
route.post("/", requireAuth, createProject);
route.get("/", requireAuth, getProjects);

export default route;
