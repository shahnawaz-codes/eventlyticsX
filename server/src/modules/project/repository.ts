import { prisma } from "../../config/db.js";

const project = {
  getProjects: async (userId: string) => {
    return await prisma.project.findMany({
      where: {
        userId,
      },
    });
  },
  delete: async (id: string, userId: string) => {
    return await prisma.project.delete({
      where: {
        id,
        userId,
      },
    });
  },

  update: async (id: string, userId: string, name: string) => {
    return await prisma.project.update({
      where: {
        id,
        userId,
      },
      data: {
        name,
      },
    });
  },

  getProject: async (projectId: string, userId: string) => {
    return await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });
  },
};

export default project;
