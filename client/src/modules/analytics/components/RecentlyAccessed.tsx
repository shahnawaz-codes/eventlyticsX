"use client";

import { BarChart3, Clock, Compass, FileText, ChevronRight, Activity } from "lucide-react";

interface RecentItem {
  id: string;
  title: string;
  time: string;
  icon: any;
  iconColor: string;
  bgColor: string;
}

export default function RecentlyAccessed() {
  const items: RecentItem[] = [
    {
      id: "reports",
      title: "Reports snapshot",
      time: "Just Now",
      icon: BarChart3,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "realtime",
      title: "Realtime overview",
      time: "Just Now",
      icon: Activity,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      id: "landing",
      title: "Landing page",
      time: "today",
      icon: FileText,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      id: "user-acq",
      title: "User acquisition",
      time: "today",
      icon: Compass,
      iconColor: "text-violet-600",
      bgColor: "bg-violet-50",
    },
  ];

  return (
    <div className="space-y-3.5 select-none">
      <h3 className="text-[13px] font-bold text-zinc-800 tracking-tight">
        Recently accessed
      </h3>

      <div className="relative flex items-center">
        {/* Horizontal grid container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex items-center gap-3.5 p-4 rounded-xl border border-zinc-200 bg-white shadow-sm hover:shadow-md hover:border-zinc-300 hover:scale-[1.01] transition-all cursor-pointer group"
              >
                {/* Icon Box */}
                <div className={`h-8 w-8 rounded-lg ${item.bgColor} flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform`}>
                  <Icon className={`h-4.5 w-4.5 ${item.iconColor}`} />
                </div>

                {/* Text details */}
                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-900 truncate group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-medium flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3 text-zinc-350" />
                    <span>{item.time}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel control right button */}
        <button
          className="absolute -right-3 h-7 w-7 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm flex items-center justify-center text-zinc-500 hover:text-zinc-800 transition-all active:scale-95 hidden lg:flex cursor-pointer z-10 hover:-translate-x-0.5"
          title="Scroll next"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
