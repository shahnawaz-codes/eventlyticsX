"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { Activity, Settings, ArrowLeft } from "lucide-react";
import { Project } from "@/modules/project/types";
import { useProject } from "@/modules/project/hooks/query";
import { useAnalytics } from "@/modules/analytics/hooks/useAnalytics";
import GoogleAnalyticsDashboard from "@/modules/analytics/components/AnalyticsDashboard";
import { useQueryClient } from "@tanstack/react-query";
import AnalyticsDashboard from "@/modules/analytics/components/AnalyticsDashboard";
import { io, Socket } from "socket.io-client";

export default function ProjectDetailsPage() {
  const { isLoaded } = useAuth();
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const projectId = params?.projectId as string;

  const [dateRange, setDateRange] = useState({
    label: "Last 7 Days",
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString(),
  });
  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: overview, isLoading: overviewLoading } = useAnalytics.overview(
    projectId,
    dateRange,
  );
  const { data: breakdowns, isLoading: breakdownsLoading } =
    useAnalytics.breakdowns(projectId, dateRange);
  const { data: timeseries, isLoading: timeseriesLoading } =
    useAnalytics.getTimeseries(projectId, dateRange);
  const { data: realtime, isLoading: realtimeLoading } =
    useAnalytics.getRealtime(projectId, { refetchInterval: 5000 });
  const [refreshing, setRefreshing] = useState(false);
  // Redirect to dashboard if project load completes but project is null
  useEffect(() => {
    if (isLoaded && !projectLoading && !project) {
      router.push("/dashboard");
    }
    // just for tesing purpose, later i will delete that
    console.log("socket running");
    const socket: Socket = io("http://localhost:5000");
    socket.on("connect", () => {
      socket.emit("join-project", { projectKey: project?.public_key });
      socket.on("new-event", ({ event }) => {
        console.log("new event", event);
      });
    });
    return () => {
      console.log("cleaning up socket");
      socket.disconnect();
    };
  }, [isLoaded, projectLoading, project, router]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["overview", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["breakdowns", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["timeSeries", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["realtime", projectId] }),
      ]);
    } catch (err: any) {
      console.error("Error refreshing analytics:", err);
    } finally {
      setRefreshing(false);
    }
  };

  if (!isLoaded || projectLoading || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 select-none">
        <div className="flex flex-col items-center gap-3">
          <Activity className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-medium text-zinc-500">
            Loading project analytics...
          </span>
        </div>
      </div>
    );
  }

  // Format overview payload to match what GoogleAnalyticsDashboard expects
  const formattedOverview = overview
    ? {
        totalEvents: overview.totalEvents || 0,
        totalPageviews: overview.totalPageviews || 0,
        uniqueVisitors: overview.uniqueVisitors || 0,
      }
    : null;

  return (
    <AnalyticsDashboard
      project={project}
      overview={formattedOverview}
      breakdowns={breakdowns || null}
      timeseries={timeseries || null}
      realtime={realtime || null}
      dateRange={dateRange}
      setDateRange={setDateRange}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      isLoading={overviewLoading || breakdownsLoading || timeseriesLoading}
    />
  );
}
