import { getProjectByIdService } from "../project/service.js";
import eventRepo from "../event/repository.js";

/**
 * Fetch high-level summary KPIs (total events, total pageviews, unique visitors)
 */
export const getOverviewService = async (
  projectId: string,
  userId: string,
  startDate?: Date,
  endDate?: Date,
) => {
  const project = await getProjectByIdService(projectId, userId);
  if (!project) {
    throw new Error("Project not found or unauthorized");
  }

  const totalEvents = await eventRepo.totalEvents(
    project.public_key,
    startDate,
    endDate,
  );
  const totalPageviews = await eventRepo.totalPageviews(
    project.public_key,
    startDate,
    endDate,
  );
  const uniqueVisitors = await eventRepo.uniqueVisitorCount(
    project.public_key,
    startDate,
    endDate,
  );

  return {
    totalEvents,
    totalPageviews,
    uniqueVisitors,
  };
};

/**
 * Fetch real-time active users (in the last 5 minutes) and recent activities
 */
export const getRealtimeService = async (projectId: string, userId: string) => {
  const project = await getProjectByIdService(projectId, userId);
  if (!project) {
    throw new Error("Project not found or unauthorized");
  }

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const activeUsers = await eventRepo.uniqueVisitorCount(
    project.public_key,
    fiveMinutesAgo,
  );
  const recentActivity = await eventRepo.recentEvents(project.public_key);

  return {
    activeUsers,
    recentActivity,
  };
};

/**
 * Fetch all breakdowns (top pages, referrers, browsers, operating systems, devices, countries)
 */
export const getBreakdownsService = async (
  projectId: string,
  userId: string,
  startDate?: Date,
  endDate?: Date,
) => {
  const project = await getProjectByIdService(projectId, userId);
  if (!project) {
    throw new Error("Project not found or unauthorized");
  }

  const pages = await eventRepo.topPages(
    project.public_key,
    startDate,
    endDate,
  );
  const referrers = await eventRepo.topReferrers(
    project.public_key,
    startDate,
    endDate,
  );
  const { browsers, os } = await eventRepo.groupByBrowserAndOS(
    project.public_key,
    startDate,
    endDate,
  );
  const { devices, countries, cities, regions } = await eventRepo.groupByDeviceAndCountry(
    project.public_key,
    startDate,
    endDate,
  );
  const { entryPages, exitPages } = await eventRepo.getEntryExitPages(
    project.public_key,
    startDate,
    endDate,
  );
  const campaigns = await eventRepo.getCampaigns(
    project.public_key,
    startDate,
    endDate,
  );

  // Derive channels from referrers
  const channelMap = new Map<string, number>();
  referrers.forEach((ref) => {
    let channel = "Referral";
    const r = ref.referrer ? ref.referrer.toLowerCase() : "";
    if (r === "direct" || r === "" || !r || r === "none" || r === "direct / none") {
      channel = "Direct / None";
    } else if (r.includes("google") || r.includes("bing") || r.includes("yahoo") || r.includes("duckduckgo") || r.includes("baidu")) {
      channel = "Organic Search";
    } else if (r.includes("facebook") || r.includes("twitter") || r.includes("t.co") || r.includes("instagram") || r.includes("linkedin") || r.includes("reddit") || r.includes("youtube")) {
      channel = "Organic Social";
    }
    channelMap.set(channel, (channelMap.get(channel) || 0) + ref.count);
  });
  const channels = Array.from(channelMap.entries())
    .map(([channel, count]) => ({ channel, count }))
    .sort((a, b) => b.count - a.count);

  return {
    pages,
    referrers,
    browsers,
    os,
    devices,
    countries,
    cities,
    regions,
    entryPages,
    exitPages,
    campaigns,
    channels,
  };
};

/**
 * Fetch chronological daily traffic trend for charts
 */
export const getTimeseriesService = async (
  projectId: string,
  userId: string,
  startDate?: Date,
  endDate?: Date,
) => {
  const project = await getProjectByIdService(projectId, userId);
  if (!project) {
    throw new Error("Project not found or unauthorized");
  }

  const trend = await eventRepo.timeseriesTrend(
    project.public_key,
    startDate,
    endDate,
  );
  return trend;
};
