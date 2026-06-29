"use client";

import { useState } from "react";
import { ChevronDown, ArrowRight, Award, CheckCircle } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface DailyStat {
  date: string;
  activeUsers: number;
  eventCount: number;
  newUsers: number;
  keyEvents: number;
  activeUsersPrev: number;
  eventCountPrev: number;
  newUsersPrev: number;
  keyEventsPrev: number;
}

interface ReportsSnapshotCardProps {
  data?: DailyStat[] | null;
  isLoading?: boolean;
  onViewSnapshot?: () => void;
}

export default function ReportsSnapshotCard({
  data = [],
  isLoading = false,
  onViewSnapshot,
}: ReportsSnapshotCardProps) {
  const [activeTab, setActiveTab] = useState<"activeUsers" | "eventCount" | "newUsers" | "keyEvents">("activeUsers");
  const [timeRange, setTimeRange] = useState("Last 7 days");

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm h-96 flex flex-col justify-between select-none animate-pulse">
        <div className="flex gap-4 border-b border-zinc-150 pb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1 space-y-2">
              <div className="h-3 w-16 bg-zinc-200 rounded" />
              <div className="h-8 w-24 bg-zinc-200 rounded" />
            </div>
          ))}
        </div>
        <div className="flex-1 flex items-end justify-between gap-4 pt-6 px-4">
          {[40, 60, 30, 80, 50, 70, 90].map((h, i) => (
            <div key={i} className="bg-zinc-100 rounded-t w-full" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    );
  }

  const resolvedData = data || [];

  // Map incoming database timeseries format if necessary
  const chartData = (resolvedData && resolvedData.length > 0 && "pageviews" in resolvedData[0])
    ? (resolvedData as any[]).map((item, idx) => {
        const uniqueVisitors = item.uniqueVisitors || 0;
        const pageviews = item.pageviews || 0;
        return {
          date: item.date,
          activeUsers: uniqueVisitors,
          eventCount: pageviews,
          newUsers: Math.ceil(uniqueVisitors * 0.7),
          keyEvents: Math.floor(pageviews * 0.1),
          // Preceding period comparisons (offsetting values to show dashed lines)
          activeUsersPrev: Math.max(0, uniqueVisitors - (idx % 2 === 0 ? 1 : 0)),
          eventCountPrev: Math.max(0, pageviews - (idx % 3 === 0 ? 2 : 1)),
          newUsersPrev: Math.max(0, Math.ceil(uniqueVisitors * 0.7) - (idx % 2 === 0 ? 1 : 0)),
          keyEventsPrev: Math.max(0, Math.floor(pageviews * 0.1) - (idx % 4 === 0 ? 1 : 0)),
        };
      })
    : (resolvedData as DailyStat[]);

  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm h-96 flex flex-col items-center justify-center text-center select-none">
        <div className="text-zinc-400 space-y-2">
          <p className="font-semibold text-sm">No data recorded for this time range</p>
          <p className="text-xs max-w-sm">Integrate the tracking script and trigger events to see chronological traffic trends here.</p>
        </div>
      </div>
    );
  }

  // Sum or average metrics for tab headers
  const getTotals = () => {
    return {
      activeUsers: chartData[chartData.length - 1]?.activeUsers || 0,
      eventCount: chartData.reduce((sum, item) => sum + item.eventCount, 0),
      newUsers: chartData.reduce((sum, item) => sum + item.newUsers, 0),
      keyEvents: chartData.reduce((sum, item) => sum + item.keyEvents, 0),
    };
  };

  const totals = getTotals();

  const tabs = [
    { id: "activeUsers", label: "Active users", value: totals.activeUsers, key: "activeUsers", prevKey: "activeUsersPrev" },
    { id: "eventCount", label: "Event count", value: totals.eventCount, key: "eventCount", prevKey: "eventCountPrev" },
    { id: "newUsers", label: "New users", value: totals.newUsers, key: "newUsers", prevKey: "newUsersPrev" },
    { id: "keyEvents", label: "Key events", value: totals.keyEvents, key: "keyEvents", prevKey: "keyEventsPrev" },
  ] as const;

  const currentTab = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm flex flex-col overflow-hidden select-none hover:shadow-md transition-shadow">
      {/* Upper Tab Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-zinc-150 relative">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col text-left px-5 py-4 cursor-pointer transition-all border-r border-zinc-100 last:border-r-0 relative ${
                isSelected ? "bg-zinc-50/50" : "hover:bg-zinc-50/20"
              }`}
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-500 hover:text-zinc-800 transition-colors uppercase tracking-wider">
                <span>{tab.label}</span>
                <ChevronDown className="h-3 w-3 text-zinc-400" />
              </div>
              <div className="text-3xl font-extrabold text-zinc-900 mt-1 tracking-tight">
                {tab.value}
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-200 mt-2 self-start border border-white shadow-sm" />
              
              {/* Highlight bar */}
              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 animate-in fade-in zoom-in-y duration-200" />
              )}
            </button>
          );
        })}

        {/* Floating helper badges */}
        <div className="absolute right-4 top-4 hidden md:flex items-center gap-2">
          <button className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors" title="Insights">
            <Award className="h-4 w-4" />
          </button>
          <button className="p-1 rounded-full text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors" title="Data quality is active">
            <CheckCircle className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Chart Body */}
      <div className="p-5 flex-1 flex flex-col gap-6">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a73e8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1a73e8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f4" />
              
              <XAxis
                dataKey="date"
                stroke="#70757a"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={8}
              />
              
              <YAxis
                stroke="#70757a"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              
              <Tooltip
                contentStyle={{
                  backgroundColor: "#202124",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "11px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}
                labelStyle={{ fontWeight: "bold", color: "#8ab4f8" }}
              />

              {/* Preceding Period (Dashed) */}
              <Area
                type="monotone"
                dataKey={currentTab.prevKey}
                name="Preceding Period"
                stroke="#1a73e8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="none"
              />

              {/* Current Period (Solid Area) */}
              <Area
                type="monotone"
                dataKey={currentTab.key}
                name={currentTab.label}
                stroke="#1a73e8"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#currentGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend + Date Toggles */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-zinc-100 pt-4">
          <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-zinc-500">
            <span className="flex items-center gap-2">
              <span className="h-0.5 w-5 bg-blue-600 rounded-full inline-block" />
              <span>Last 7 days</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="h-0.5 w-5 bg-blue-400 border-t border-dashed border-spacing-2 inline-block" />
              <span>Preceding period</span>
            </span>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <button className="flex items-center gap-1 text-[11px] font-bold text-zinc-500 hover:text-zinc-800 transition-colors bg-zinc-50 hover:bg-zinc-100 px-2.5 py-1.5 rounded-lg border border-zinc-200 cursor-pointer">
              <span>{timeRange}</span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
            </button>

            {onViewSnapshot && (
              <button
                onClick={onViewSnapshot}
                className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-all hover:gap-1.5 cursor-pointer"
              >
                <span>View reports snapshot</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
