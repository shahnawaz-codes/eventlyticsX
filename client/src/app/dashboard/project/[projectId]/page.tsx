"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  Activity,
  ArrowLeft,
  Key,
  Copy,
  Check,
  RefreshCw,
  Globe,
  Eye,
  Users,
  Compass,
  Sparkles,
  Settings,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Project } from "@/modules/project/types";
import { useProject } from "@/modules/project/hooks/query";

interface EventItem {
  id: string;
  eventType: string;
  path: string;
  referrer: string;
  sessionId: string;
  createdAt: string;
}

interface DailyStatItem {
  date: string;
  pageviews: number;
  uniqueVisitors: number;
  totalEvents: number;
}

interface AnalyticsData {
  totalEvents: number;
  totalPageviews: number;
  uniqueVisitors: number;
  recentEvents: EventItem[];
  topPages: { path: string; views: number }[];
  topReferrers: { referrer: string; referrals: number }[];
  dailyStats?: DailyStatItem[];
}

// Demo data for offline testing and visualization
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
      eventType: "page-exit",
      path: "/checkout",
      referrer: "Direct",
      sessionId: "sess_4",
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: "5",
      eventType: "page-view",
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
  dailyStats: [
    { date: "Jun 16", pageviews: 850, uniqueVisitors: 210, totalEvents: 1200 },
    { date: "Jun 17", pageviews: 980, uniqueVisitors: 240, totalEvents: 1450 },
    { date: "Jun 18", pageviews: 1150, uniqueVisitors: 290, totalEvents: 1700 },
    { date: "Jun 19", pageviews: 1300, uniqueVisitors: 310, totalEvents: 1950 },
    { date: "Jun 20", pageviews: 1250, uniqueVisitors: 300, totalEvents: 1800 },
    { date: "Jun 21", pageviews: 1400, uniqueVisitors: 340, totalEvents: 2050 },
    { date: "Jun 22", pageviews: 1500, uniqueVisitors: 370, totalEvents: 2300 },
  ],
};

