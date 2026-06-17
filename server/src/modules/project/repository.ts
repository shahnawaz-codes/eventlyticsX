import { prisma } from "../../db.js";

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
  
  getProject: async ( projectId: string,userId: string,) => {
    return await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });
  },
  
};

export default project