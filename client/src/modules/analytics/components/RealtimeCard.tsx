"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

interface RealtimeCountry {
  country: string;
  activeUsers: number;
}

interface RealtimeMinute {
  minute: string;
  activeUsers: number;
}

interface RealtimeCardProps {
  activeCount?: number;
  minuteData?: RealtimeMinute[];
  countryData?: RealtimeCountry[];
  realtime?: {
    activeUsers: number;
    recentActivity: any[];
  } | null;
  isLoading?: boolean;
  onViewRealtime?: () => void;
}

const DEFAULT_MINUTE_DATA: RealtimeMinute[] = Array.from({ length: 30 }).map(
  (_, idx) => ({
    minute: `${30 - idx}m ago`,
    activeUsers: 0,
  }),
);

const DEFAULT_COUNTRY_DATA: RealtimeCountry[] = [];

export default function RealtimeCard({
  activeCount = 0,
  minuteData = DEFAULT_MINUTE_DATA,
  countryData = DEFAULT_COUNTRY_DATA,
  realtime,
  isLoading = false,
  onViewRealtime,
}: RealtimeCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 h-[380px] shadow-sm flex flex-col justify-between select-none animate-pulse">
        <div className="space-y-2">
          <div className="h-2.5 w-32 bg-zinc-200 rounded" />
          <div className="h-10 w-16 bg-zinc-200 rounded" />
        </div>
        <div className="flex-1 flex items-end gap-1.5 pt-4">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="bg-zinc-150 rounded-t w-full" style={{ height: `${(i % 5 === 0) ? 40 : 10}%` }} />
          ))}
        </div>
        <div className="space-y-3 pt-4 border-t border-zinc-100">
          <div className="flex justify-between">
            <div className="h-2 w-16 bg-zinc-200 rounded" />
            <div className="h-2 w-10 bg-zinc-200 rounded" />
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-28 bg-zinc-200 rounded" />
              <div className="h-1 w-full bg-zinc-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Dynamically calculate from recent activity logs if available
  const recentLogs = realtime?.recentActivity || [];

  // 1. Calculate active users per minute for the last 30 minutes
  let calculatedMinuteData = minuteData;
  if (realtime && recentLogs.length > 0) {
    const minutesMap = new Map<number, number>();
    for (let i = 0; i < 30; i++) {
      minutesMap.set(i, 0);
    }
    const now = Date.now();
    recentLogs.forEach((log: any) => {
      const diffMs = now - new Date(log.createdAt).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins >= 0 && diffMins < 30) {
        minutesMap.set(diffMins, (minutesMap.get(diffMins) || 0) + 1);
      }
    });
    calculatedMinuteData = Array.from({ length: 30 }).map((_, idx) => {
      const mIndex = 29 - idx;
      return {
        minute: `${mIndex}m ago`,
        activeUsers: minutesMap.get(mIndex) || 0,
      };
    });
  }

  // 2. Calculate country distribution from recent activity
  let calculatedCountryData = countryData;
  if (realtime && recentLogs.length > 0) {
    const countryMap = new Map<string, Set<string>>();
    recentLogs.forEach((log: any) => {
      const c = log.country || "Unknown";
      if (!countryMap.has(c)) {
        countryMap.set(c, new Set());
      }
      countryMap.get(c)!.add(log.sessionId);
    });
    calculatedCountryData = Array.from(countryMap.entries())
      .map(([country, sessions]) => ({
        country,
        activeUsers: sessions.size,
      }))
      .sort((a, b) => b.activeUsers - a.activeUsers);
  }

  const maxActiveUsers = Math.max(
    ...calculatedCountryData.map((c) => c.activeUsers),
    1,
  );

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow select-none">
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-dashed border-zinc-200 pb-0.5 inline-block">
            Active users in last 30 minutes
          </h4>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-5xl font-black text-zinc-900 tracking-tight">
              {activeCount}
            </span>
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white shadow-sm"></span>
            </span>
          </div>
        </div>
        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
      </div>

      {/* Bar chart per minute */}
      <div className="space-y-1.5 flex-1 flex flex-col justify-center">
        <h5 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
          Active users per minute
        </h5>

        <div className="h-20 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={calculatedMinuteData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <Bar dataKey="activeUsers" fill="#1a73e8">
                {calculatedMinuteData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.activeUsers > 0 ? "#1a73e8" : "#e8eaed"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Country List Table */}
      <div className="space-y-2 border-t border-zinc-100 pt-3">
        <div className="flex items-center justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
          <span>Country</span>
          <span>Active Users</span>
        </div>

        <div className="space-y-2.5 max-h-36 overflow-y-auto pr-1">
          {calculatedCountryData.map((item, idx) => {
            const pct = (item.activeUsers / maxActiveUsers) * 100;
            return (
              <div key={item.country || idx} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-700">
                  <span className="truncate">{item.country}</span>
                  <span className="font-bold text-zinc-900">
                    {item.activeUsers}
                  </span>
                </div>
                {/* Horizontal ratio progress bar */}
                <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Link */}
      {onViewRealtime && (
        <button
          onClick={onViewRealtime}
          className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-all hover:gap-1.5 pt-2 border-t border-zinc-100 cursor-pointer self-start"
        >
          <span>View realtime</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
