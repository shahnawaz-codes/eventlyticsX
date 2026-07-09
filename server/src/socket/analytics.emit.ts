import { getRealtimeService } from "../modules/analytics/service.js";
import eventRepo from "../modules/event/repository.js";
import { io } from "../socket.js";
import { subDays } from "date-fns";

const SetDateByFilterLabel = (label: string) => {
  if (!label) return undefined;
  let endDate;
  let startDate;
  if (label) {
    const now = new Date();
    endDate = now;
    if (label === "Last 24 Hours") {
      startDate = subDays(now, 1);
    } else if (label === "Last 7 Days") {
      startDate = subDays(now, 7);
    } else if (label === "Last 30 Days") {
      startDate = subDays(now, 30);
    }
  }
  return { startDate, endDate };
};
const DATE_LABELS = ["Last 24 Hours", "Last 7 Days", "Last 30 Days"];
const emitEvent = (projectKey: string) => {
  return {
    // emit per dateLabel
    emit_overview: async () => {
      for (const label of DATE_LABELS) {
        const roomName = `dashboard:${projectKey}:${label}`;
        const sockets = await io.in(roomName).fetchSockets();
        if (sockets.length == 0) continue;
        const { startDate, endDate }: any = SetDateByFilterLabel(label);
        // Run the server-side aggregation from eventRepo!
        const [totalEvents, totalPageviews, uniqueVisitors] = await Promise.all(
          [
            eventRepo.totalEvents(projectKey, startDate, endDate),
            eventRepo.totalPageviews(projectKey, startDate, endDate),
            eventRepo.uniqueVisitorCount(projectKey, startDate, endDate),
          ],
        );
        io.to(roomName).emit("analytics:overview", {
          totalEvents,
          totalPageviews,
          uniqueVisitors,
        });
      }
    },
    emit_realtime: async () => {
      const sockets = await io.in(`dashboard:${projectKey}`).fetchSockets();
      if (sockets.length === 0) return;
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const [activeUsers, recentActivity] = await Promise.all([
        eventRepo.uniqueVisitorCount(projectKey, fiveMinutesAgo),
        eventRepo.recentEvents(projectKey),
      ]);
      //Emit____
      io.to(`dashboard:${projectKey}`).emit("analytics:realtime", {
        activeUsers,
        recentActivity,
      });
    },
    emit_breakdowns: async () => {
      for (const label of DATE_LABELS) {
        const roomName = `dashboard:${projectKey}:${label}`;
        // 1. Check if there are active sockets in this specific filter room
        const sockets = await io.in(roomName).fetchSockets();
        if (sockets.length === 0) continue; // Skip database query if no one is looking at this filter!
        const { startDate, endDate }: any = SetDateByFilterLabel(label);
        // runs aggrecate queries parallel
        const [
          pages,
          referrers,
          { browsers, os },
          { devices, countries, cities, regions },
          { entryPages, exitPages },
          campaigns,
        ] = await Promise.all([
          eventRepo.topPages(projectKey, startDate, endDate),
          eventRepo.topReferrers(projectKey, startDate, endDate),
          eventRepo.groupByBrowserAndOS(projectKey, startDate, endDate),
          eventRepo.groupByDeviceAndCountry(projectKey, startDate, endDate),
          eventRepo.getEntryExitPages(projectKey, startDate, endDate),
          eventRepo.getCampaigns(projectKey, startDate, endDate),
        ]);

        // Derive channels from referrers
        const channelMap = new Map<string, number>();
        referrers.forEach((ref) => {
          let channel = "Referral";
          const r = ref.referrer ? ref.referrer.toLowerCase() : "";
          if (
            r === "direct" ||
            r === "" ||
            !r ||
            r === "none" ||
            r === "direct / none"
          ) {
            channel = "Direct / None";
          } else if (
            r.includes("google") ||
            r.includes("bing") ||
            r.includes("yahoo") ||
            r.includes("duckduckgo") ||
            r.includes("baidu")
          ) {
            channel = "Organic Search";
          } else if (
            r.includes("facebook") ||
            r.includes("twitter") ||
            r.includes("t.co") ||
            r.includes("instagram") ||
            r.includes("linkedin") ||
            r.includes("reddit") ||
            r.includes("youtube")
          ) {
            channel = "Organic Social";
          }
          channelMap.set(channel, (channelMap.get(channel) || 0) + ref.count);
        });
        const channels = Array.from(channelMap.entries())
          .map(([channel, count]) => ({ channel, count }))
          .sort((a, b) => b.count - a.count);

        //Emit____
        io.to(roomName).emit("analytics:breakdowns", {
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
        });
      }
    },
    emit_timeseries: async () => {
      for (const label of DATE_LABELS) {
        const roomName = `dashboard:${projectKey}:${label}`;
        // 1. Check if there are active sockets in this specific filter room
        const sockets = await io.in(roomName).fetchSockets();
        if (sockets.length === 0) continue; // Skip database query if no one is looking at this filter!
        const { startDate, endDate }: any = SetDateByFilterLabel(label);
        const trend = await eventRepo.timeseriesTrend(
          projectKey,
          startDate,
          endDate,
        );
        io.to(roomName).emit("analytics:timeseries", trend);
      }
    },
    emit_verified: async () => {
      io.to(`dashboard:${projectKey}`).emit("project:verified", {
        verified: true,
      });
    }, 
  };
};

export default emitEvent;
