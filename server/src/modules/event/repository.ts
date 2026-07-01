import { prisma } from "../../config/db.js";
import { getDateFilter } from "../../utils/date.js";

const eventRepo = {
  // 1. Total Events
  totalEvents: async function (
    projectKey: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    return await prisma.event.count({
      where: {
        projectKey,
        ...getDateFilter(startDate, endDate),
      },
    });
  },

  // 2. Total Pageviews
  totalPageviews: async function (
    projectKey: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    return await prisma.event.count({
      where: {
        projectKey,
        eventType: { in: ["page-view", "pageview"] },
        ...getDateFilter(startDate, endDate),
      },
    });
  },

  // 3. Unique Visitors Count
  uniqueVisitorCount: async function (
    projectKey: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const result = await prisma.event.groupBy({
      by: ["sessionId"],
      where: {
        projectKey,
        ...getDateFilter(startDate, endDate),
      },
    });
    return result.length;
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

  // 5. Top pages
  topPages: async (projectKey: string, startDate?: Date, endDate?: Date) => {
    const pageGroup = await prisma.event.groupBy({
      by: ["path"],
      where: {
        projectKey,
        ...getDateFilter(startDate, endDate),
      },
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
      .slice(0, 10);
  },

  // 6. Top referrers
  topReferrers: async (
    projectKey: string,
    startDate?: Date,
    endDate?: Date,
  ) => {
    const referrersGroup = await prisma.event.groupBy({
      by: ["referrer"],
      where: {
        projectKey,
        ...getDateFilter(startDate, endDate),
      },
      _count: {
        id: true,
      },
    });

    return referrersGroup
      .map((r) => ({
        referrer: r.referrer || "Direct",
        count: r._count.id,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  },

  // 7. Group by Browser and OS
  groupByBrowserAndOS: async (
    projectKey: string,
    startDate?: Date,
    endDate?: Date,
  ) => {
    const dateFilter = getDateFilter(startDate, endDate);

    const browserGroup = await prisma.event.groupBy({
      by: ["browser"],
      where: {
        projectKey,
        ...dateFilter,
      },
      _count: {
        id: true,
      },
    });

    const browsers = browserGroup
      .map((b) => ({
        browser: b.browser || "Unknown",
        count: b._count.id,
      }))
      .sort((a, b) => b.count - a.count);

    const osGroup = await prisma.event.groupBy({
      by: ["os"],
      where: {
        projectKey,
        ...dateFilter,
      },
      _count: {
        id: true,
      },
    });

    const os = osGroup
      .map((o) => ({
        os: o.os || "Unknown",
        count: o._count.id,
      }))
      .sort((a, b) => b.count - a.count);

    return { browsers, os };
  },

  // 8. Group by Device & Country
  groupByDeviceAndCountry: async (
    projectKey: string,
    startDate?: Date,
    endDate?: Date,
  ) => {
    const dateFilter = getDateFilter(startDate, endDate);

    const deviceGroup = await prisma.event.groupBy({
      by: ["device"],
      where: {
        projectKey,
        ...dateFilter,
      },
      _count: {
        id: true,
      },
    });

    const devices = deviceGroup
      .map((d) => ({
        device: d.device || "Unknown",
        count: d._count.id,
      }))
      .sort((a, b) => b.count - a.count);

    const countryGroup = await prisma.event.groupBy({
      by: ["country"],
      where: {
        projectKey,
        ...dateFilter,
      },
      _count: {
        id: true,
      },
    });

    const countries = countryGroup
      .map((c) => ({
        country: c.country || "Unknown",
        count: c._count.id,
      }))
      .sort((a, b) => b.count - a.count);

    return { devices, countries };
  },

  // 9. Daily traffic trend for custom date range (Recharts visualization)
  timeseriesTrend: async (
    projectKey: string,
    startDate?: Date,
    endDate?: Date,
  ) => {
    const start = startDate ? new Date(startDate) : new Date();
    if (!startDate) {
      start.setDate(start.getDate() - 7);
    }
    start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    const events = await prisma.event.findMany({
      where: {
        projectKey,
        createdAt: {
          gte: start,
          lte: end,
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

    const dailyStatsMap = new Map<
      string,
      { date: string; pageviews: number; visitors: Set<string> }
    >();

    // Calculate daily intervals in the range [start, end]
    const current = new Date(start);
    while (current <= end) {
      const dateStr = current.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      dailyStatsMap.set(dateStr, {
        date: dateStr,
        pageviews: 0,
        visitors: new Set<string>(),
      });
      current.setDate(current.getDate() + 1);
    }

    // Populate stats
    events.forEach((event) => {
      const eventDateStr = new Date(event.createdAt).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric" },
      );
      if (dailyStatsMap.has(eventDateStr)) {
        const stats = dailyStatsMap.get(eventDateStr)!;
        if (event.eventType === "page-view" || event.eventType === "pageview") {
          stats.pageviews++;
        }
        stats.visitors.add(event.sessionId);
      }
    });

    return Array.from(dailyStatsMap.values()).map((stats) => ({
      date: stats.date,
      pageviews: stats.pageviews,
      uniqueVisitors: stats.visitors.size,
    }));
  },
};

export default eventRepo;
