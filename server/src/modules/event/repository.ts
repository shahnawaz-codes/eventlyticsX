import { prisma } from "../../db.js";

const eventRepo = {
  // 1. total Events
  totalEvents: async function (projectKey: string) {
    return await prisma.event.count({
      where: { projectKey },
    });
  },
  // 2. totalPageViews
  totalPageviews: async function (projectKey: string) {
    return await prisma.event.count({
      where: {
        projectKey,
        eventType: "page-view",
      },
    });
  },
  // 3. Unique visiter
  uniqueVisitor: async function (projectKey: string) {
    return await prisma.event.findMany({
      where: {
        projectKey,
      },
      select: {
        sessionId: true,
      },
      distinct: ["sessionId"],
    });
  },
  // 4. Recent events log
  recentEvents: async (projectKey: string) => {
    return await prisma.event.findMany({
      where: {
        projectKey,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 15,
    });
  },
  // 5. top 10 pages
  topPages: async (projectKey: string) => {
    /// group by path
    const pageGroup = await prisma.event.groupBy({
      by: ["path"],
      where: { projectKey },
      _count: {
        id: true,
      },
    });

    return pageGroup
      .map((page) => ({
        path: page.path,
        views: page._count.id,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);
  },
  topReferrers: async (projectKey: string) => {
    const referrersGroup = await prisma.event.groupBy({
      by: ["referrer"],
      where: { projectKey },
      _count: {
        id: true,
      },
    });
    return referrersGroup
      .map((r) => ({
        referrer: r.referrer || "Direct",
        referrals: r._count.id,
      }))
      .sort((a, b) => b.referrals - a.referrals)
      .slice(0, 8);
  },
  // 7. Daily traffic trend for the last 7 days (Recharts visualization)
  eventsInLast7Days: async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    // TODO: perform db query and logic
  },

};
