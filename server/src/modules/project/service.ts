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

  // 7. Daily traffic trend for the last 7 days (Recharts visualization)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const eventsInLast7Days = await prisma.event.findMany({
    where: {
      projectKey,
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      createdAt: true,
      eventType: true,
      sessionId: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const dailyStatsMap = new Map<string, { date: string; pageviews: number; visitors: Set<string>; totalEvents: number }>();

  // Initialize last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dailyStatsMap.set(dateStr, {
      date: dateStr,
      pageviews: 0,
      visitors: new Set<string>(),
      totalEvents: 0,
    });
  }

  // Populate stats
  eventsInLast7Days.forEach((event) => {
    const eventDateStr = new Date(event.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (dailyStatsMap.has(eventDateStr)) {
      const stats = dailyStatsMap.get(eventDateStr)!;
      stats.totalEvents++;
      if (event.eventType === "page-view" || event.eventType === "pageview") {
        stats.pageviews++;
      }
      stats.visitors.add(event.sessionId);
    }
  });

  const dailyStats = Array.from(dailyStatsMap.values()).map((stats) => ({
    date: stats.date,
    pageviews: stats.pageviews,
    uniqueVisitors: stats.visitors.size,
    totalEvents: stats.totalEvents,
  }));

  return {
    totalEvents,
    totalPageviews,
    uniqueVisitors,
    recentEvents,
    topPages,
    topReferrers,
    dailyStats,
  };
};
