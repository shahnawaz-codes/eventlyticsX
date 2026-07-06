import { randomUUID } from "node:crypto";
import { prisma } from "../../config/db.js";
import projectRepo from "./repository.js";

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
  return await projectRepo.getProjects(userId);
};

export const getProjectByIdService = async (
  projectId: string,
  userId: string,
) => {
  return await projectRepo.getProject(projectId, userId);
};

export const deleteProjectService = async (
  projectId: string,
  userId: string,
) => {
  return await projectRepo.delete(projectId, userId);
};

export const updateProjectService = async (
  projectId: string,
  userId: string,
  name: string,
) => {
  return await projectRepo.update(projectId, userId, name);
};
