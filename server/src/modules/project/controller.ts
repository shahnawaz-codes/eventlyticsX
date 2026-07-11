import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.js";
import {
  createProjectService,
  getProjectsService,
  getProjectByIdService,
  deleteProjectService,
  updateProjectService,
} from "./service.js";

export const createProject = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { projectName } = req.body;
    if (!projectName) {
      return res
        .status(400)
        .json({ success: false, message: "project name is required" });
    }
    // create project_____
    const project = await createProjectService(
      projectName,
      req.user?.id as string,
    );

    return res
      .status(201)
      .json({ data: { public_key: project.public_key, id: project.id } });
  } catch (error) {
    console.error("Error creating project:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getProjects = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = await getProjectsService(req.user?.id as string);
    res.status(200).json({ data });
  } catch (error) {
    console.log("something goes wrong while getting projects", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getProjectDetail = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { projectId } = req.params;
    const project = await getProjectByIdService(
      projectId as string,
      req.user?.id as string,
    );
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ data: project });
  } catch (error) {
    console.error("Error getting project details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteProject = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { projectId } = req.params;
    const project = await deleteProjectService(
      projectId as string,
      req.user?.id as string,
    );
    res.json({ message: "successfully deleted" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateProject = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { projectId } = req.params;
    const { projectName } = req.body;
    if (!projectName) {
      return res
        .status(400)
        .json({ success: false, message: "project name is required" });
    }
    const project = await updateProjectService(
      projectId as string,
      req.user?.id as string,
      projectName,
    );
    res.status(200).json({ data: project });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
