"use client";

import { CheckCircle2, ChevronDown } from "lucide-react";

interface BreakDownRow {
  label: string;
  value: number;
}

interface BreakdownCardProps {
  title: string;
  subtitle: string;
  rows: BreakDownRow[];
  filterLabel: string;
}

function BreakdownWidget({ title, subtitle, rows, filterLabel }: BreakdownCardProps) {
  const maxVal = rows.length > 0 ? Math.max(...rows.map((r) => r.value), 1) : 1;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between select-none">
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          {/* Dropdown title filter */}
          <button className="flex items-center gap-1 text-[11px] font-bold text-zinc-500 hover:text-zinc-800 transition-colors">
            <span>{title}</span>
            <ChevronDown className="h-3 w-3 text-zinc-400" />
          </button>
          <p className="text-[10px] text-zinc-400 font-medium">{subtitle}</p>
        </div>
        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
      </div>

      {/* Row list */}
      <div className="space-y-3 flex-1 flex flex-col justify-center pt-2">
        {rows.length === 0 ? (
          <div className="text-center py-8 text-zinc-400 text-xxs font-medium">
            Waiting for telemetry data...
          </div>
        ) : (
          rows.map((row, idx) => {
            const percentage = (row.value / maxVal) * 100;
            return (
              <div key={row.label || idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-700">
                  <span className="truncate max-w-[170px]" title={row.label}>{row.label}</span>
                  <span className="font-bold text-zinc-900">{row.value.toLocaleString()}</span>
                </div>
                
                {/* Custom Relative ratio bar */}
                <div className="w-full h-1.5 bg-zinc-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Action Footer */}
      <div className="border-t border-zinc-100 pt-3.5 flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
        <span>{filterLabel}</span>
        <button className="text-blue-600 hover:text-blue-800 cursor-pointer">
          See details
        </button>
      </div>
    </div>
  );
}

interface SuggestedForYouProps {
  breakdowns?: {
    pages?: Array<{ path: string; views: number }>;
    countries?: Array<{ country: string; count: number }>;
    referrers?: Array<{ referrer: string; count: number }>;
  } | null;
  isLoading?: boolean;
}

export default function SuggestedForYou({ breakdowns, isLoading = false }: SuggestedForYouProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 select-none">
        <div className="border-b border-zinc-150 pb-1.5 inline-block">
          <h3 className="text-[13px] font-bold text-zinc-800 tracking-tight">
            Suggested for you
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-5 h-64 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-3 w-28 bg-zinc-200 rounded" />
                <div className="h-2 w-36 bg-zinc-200 rounded" />
              </div>
              <div className="space-y-4 py-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-2.5 w-24 bg-zinc-200/80 rounded" />
                      <div className="h-2.5 w-8 bg-zinc-200/80 rounded" />
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 rounded" />
                  </div>
                ))}
              </div>
              <div className="h-4 w-full bg-zinc-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const countryBreakdown = (breakdowns?.countries && breakdowns.countries.length > 0)
    ? breakdowns.countries.map((c) => ({ label: c.country || "Unknown", value: c.count }))
    : [];

  const pageBreakdown = (breakdowns?.pages && breakdowns.pages.length > 0)
    ? breakdowns.pages.map((p) => ({ label: p.path, value: p.views }))
    : [];

  const channelBreakdown = (breakdowns?.referrers && breakdowns.referrers.length > 0)
    ? breakdowns.referrers.map((r) => ({ label: r.referrer || "Direct", value: r.count }))
    : [];

  return (
    <div className="space-y-4 select-none">
      <div className="border-b border-zinc-150 pb-1.5 inline-block">
        <h3 className="text-[13px] font-bold text-zinc-800 tracking-tight cursor-help border-b border-dashed border-zinc-400 pb-0.5">
          Suggested for you
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BreakdownWidget
          title="Active users by Country ID"
          subtitle="Users by geographical origin"
          rows={countryBreakdown}
          filterLabel="Country"
        />

        <BreakdownWidget
          title="Views by Page title and screen class"
          subtitle="Top visited locations by content type"
          rows={pageBreakdown}
          filterLabel="Page path"
        />

        <BreakdownWidget
          title="Sessions by Session primary channel group"
          subtitle="Sessions by marketing channel classification"
          rows={channelBreakdown}
          filterLabel="Channel group"
        />
      </div>
    </div>
  );
}
