"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { Activity, Settings, ArrowLeft } from "lucide-react";
import { Project } from "@/modules/project/types";
import { useProject } from "@/modules/project/hooks/query";
import { useAnalytics } from "@/modules/analytics/hooks/useAnalytics";
import GoogleAnalyticsDashboard from "@/modules/analytics/components/GoogleAnalyticsDashboard";
import { useQueryClient } from "@tanstack/react-query";

interface EventItem {
  id: string;
  eventType: string;
  path: string;
  referrer: string;
  sessionId: string;
  createdAt: string;
}

interface AnalyticsData {
  totalEvents: number;
  totalPageviews: number;
  uniqueVisitors: number;
  recentEvents: EventItem[];
  topPages: { path: string; views: number }[];
  topReferrers: { referrer: string; referrals: number }[];
}

const DEMO_PROJECT: Project = {
  id: "proj_demo_123",
  name: "Acme Web App (Demo)",
  public_key: "evt_pub_demo_9876543210abcdef",
  userId: "user_demo",
};

const DEMO_ANALYTICS: AnalyticsData = {
  totalEvents: 12450,
  totalPageviews: 8430,
  uniqueVisitors: 1850,
  recentEvents: [
    {
      id: "1",
      eventType: "page-view",
      path: "/home",
      referrer: "Google",
      sessionId: "sess_1",
      createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    },
    {
      id: "2",
      eventType: "page-click",
      path: "/pricing",
      referrer: "Direct",
      sessionId: "sess_2",
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: "3",
      eventType: "page-view",
      path: "/docs",
      referrer: "Twitter",
      sessionId: "sess_3",
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
      id: "4",
      eventType: "page-view",
      path: "/checkout",
      referrer: "Direct",
      sessionId: "sess_4",
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: "5",
      eventType: "page-click",
      path: "/blog/news",
      referrer: "LinkedIn",
      sessionId: "sess_5",
      createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    },
  ],
  topPages: [
    { path: "/home", views: 4200 },
    { path: "/docs", views: 2100 },
    { path: "/pricing", views: 1350 },
    { path: "/blog", views: 580 },
    { path: "/contact", views: 200 },
  ],
  topReferrers: [
    { referrer: "Google", referrals: 3500 },
    { referrer: "Direct / Bookmark", referrals: 2800 },
    { referrer: "Twitter", referrals: 1200 },
    { referrer: "GitHub", referrals: 650 },
    { referrer: "LinkedIn", referrals: 280 },
  ],
};

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
  const { data: overview, isLoading: overviewLoading } = useAnalytics.overview(projectId, dateRange);
  const { data: breakdowns, isLoading: breakdownsLoading } = useAnalytics.breakdowns(projectId, dateRange);
  const { data: timeseries, isLoading: timeseriesLoading } = useAnalytics.getTimeseries(projectId, dateRange);
  const { data: realtime, isLoading: realtimeLoading } = useAnalytics.getRealtime(projectId, { refetchInterval: 5000 });

  const [refreshing, setRefreshing] = useState(false);

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

  if (!isLoaded || projectLoading) {
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

  // Fallback to demo project if project is loading or not found (for easy offline visualization)
  const activeProject = project || DEMO_PROJECT;

  // Format overview payload to match what GoogleAnalyticsDashboard expects
  const formattedOverview = overview ? {
    totalEvents: overview.totalEvents || 0,
    totalPageviews: overview.totalPageviews || 0,
    uniqueVisitors: overview.uniqueVisitors || 0,
    recentEvents: realtime?.recentActivity || [],
    topPages: [],
    topReferrers: []
  } : {
    totalEvents: DEMO_ANALYTICS.totalEvents,
    totalPageviews: DEMO_ANALYTICS.totalPageviews,
    uniqueVisitors: DEMO_ANALYTICS.uniqueVisitors,
    recentEvents: DEMO_ANALYTICS.recentEvents,
    topPages: DEMO_ANALYTICS.topPages,
    topReferrers: DEMO_ANALYTICS.topReferrers
  };

  return (
    <GoogleAnalyticsDashboard
      project={activeProject}
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
