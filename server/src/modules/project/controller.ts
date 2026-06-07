import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.js";
import { createProjectService, getProjectsService } from "./service.js";

export const createProject = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { projectName } = req.body;
    if (!projectName) {
      return res
        .status(400)
        .json({ success: false, messege: "project name is required" });
    }

    const project = await createProjectService(projectName);
    return res.status(201).json({ projectKey: project.projectKey });
  } catch (error) {
    console.error("Error creating project:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getProjects = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  const result = await getProjectsService(user?.id);
  res.status(200).json({
    ...result,
    user: {
      ...result.user,
      email: user?.email,
    },
  });
};
