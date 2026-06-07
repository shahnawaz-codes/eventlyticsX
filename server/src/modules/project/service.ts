import { prisma } from "../../db.js";

export const createProjectService = async (projectName: string) => {
  const projectKey = "ev_x_" + Math.random().toString(36).slice(2) + Date.now();
  
  return await prisma.project.create({
    data: {
      name: projectName,
      projectKey,
    },
  });
};

export const getProjectsService = async (userId: string | undefined) => {
  // Returns sample project details, can be connected to real DB logic later
  
  return {
    success: true,
    user: {
      id: userId,
    },
  };
};
