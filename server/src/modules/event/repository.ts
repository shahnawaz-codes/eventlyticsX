import { prisma } from "../../db.js";

const eventRepo = {
  totalEvents: async function (projectKey: string) {
    return await prisma.event.count({
      where: {projectKey},
    });
  },
  uniqueVisitor :async function(){
    
  }
};