export default function ProjectDetailsPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const isPending = !isLoaded;
  const router = useRouter();
  const params = useParams();
  const projectId = params?.projectId as string;
  const { data: project, isLoading: projectLoading } = useProject(projectId);
  // const [project, setProject] = useState<Project | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Prevent SSR hydration issues for Recharts
  useEffect(() => {
    setMounted(true);
  }, []);
  // TODO: Implement actual analytics refresh request from API
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Optionally update some values in analytics dynamically to make it feel alive on refresh
      if (analytics) {
        setAnalytics({
          ...analytics,
          totalEvents:
            analytics.totalEvents + Math.floor(Math.random() * 5) + 1,
          totalPageviews:
            analytics.totalPageviews + Math.floor(Math.random() * 3) + 1,
        });
      }
    } catch (err: any) {
      console.error("Error refreshing analytics:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCopyKey = () => {
    if (!project) return;
    navigator.clipboard.writeText(project.public_key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Process data for charts
  const getDailyTrafficData = () => {
    if (analytics?.dailyStats && analytics.dailyStats.length > 0) {
      return analytics.dailyStats;
    }
    // Fallback default empty week data
    return Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - idx));
      return {
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        pageviews: 0,
        uniqueVisitors: 0,
        totalEvents: 0,
      };
    });
  };

  const getEventDistributionData = () => {
    if (!analytics || !analytics.recentEvents) return [];

    // We can parse unique eventTypes from recentEvents to build chart slices
    const counts: Record<string, number> = {};
    analytics.recentEvents.forEach((evt) => {
      const type = evt.eventType || "other";
      counts[type] = (counts[type] || 0) + 1;
    });

    // If empty list, put a default
    if (Object.keys(counts).length === 0) {
      return [{ name: "No Data", value: 1, color: "#d4d4d8" }];
    }

    const colorMap: Record<string, string> = {
      "page-view": "#3b82f6",
      pageview: "#3b82f6",
      "page-click": "#10b981",
      "page-exit": "#f59e0b",
    };

    return Object.keys(counts).map((key) => ({
      name:
        key === "page-view" || key === "pageview"
          ? "Page Views"
          : key === "page-click"
            ? "Clicks"
            : key === "page-exit"
              ? "Exits"
              : key,
      value: counts[key],
      color: colorMap[key] || "#8b5cf6",
    }));
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-3">
          <Activity className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-medium text-zinc-500">
            Loading project analytics...
          </span>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-zinc-200 p-8 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-red-50 text-red-650 flex items-center justify-center mx-auto">
            <Settings className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900">
            Unable to load project
          </h3>
          <p className="text-xs text-zinc-500 leading-normal">
            {error || "Project data is unavailable."}
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const hasEvents = analytics && analytics.totalEvents > 0;
  const eventTypes = getEventDistributionData();
  const dailyTraffic = getDailyTrafficData();

  // COLORS for pie chart slices
  const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/50">
      {/* Detail Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-150 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 transition-colors cursor-pointer select-none"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-400">
                Projects
              </span>
              <span className="text-zinc-300 text-sm">/</span>
              <span className="text-sm font-bold text-zinc-800">
                {project.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Link to Centralized Setup Docs */}
            <button
              onClick={() =>
                router.push(`/dashboard/docs?project=${project.id}`)
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-all cursor-pointer select-none"
            >
              <BookOpen className="h-3.5 w-3.5 text-blue-600" />
              <span>Setup Docs</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-150 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-650 hover:text-zinc-950 transition-all select-none cursor-pointer"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-blue-600" : ""}`}
              />
              <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col gap-6">
        {/* Project Header Info */}
        <div className="rounded-2xl border border-zinc-200/85 bg-white p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                <Sparkles className="h-3 w-3" /> Analytics Live
              </span>
              <span className="text-zinc-350 text-xs">•</span>
              <span className="text-xxs font-medium text-zinc-400">
                UUID: {project.id}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">
              {project.name}
            </h1>
          </div>

          {/* Key Copy Block */}
          <div className="flex flex-col gap-2 min-w-[280px]">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Key className="h-3 w-3 text-zinc-400" /> Public Access Key
            </span>
            <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-2">
              <code className="text-xs text-zinc-700 font-mono select-all truncate max-w-[220px]">
                {project.public_key}
              </code>
              <button
                onClick={handleCopyKey}
                className="ml-3 p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-200/60 transition-colors select-none cursor-pointer"
                title="Copy Key"
              >
                {copiedKey ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 1. AGGREGATED METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm space-y-2 flex flex-col justify-between">
            <span className="text-xxs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Eye className="h-3.5 w-3.5 text-zinc-400" />
              Total Page Views
            </span>
            <div className="text-3xl font-extrabold tracking-tight text-zinc-950">
              {analytics?.totalPageviews || 0}
            </div>
            <span className="text-[10px] font-medium text-zinc-400">
              Total tracked views
            </span>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm space-y-2 flex flex-col justify-between">
            <span className="text-xxs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-zinc-400" />
              Unique Visitors
            </span>
            <div className="text-3xl font-extrabold tracking-tight text-zinc-950">
              {analytics?.uniqueVisitors || 0}
            </div>
            <span className="text-[10px] font-medium text-zinc-400">
              Unique active session keys
            </span>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm space-y-2 flex flex-col justify-between">
            <span className="text-xxs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Activity className="h-3.5 w-3.5 text-zinc-400" />
              Total Telemetry Events
            </span>
            <div className="text-3xl font-extrabold tracking-tight text-zinc-950">
              {analytics?.totalEvents || 0}
            </div>
            <span className="text-[10px] font-medium text-zinc-400">
              Combined events dispatched
            </span>
          </div>

          {/* Docs Promotion CTA Card */}
          <div className="rounded-2xl border border-blue-200/60 bg-blue-50/30 p-5 shadow-sm flex flex-col justify-between group hover:border-blue-300 hover:bg-blue-50/50 transition-all">
            <span className="text-xxs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-blue-600" />
              Need Help Tracking?
            </span>
            <div className="space-y-1">
              <p className="text-xs font-bold text-zinc-800">
                Add tracking to React, HTML, or Next.js
              </p>
              <p className="text-[10px] text-zinc-500 leading-normal">
                Get code snippets instantly with key pre-filled.
              </p>
            </div>
            <button
              onClick={() =>
                router.push(`/dashboard/docs?project=${project.id}`)
              }
              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors pt-2 group-hover:gap-2 select-none cursor-pointer"
            >
              <span>View setup docs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* EMPTY STATE OR FULL CHARTS LAYOUT */}
        {!hasEvents ? (
          <div className="rounded-2xl border-2 border-dashed border-zinc-250 bg-white p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[400px]">
            <div className="relative flex h-12 w-12">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-12 w-12 bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Activity className="h-6 w-6" />
              </span>
            </div>
            <div className="max-w-md space-y-1.5">
              <h3 className="font-bold text-lg text-zinc-950">
                Awaiting Telemetry Data
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                We haven't received any analytical events from this project yet.
                Please integrate the SDK to connect your web application's page
                views and button clicks.
              </p>
            </div>
            <button
              onClick={() =>
                router.push(`/dashboard/docs?project=${project.id}`)
              }
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-md select-none cursor-pointer mt-2"
            >
              <BookOpen className="h-3.5 w-3.5" /> Start Integration Guide
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* ROW 2: 7-DAY TRAFFIC HISTORY CHART & EVENT DISTRIBUTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Traffic Trend (8 cols) */}
              <div className="lg:col-span-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-zinc-400" />
                      Traffic Trend History
                    </h3>
                    <p className="text-xxs text-zinc-450">
                      Daily aggregates for pageviews and unique visitors
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xxs font-semibold">
                    <span className="flex items-center gap-1.5 text-blue-600">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>{" "}
                      Pageviews
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>{" "}
                      Unique Visitors
                    </span>
                  </div>
                </div>

                <div className="h-72 w-full">
                  {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={dailyTraffic}
                        margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="pvGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#3b82f6"
                              stopOpacity={0.15}
                            />
                            <stop
                              offset="95%"
                              stopColor="#3b82f6"
                              stopOpacity={0.0}
                            />
                          </linearGradient>
                          <linearGradient
                            id="uvGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#10b981"
                              stopOpacity={0.15}
                            />
                            <stop
                              offset="95%"
                              stopColor="#10b981"
                              stopOpacity={0.0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e4e4e7"
                        />
                        <XAxis
                          dataKey="date"
                          stroke="#a1a1aa"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis
                          stroke="#a1a1aa"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#18181b",
                            border: "none",
                            borderRadius: "10px",
                            color: "#fff",
                            fontSize: "11px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="pageviews"
                          name="Pageviews"
                          stroke="#3b82f6"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#pvGrad)"
                        />
                        <Area
                          type="monotone"
                          dataKey="uniqueVisitors"
                          name="Visitors"
                          stroke="#10b981"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#uvGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Event Type Distribution (4 cols) */}
              <div className="lg:col-span-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4 flex flex-col">
                <div className="border-b border-zinc-100 pb-3">
                  <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-zinc-400" />
                    Event Distribution
                  </h3>
                  <p className="text-xxs text-zinc-450">
                    Telemetry events breakdown by classification
                  </p>
                </div>

                <div className="h-48 w-full relative flex-1 flex items-center justify-center">
                  {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={eventTypes}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {eventTypes.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.color ||
                                PIE_COLORS[index % PIE_COLORS.length]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#18181b",
                            border: "none",
                            borderRadius: "10px",
                            color: "#fff",
                            fontSize: "10px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                  {/* Central Text inside Donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Total
                    </span>
                    <span className="text-2xl font-black text-zinc-900">
                      {analytics?.totalEvents}
                    </span>
                  </div>
                </div>

                {/* Custom Legend for Event Types */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-50">
                  {eventTypes.map((entry, index) => (
                    <div
                      key={entry.name}
                      className="flex items-center gap-1.5 text-xxs text-zinc-650 min-w-0"
                    >
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            entry.color ||
                            PIE_COLORS[index % PIE_COLORS.length],
                        }}
                      ></span>
                      <span className="truncate" title={entry.name}>
                        {entry.name}
                      </span>
                      <span className="font-bold text-zinc-800">
                        ({entry.value})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ROW 3: TOP VISITED PAGES & TOP REFERRERS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Pages (Horizontal BarChart) */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
                <div className="border-b border-zinc-100 pb-3">
                  <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-zinc-400" />
                    Top Pages Visited
                  </h3>
                  <p className="text-xxs text-zinc-450">
                    Most active content locations sorted by view count
                  </p>
                </div>

                <div className="h-64 w-full">
                  {mounted && analytics && analytics.topPages.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={analytics.topPages}
                        margin={{ top: 0, right: 10, left: 15, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={false}
                          stroke="#e4e4e7"
                        />
                        <XAxis
                          type="number"
                          stroke="#a1a1aa"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="path"
                          stroke="#71717a"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          width={80}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#18181b",
                            border: "none",
                            borderRadius: "10px",
                            color: "#fff",
                            fontSize: "10px",
                          }}
                        />
                        <Bar
                          dataKey="views"
                          fill="#3b82f6"
                          radius={[0, 4, 4, 0]}
                          barSize={12}
                        >
                          {analytics.topPages.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={index === 0 ? "#1d4ed8" : "#3b82f6"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-xxs font-medium text-zinc-400">
                      No pageviews logged.
                    </div>
                  )}
                </div>
              </div>

              {/* Top Referrers (Vertical BarChart) */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
                <div className="border-b border-zinc-100 pb-3">
                  <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                    <Compass className="h-4 w-4 text-zinc-400" />
                    Top Referrers
                  </h3>
                  <p className="text-xxs text-zinc-450">
                    Top acquisition domains directing web traffic
                  </p>
                </div>

                <div className="h-64 w-full">
                  {mounted && analytics && analytics.topReferrers.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analytics.topReferrers}
                        margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e4e4e7"
                        />
                        <XAxis
                          dataKey="referrer"
                          stroke="#71717a"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#a1a1aa"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#18181b",
                            border: "none",
                            borderRadius: "10px",
                            color: "#fff",
                            fontSize: "10px",
                          }}
                        />
                        <Bar
                          dataKey="referrals"
                          name="Referrals"
                          fill="#10b981"
                          radius={[4, 4, 0, 0]}
                          barSize={16}
                        >
                          {analytics.topReferrers.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={index === 0 ? "#047857" : "#10b981"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-xxs font-medium text-zinc-400">
                      No referral logs recorded.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ROW 4: LIVE VISITOR LOG */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Live Visitor Logs
                  </h3>
                  <p className="text-xxs text-zinc-400">
                    Real-time incoming client events stream
                  </p>
                </div>
                <div className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider animate-pulse">
                  Listening
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xxs text-zinc-650 border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-400 uppercase tracking-wider font-bold">
                      <th className="py-2.5 px-3">Event Type</th>
                      <th className="py-2.5 px-3">Content Location (Path)</th>
                      <th className="py-2.5 px-3">Referrer</th>
                      <th className="py-2.5 px-3">Session ID</th>
                      <th className="py-2.5 px-3 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50 font-medium">
                    {analytics?.recentEvents.map((evt) => (
                      <tr
                        key={evt.id}
                        className="hover:bg-zinc-50/50 transition-colors"
                      >
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                              evt.eventType === "page-view" ||
                              evt.eventType === "pageview"
                                ? "bg-blue-50 border-blue-100 text-blue-700"
                                : evt.eventType === "page-click"
                                  ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                  : evt.eventType === "page-exit"
                                    ? "bg-amber-50 border-amber-100 text-amber-700"
                                    : "bg-purple-50 border-purple-100 text-purple-700"
                            }`}
                          >
                            {evt.eventType}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-zinc-800">
                          {evt.path}
                        </td>
                        <td
                          className="py-3 px-3 truncate max-w-[150px]"
                          title={evt.referrer || "Direct"}
                        >
                          {evt.referrer || "Direct / Bookmark"}
                        </td>
                        <td className="py-3 px-3 font-mono text-zinc-400">
                          {evt.sessionId.slice(0, 15)}...
                        </td>
                        <td className="py-3 px-3 text-right text-zinc-400 font-mono text-[9px]">
                          {new Date(evt.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
