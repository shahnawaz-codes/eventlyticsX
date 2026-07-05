import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { socket } from "../../services/InitalizeSocket";

export const useAnalyticsSoket = (
  projectId: string,
  projectKey: string | undefined,
  dateRange: any,
) => {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!projectKey) return;

    console.log("socket running for projectKey:", projectKey);
    // connection____
    socket.connect();

    // emit projectKey and label__
    socket.emit("join-project", {
      projectKey,
      label: dateRange?.label,
    });
    socket.on(
      "analytics:overview",
      (overview: {
        totalEvents: number;
        totalPageviews: number;
        uniqueVisitors: number;
      }) => {
        console.table({
          totalEvents: overview.totalEvents,
          totalPageviews: overview.totalPageviews,
          uniqueVisitors: overview.uniqueVisitors,
        });
        queryClient.setQueryData(["overview", projectId, dateRange], overview);
      },
    );
    socket.on(
      "analytics:breakdowns",
      (breakdownData) => {
        console.log("analytics:breakdowns socket received:", breakdownData);
        queryClient.setQueryData(["breakdowns", projectId, dateRange], breakdownData);
      },
    );
    socket.on("analytics:realtime", ({ activeUsers, recentActivity }) => {
      console.table({
        activeUsers,
        recentActivity,
      });
      queryClient.setQueryData(["realtime", projectId], {
        activeUsers,
        recentActivity,
      });
    });
    socket.on("analytics:timeseries", (trend) => {
      console.table(trend);
      queryClient.setQueryData(["timeSeries", projectId, dateRange], trend);
    });
    socket.on("project:verified", () => {
      console.log("Project verified in real-time!");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    });
    return () => {
      console.log("cleaning up socket");
      socket.off("analytics:overview");
      socket.off("analytics:breakdowns");
      socket.off("analytics:realtime");
      socket.off("analytics:timeseries");
      socket.off("project:verified");
      socket.disconnect();
    };
  }, [projectId, projectKey, dateRange]);
};
