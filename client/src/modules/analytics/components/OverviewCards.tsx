"use client";

import React from "react";
import { Users, Eye, Layers, Clock } from "lucide-react";

interface OverviewData {
  totalEvents: number;
  totalPageviews: number;
  uniqueVisitors: number;
  averageDuration?: number;
}

interface OverviewCardsProps {
  overview: OverviewData | null;
  isLoading?: boolean;
}

const formatDuration = (seconds?: number) => {
  if (seconds === undefined || seconds === null) return "0s";
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
};

export default function OverviewCards({ overview, isLoading = false }: OverviewCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[120px] rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className="h-3 w-24 bg-zinc-200 rounded animate-pulse" />
              <div className="h-8 w-8 bg-zinc-100 rounded-lg animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-7 w-20 bg-zinc-200 rounded animate-pulse" />
              <div className="h-2 w-32 bg-zinc-150 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Unique Visitors",
      value: (overview?.uniqueVisitors ?? 0).toLocaleString(),
      description: "Distinct user sessions active in timeframe",
      icon: Users,
      colorClass: "text-indigo-600 bg-indigo-50 border-indigo-100",
      gradient: "from-indigo-500/5 to-transparent",
    },
    {
      title: "Total Pageviews",
      value: (overview?.totalPageviews ?? 0).toLocaleString(),
      description: "Raw page navigation logs captured",
      icon: Eye,
      colorClass: "text-emerald-600 bg-emerald-50 border-emerald-100",
      gradient: "from-emerald-500/5 to-transparent",
    },
    {
      title: "Avg. Session Duration",
      value: formatDuration(overview?.averageDuration),
      description: "Average time spent per session",
      icon: Clock,
      colorClass: "text-rose-600 bg-rose-50 border-rose-100",
      gradient: "from-rose-500/5 to-transparent",
    },
    {
      title: "Total Events",
      value: (overview?.totalEvents ?? 0).toLocaleString(),
      description: "Actions, interactions, and logs executed",
      icon: Layers,
      colorClass: "text-amber-600 bg-amber-50 border-amber-100",
      gradient: "from-amber-500/5 to-transparent",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 select-none"
          >
            {/* Subtle Gradient Hover Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
            />

            <div className="relative z-10 flex flex-col justify-between h-full gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  {card.title}
                </span>
                <div
                  className={`p-2 rounded-xl border ${card.colorClass} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>

              <div>
                <div className="text-3xl font-extrabold text-zinc-900 tracking-tight flex items-baseline gap-1.5">
                  {card.value}
                </div>
                <p className="text-[10px] text-zinc-450 mt-1 font-medium leading-normal">
                  {card.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

