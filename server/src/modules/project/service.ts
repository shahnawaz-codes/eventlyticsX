import { randomBytes } from "node:crypto";
import { prisma } from "../../db.js";

export const createProjectService = async (
  projectName: string,
  userId: string,
) => {
  const projectKey =
    "ev_x_" + randomBytes(16).toString("hex") + "_" + Date.now();

  return await prisma.project.create({
    data: {
      name: projectName,
      public_key: projectKey,
      userId,
    },
  });
};

export const getProjectsService = async (userId: string | undefined) => {
  // Returns sample project details, can be connected to real DB logic later
  return await prisma.project.findMany({
    where: {
      userId,
    },
  });
};
