"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { subDays, subHours } from "date-fns";
import { useAuth } from "@clerk/nextjs";
import {
  Activity,
  ArrowLeft,
  Loader2,
  Copy,
  Check,
  Terminal,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Project } from "@/modules/project/types";
import { useProject } from "@/modules/project/hooks/query";
import { useAnalytics } from "@/modules/analytics/hooks/query/useAnalytics";
import { useQueryClient } from "@tanstack/react-query";
import AnalyticsDashboard from "@/modules/analytics/components/AnalyticsDashboard";
import { useAnalyticsSoket } from "@/modules/analytics/hooks/socket/useAnalyticsSoket";
import { toast } from "sonner";
import { SDKSetupWizard } from "@/modules/project/components/SDKSetupWizard";

export default function ProjectDetailsPage() {
  const { isLoaded } = useAuth();
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const projectId = params?.projectId as string;
  const [dateRange, setDateRange] = useState({
    label: "Last 7 Days",
    startDate: subDays(new Date(), 7).toISOString(),
    endDate: new Date().toISOString(),
  });
  const { data: project, isLoading: projectLoading } = useProject(projectId);
  // enable Socket and execute__
  useAnalyticsSoket(projectId, project?.public_key, dateRange);
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
  const [wasUnverified, setWasUnverified] = useState(false);

  // Redirect to dashboard if project load completes but project is null
  useEffect(() => {
    if (isLoaded && !projectLoading && !project) {
      router.push("/dashboard");
    }
  }, [isLoaded, projectLoading, project, router]);

  useEffect(() => {
    if (project && !project.verified) {
      setWasUnverified(true);
    }
  }, [project?.verified]);

  useEffect(() => {
    if (project?.verified && wasUnverified) {
      toast.success("SDK Integration verified successfully!");
      setWasUnverified(false);
    }
  }, [project?.verified, wasUnverified]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      const now = new Date();
      let startDateStr = subDays(now, 7).toISOString();
      if (dateRange.label === "Last 24 Hours") {
        startDateStr = subHours(now, 24).toISOString();
      } else if (dateRange.label === "Last 30 Days") {
        startDateStr = subDays(now, 30).toISOString();
      }

      setDateRange({
        label: dateRange.label,
        startDate: startDateStr,
        endDate: now.toISOString(),
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["overview", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["breakdowns", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["timeSeries", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["realtime", projectId] }),
      ]);
      toast.success("Analytics data refreshed!");
    } catch (err: any) {
      console.error("Error refreshing analytics:", err);
      toast.error("Failed to refresh analytics");
    } finally {
      setRefreshing(false);
    }
  };

  const handleManualCheck = async () => {
    await queryClient.invalidateQueries({ queryKey: ["project", projectId] });
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

  // Render SDK Setup Wizard if the project is not verified yet
  if (!project.verified) {
    return (
      <SDKSetupWizard
        project={project}
        onBack={() => router.push("/dashboard")}
        onManualCheck={handleManualCheck}
      />
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
