import { randomUUID } from "node:crypto";
import { prisma } from "../../db.js";

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

export const getProjectsService = async (userId: string | undefined) => {
  // Returns project details
  return await prisma.project.findMany({
    where: {
      userId,
    },
  });
};

export const getProjectByIdService = async (
  projectId: string,
  userId: string,
) => {
  return await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
  });
};

export const getProjectAnalyticsService = async (projectKey: string) => {
  // 1. Total events count
  const totalEvents = await prisma.event.count({
    where: {
      projectKey,
    },
  });

  // 2. Total pageviews count
  const totalPageviews = await prisma.event.count({
    where: {
      projectKey,
      eventType: "page-view",
    },
  });

  // 3. Unique Visitors (distinct sessionId count)
  const uniqueVisitorsResult = await prisma.event.findMany({
    where: {
      projectKey,
    },
    select: {
      sessionId: true,
    },
    distinct: ["sessionId"],
  });
  const uniqueVisitors = uniqueVisitorsResult.length;

  // 4. Recent events log
  const recentEvents = await prisma.event.findMany({
    where: {
      projectKey,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 15,
  });

  // 5. Top pages (group by path)
  const pageGroups = await prisma.event.groupBy({
    by: ["path"],
    where: {
      projectKey,
    },
    _count: {
      id: true,
    },
  });
  const topPages = pageGroups
    .map((p) => ({
      path: p.path,
      views: p._count.id,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  // 6. Top referrers (group by referrer)
  const referrerGroups = await prisma.event.groupBy({
    by: ["referrer"],
    where: {
      projectKey,
    },
    _count: {
      id: true,
    },
  });
  const topReferrers = referrerGroups
    .map((r) => ({
      referrer: r.referrer || "Direct",
      referrals: r._count.id,
    }))
    .sort((a, b) => b.referrals - a.referrals)
    .slice(0, 8);

  return {
    totalEvents,
    totalPageviews,
    uniqueVisitors,
    recentEvents,
    topPages,
    topReferrers,
  };
};
