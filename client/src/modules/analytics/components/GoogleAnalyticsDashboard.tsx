"use client";

import { useState } from "react";
import { Sparkles, Calendar, Layers, Clock, Globe, Compass, Activity, ShieldAlert, Code } from "lucide-react";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import ReportsSnapshotCard from "./ReportsSnapshotCard";
import RealtimeCard from "./RealtimeCard";
import RecentlyAccessed from "./RecentlyAccessed";
import SuggestedForYou from "./SuggestedForYou";
import LearningChallenges from "./LearningChallenges";

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

interface Project {
  id: string;
  name: string;
  public_key: string;
  userId: string;
}

interface GoogleAnalyticsDashboardProps {
  project: Project;
  overview: AnalyticsData | null;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export default function GoogleAnalyticsDashboard({
  project,
  overview,
  refreshing = false,
  onRefresh,
}: GoogleAnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-zinc-800 font-sans">
      {/* Top Navigation Header */}
      <DashboardHeader
        projectName={project.name}
        projectId={project.id}
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
                  <h1 className="text-xl font-bold tracking-tight text-zinc-900">Home</h1>
                  <p className="text-xs text-zinc-450 mt-0.5">Welcome back to your project analysis workspace.</p>
                </div>
                
                {/* Integration Status Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50/50 text-[10px] font-bold text-blue-700 select-none">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Public Key Active</span>
                </div>
              </div>

              {/* Row 1: Main Area Chart (ReportsSnapshotCard) + Realtime active counter (RealtimeCard) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-8 flex flex-col justify-between">
                  <ReportsSnapshotCard onViewSnapshot={() => setActiveTab("reports")} />
                </div>
                <div className="lg:col-span-4 flex flex-col justify-between">
                  <RealtimeCard 
                    activeCount={overview?.uniqueVisitors || 2} 
                    onViewRealtime={() => setActiveTab("reports")} 
                  />
                </div>
              </div>

              {/* Row 2: Recently Accessed History Cards */}
              <RecentlyAccessed />

              {/* Row 3: Suggested Metrics breakdown widget grids */}
              <SuggestedForYou />

              {/* Row 4: Developer Challenge Center Onboarding checklists */}
              <LearningChallenges />
            </>
          )}

          {activeTab === "reports" && (
            <>
              {/* Reports Dashboard Section */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-zinc-900">Reports snapshot</h1>
                  <p className="text-xs text-zinc-450 mt-0.5">Comprehensive real-time telemetry metrics and detailed breakdown streams.</p>
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
                        Real-time incoming telemetry log files tracking user sessions
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
                        {overview?.recentEvents && overview.recentEvents.length > 0 ? (
                          overview.recentEvents.map((evt) => (
                            <tr key={evt.id} className="hover:bg-zinc-50/50 transition-colors">
                              <td className="py-3 px-3">
                                <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border ${
                                  evt.eventType === "page-view" || evt.eventType === "pageview"
                                    ? "bg-blue-50 border-blue-100 text-blue-700"
                                    : evt.eventType === "page-click"
                                      ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                      : "bg-purple-50 border-purple-100 text-purple-700"
                                }`}>
                                  {evt.eventType}
                                </span>
                              </td>
                              <td className="py-3 px-3 font-mono text-zinc-800 text-[11px] truncate max-w-[180px]">
                                {evt.path}
                              </td>
                              <td className="py-3 px-3 truncate max-w-[140px]" title={evt.referrer}>
                                {evt.referrer || "Direct"}
                              </td>
                              <td className="py-3 px-3 font-mono text-zinc-400 text-[10px]">
                                {evt.sessionId.slice(0, 15)}...
                              </td>
                              <td className="py-3 px-3 text-right text-zinc-400 font-mono text-[10px]">
                                {new Date(evt.createdAt).toLocaleTimeString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-zinc-400 font-medium">
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
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center space-y-4 max-w-lg mx-auto">
              <Compass className="h-12 w-12 text-zinc-350 mx-auto" />
              <h2 className="text-base font-bold text-zinc-800">Explorations Canvas</h2>
              <p className="text-xs text-zinc-400 leading-normal">
                Explorations is a collection of advanced techniques that go beyond standard reports to help you uncover deeper insights about customer behavior.
              </p>
              <div className="flex items-center gap-2 text-xxs text-amber-700 bg-amber-50 border border-amber-100 p-2.5 rounded-lg text-left">
                <ShieldAlert className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                <span>
                  <strong>UI Developer Challenge:</strong> Try creating custom funnel charts using Recharts under this route to visualize user conversion dropoffs!
                </span>
              </div>
            </div>
          )}

          {activeTab === "advertising" && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center space-y-4 max-w-lg mx-auto">
              <Layers className="h-12 w-12 text-zinc-350 mx-auto" />
              <h2 className="text-base font-bold text-zinc-800">Advertising &amp; Conversions</h2>
              <p className="text-xs text-zinc-400 leading-normal">
                Understand conversion attribution paths, trace which channels drive the most acquisitions, and evaluate marketing ROI.
              </p>
              <div className="flex items-center gap-2 text-xxs text-amber-700 bg-amber-50 border border-amber-100 p-2.5 rounded-lg text-left">
                <ShieldAlert className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                <span>
                  <strong>UI Developer Challenge:</strong> Build custom attribution bar graphs and display advertising conversion flows.
                </span>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
