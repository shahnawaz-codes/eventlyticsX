import { randomUUID } from "node:crypto";
import { prisma } from "../../config/db.js";
import project from "./repository.js";

export const createProjectService = async (
  projectName: string,
  userId: string,
) => {
  const projectKey = `evX_${randomUUID()}`;

  return await prisma.project.create({
    data: {
      name: projectName,
      public_key: projectKey,
      userId,
    },
  });
};

export const getProjectsService = async (userId: string) => {
  // Returns project details
  return await project.getProjects(userId);
};

export const getProjectByIdService = async (
  projectId: string,
  userId: string,
) => {
  return await project.getProject(projectId, userId);
};

export const deleteProjectService = async (
  userId: string,
  projectId: string,
) => {
  return await project.delete(projectId, userId);
};
