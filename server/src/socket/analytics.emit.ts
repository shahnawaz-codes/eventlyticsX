import { getRealtimeService } from "../modules/analytics/service.js";
import eventRepo from "../modules/event/repository.js";
import { io } from "../socket.js";
import { subDays } from "date-fns";

const emitEvent = (projectKey: string) => {
  return {
    emit_overview: async () => {
      const sockets = await io.in(`dashboard:${projectKey}`).fetchSockets();
      for (const socket of sockets) {
        const { label } = socket.data.filters || {};
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

        // Run the server-side aggregation from eventRepo!
        const totalEvents = await eventRepo.totalEvents(
          projectKey,
          startDate,
          endDate,
        );
        const totalPageviews = await eventRepo.totalPageviews(
          projectKey,
          startDate,
          endDate,
        );
        const uniqueVisitors = await eventRepo.uniqueVisitorCount(
          projectKey,
          startDate,
          endDate,
        );
        // Send the fresh aggregates directly to this specific developer's socket
        socket.emit("analytics:overview", {
          totalEvents,
          totalPageviews,
          uniqueVisitors,
        });
      }
    },
    emit_realtime: async () => {
      const sockets = await io.in(`dashboard:${projectKey}`).fetchSockets();
      for (const socket of sockets) {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const activeUsers = await eventRepo.uniqueVisitorCount(
          projectKey,
          fiveMinutesAgo,
        );
        const recentActivity = await eventRepo.recentEvents(projectKey);
        //Emit____
        socket.emit("analytics:realtime", {
          activeUsers,
          recentActivity,
        });
      }
    },
    emit_breakdowns: async () => {
      const sockets = await io.in(`dashboard:${projectKey}`).fetchSockets();
      for (const socket of sockets) {
        const { label } = socket.data.filters || {};
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

        const pages = await eventRepo.topPages(projectKey, startDate, endDate);
        const referrers = await eventRepo.topReferrers(
          projectKey,
          startDate,
          endDate,
        );
        const { browsers, os } = await eventRepo.groupByBrowserAndOS(
          projectKey,
          startDate,
          endDate,
        );
        const { devices, countries, cities, regions } = await eventRepo.groupByDeviceAndCountry(
          projectKey,
          startDate,
          endDate,
        );
        const { entryPages, exitPages } = await eventRepo.getEntryExitPages(
          projectKey,
          startDate,
          endDate,
        );
        const campaigns = await eventRepo.getCampaigns(
          projectKey,
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

        //Emit____
        socket.emit("analytics:breakdowns", {
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
      const sockets = await io.in(`dashboard:${projectKey}`).fetchSockets();
      for (const socket of sockets) {
        const { label } = socket.data.filters || {};
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
        const trend = await eventRepo.timeseriesTrend(
          projectKey,
          startDate,
          endDate,
        );
        socket.emit("analytics:timeseries", trend);
      }
    },
    emit_verified: async () => {
      io.to(`dashboard:${projectKey}`).emit("project:verified", { verified: true });
    },
  };
};

export default emitEvent;
