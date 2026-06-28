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
  const { devices, countries } = await eventRepo.groupByDeviceAndCountry(
    project.public_key,
    startDate,
    endDate,
  );

  return {
    pages,
    referrers,
    browsers,
    os,
    devices,
    countries,
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
