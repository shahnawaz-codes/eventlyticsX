"use client";

import React, { useState } from "react";
import { useAnalyticsDashboard } from "../hooks/useAnalyticsDashboard";
import { format } from "date-fns";
import {
  Sparkles,
  Calendar,
  Layers,
  Clock,
  Globe,
  Compass,
  Activity,
  ShieldAlert,
  Code,
} from "lucide-react";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import ReportsSnapshotCard from "./ReportsSnapshotCard";
import RealtimeCard from "./RealtimeCard";
import BreakdownsGrid from "./BreakdownsGrid";
import OverviewCards from "./OverviewCards";

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
  averageDuration?: number;
}

interface Project {
  id: string;
  name: string;
  public_key: string;
  userId: string;
}

interface GoogleAnalyticsDashboardProps {
  project: Project;
  overview: AnalyticsData | null;
  breakdowns: any;
  timeseries: any;
  realtime: any;
  dateRange: { label: string; startDate: string; endDate: string };
  setDateRange: (range: {
    label: string;
    startDate: string;
    endDate: string;
  }) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  isLoading?: boolean;
}


export default function AnalyticsDashboard({
  project,
  overview,
  breakdowns,
  timeseries,
  realtime,
  dateRange,
  setDateRange,
  refreshing = false,
  onRefresh,
  isLoading = false,
}: GoogleAnalyticsDashboardProps) {
  const { activeTab, setActiveTab } = useAnalyticsDashboard();
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-zinc-800 font-sans">
      {/* Top Navigation Header */}
      <DashboardHeader
        projectName={project.name}
        projectId={project.id}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />

      {/* Main Section */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left GA Sidebar */}
        <DashboardSidebar activeTab={activeTab} onChangeTab={setActiveTab} />

        {/* Dynamic Center Panel */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
          {activeTab === "home" && (
            <>
              {/* Home Greeting Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                    Home
                  </h1>
                  <p className="text-xs text-zinc-450 mt-0.5">
                    Welcome back to your project analysis workspace.
                  </p>
                </div>

                {/* Integration Status Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50/50 text-[10px] font-bold text-blue-700 select-none">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Public Key Active</span>
                </div>
              </div>

              {/* Row 0: Overview KPI Cards */}
              <OverviewCards overview={overview} isLoading={isLoading} />

              {/* Row 1: Main Area Chart (ReportsSnapshotCard) + Realtime active counter (RealtimeCard) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-8 flex flex-col justify-between">
                  <ReportsSnapshotCard
                    data={timeseries}
                    isLoading={isLoading}
                    onViewSnapshot={() => setActiveTab("reports")}
                  />
                </div>
                <div className="lg:col-span-4 flex flex-col justify-between">
                  <RealtimeCard
                    activeCount={realtime?.activeUsers || 0}
                    realtime={realtime}
                    isLoading={isLoading}
                    onViewRealtime={() => setActiveTab("reports")}
                  />
                </div>
              </div>

              {/* Row 2: Analytics Breakdowns Grid */}
              <BreakdownsGrid breakdowns={breakdowns} isLoading={isLoading} />
            </>
          )}

          {activeTab === "reports" && (
            <>
              {/* Reports Dashboard Section */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                    Reports snapshot
                  </h1>
                  <p className="text-xs text-zinc-450 mt-0.5">
                    Comprehensive real-time telemetry metrics and detailed
                    breakdown streams.
                  </p>
                </div>

                {/* Event Logs table details */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Live Visitor Logs Stream
                      </h3>
                      <p className="text-[10px] text-zinc-400 font-medium">
                        Real-time incoming telemetry log files tracking user
                        sessions
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                          <th className="py-2.5 px-3">Event Type</th>
                          <th className="py-2.5 px-3">Path Location</th>
                          <th className="py-2.5 px-3">Referrer Source</th>
                          <th className="py-2.5 px-3">Session Key</th>
                          <th className="py-2.5 px-3 text-right">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-50 font-medium text-zinc-650">
                        {realtime?.recentActivity &&
                        realtime.recentActivity.length > 0 ? (
                          realtime.recentActivity.map((evt: any) => {
                            const isExpanded = expandedEventId === evt.id;
                            const metaObj = typeof evt.metadata === "string" 
                              ? (() => { try { return JSON.parse(evt.metadata); } catch { return null; } })() 
                              : evt.metadata;
                            const hasMetadata = metaObj && Object.keys(metaObj).length > 0;

                            return (
                              <React.Fragment key={evt.id}>
                                <tr
                                  onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                                  className={`hover:bg-zinc-50/80 transition-colors cursor-pointer select-none ${
                                    isExpanded ? "bg-zinc-50/50" : ""
                                  }`}
                                >
                                  <td className="py-3 px-3">
                                    <span
                                      className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border ${
                                        evt.eventType === "page-view" ||
                                        evt.eventType === "pageview"
                                          ? "bg-blue-50 border-blue-100 text-blue-700"
                                          : evt.eventType === "page-click"
                                            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                            : "bg-purple-50 border-purple-100 text-purple-700"
                                      }`}
                                    >
                                      {evt.eventType}
                                    </span>
                                  </td>
                                  <td className="py-3 px-3 font-mono text-zinc-800 text-[11px] truncate max-w-[180px]">
                                    {evt.path}
                                  </td>
                                  <td
                                    className="py-3 px-3 truncate max-w-[140px]"
                                    title={evt.referrer}
                                  >
                                    {evt.referrer || "Direct"}
                                  </td>
                                  <td className="py-3 px-3 font-mono text-zinc-400 text-[10px]">
                                    {evt.sessionId.slice(0, 15)}...
                                  </td>
                                  <td className="py-3 px-3 text-right text-zinc-400 font-mono text-[10px]">
                                    {format(new Date(evt.createdAt), "hh:mm:ss a")}
                                  </td>
                                </tr>
                                {isExpanded && (
                                  <tr className="bg-zinc-50/30">
                                    <td colSpan={5} className="py-4 px-6 border-b border-zinc-100">
                                      <div className="space-y-4 text-zinc-650 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {/* Geo & System Info Grid */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px]">
                                          <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Location</span>
                                            <span className="font-semibold text-zinc-800 flex items-center gap-1">
                                              🌐 {evt.country && evt.country !== "unknown" ? evt.country : "Unknown"}
                                              {evt.city && evt.city !== "unknown" && `, ${evt.city}`}
                                            </span>
                                          </div>
                                          <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Browser</span>
                                            <span className="font-semibold text-zinc-800">
                                              💻 {evt.browser || "Unknown"}
                                            </span>
                                          </div>
                                          <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Operating System</span>
                                            <span className="font-semibold text-zinc-800">
                                              🖥️ {evt.os || "Unknown"}
                                            </span>
                                          </div>
                                          <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Device Type</span>
                                            <span className="font-semibold text-zinc-800 capitalize">
                                              📱 {evt.device || "desktop"}
                                            </span>
                                          </div>
                                        </div>

                                        {/* Metadata JSON display */}
                                        {hasMetadata && (
                                          <div className="space-y-1.5">
                                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Custom Event Properties</span>
                                            <pre className="text-[10px] font-mono bg-zinc-50 border border-zinc-200/80 text-zinc-700 p-3 rounded-lg overflow-x-auto max-h-[200px] scrollbar-thin">
                                              {JSON.stringify(metaObj, null, 2)}
                                            </pre>
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="py-8 text-center text-zinc-400 font-medium"
                            >
                              Waiting for events to arrive...
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "explore" && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center space-y-6 max-w-lg mx-auto shadow-sm hover:shadow-md transition-shadow select-none">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 border border-blue-150">
                <Compass className="h-8 w-8 text-blue-600 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50/50 border border-blue-200 px-2.5 py-0.5 text-[9px] font-bold text-blue-700 uppercase">
                  ✨ Under Construction
                </div>
                <h2 className="text-base font-bold text-zinc-905">
                  Explorations Canvas
                </h2>
                <p className="text-xs text-zinc-450 leading-relaxed max-w-xs mx-auto">
                  We are building advanced cohort analysis, user flow tracking, and funnel explorer engines to help you dig deeper into user behaviors.
                </p>
              </div>
              <div className="flex items-center gap-2.5 text-[10px] text-zinc-500 bg-zinc-50 border border-zinc-200/80 p-3.5 rounded-xl text-left">
                <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0" />
                <span>
                  <strong>Tip for Developers:</strong> You can create custom funnel query endpoints in the backend and visualize user dropoffs here using Recharts! Check the documentation for more details.
                </span>
              </div>
            </div>
          )}

          {activeTab === "advertising" && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center space-y-6 max-w-lg mx-auto shadow-sm hover:shadow-md transition-shadow select-none">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 border border-blue-150">
                <Layers className="h-8 w-8 text-blue-600 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50/50 border border-blue-200 px-2.5 py-0.5 text-[9px] font-bold text-blue-700 uppercase">
                  ✨ Still In Development
                </div>
                <h2 className="text-base font-bold text-zinc-905">
                  Advertising &amp; Campaigns
                </h2>
                <p className="text-xs text-zinc-450 leading-relaxed max-w-xs mx-auto">
                  Evaluate traffic attribution, multi-touch campaign performance, and acquisition flows to measure marketing ROI in real time.
                </p>
              </div>
              <div className="flex items-center gap-2.5 text-[10px] text-zinc-500 bg-zinc-50 border border-zinc-200/80 p-3.5 rounded-xl text-left">
                <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0" />
                <span>
                  <strong>Tip for Developers:</strong> Map UTM parameters in your SDK integration to trace campaigns. Learn how to bind campaigns in the documentation.
                </span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
