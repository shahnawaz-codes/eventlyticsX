"use client";

import { Home, BarChart2, Compass, Megaphone, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface DashboardSidebarProps {
  activeTab?: string;
  onChangeTab?: (tab: string) => void;
}

export default function DashboardSidebar({
  activeTab = "home",
  onChangeTab,
}: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(true);

  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "reports", label: "Reports", icon: BarChart2 },
    { id: "explore", label: "Explore", icon: Compass },
    { id: "advertising", label: "Advertising", icon: Megaphone },
  ];

  return (
    <aside 
      className={`border-r border-zinc-200 bg-white flex flex-col justify-between py-4 select-none transition-all duration-300 z-30 shrink-0 ${
        collapsed ? "w-14" : "w-56"
      }`}
    >
      {/* Upper Navigation Items */}
      <div className="flex flex-col gap-1.5 px-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeTab?.(item.id)}
              className={`group flex items-center relative gap-3.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-50 text-blue-600 shadow-sm border-l-2 border-blue-500 rounded-l-none"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-blue-600" : "text-zinc-400 group-hover:text-zinc-650"}`} />
              
              {!collapsed && (
                <span className="truncate animate-in fade-in slide-in-from-left-2 duration-200">
                  {item.label}
                </span>
              )}

              {/* Tooltip for collapsed mode */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 rounded bg-zinc-900 text-white text-[10px] font-bold tracking-wide whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Control & Settings */}
      <div className="flex flex-col gap-2 px-2 border-t border-zinc-100 pt-4">
        {/* Settings button */}
        <button
          className="group flex items-center relative gap-3.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-55 transition-all cursor-pointer"
          title={collapsed ? "Admin / Settings" : undefined}
        >
          <Settings className="h-4.5 w-4.5 text-zinc-405 group-hover:text-zinc-750 shrink-0" />
          {!collapsed && (
            <span className="truncate animate-in fade-in slide-in-from-left-2 duration-200">
              Admin
            </span>
          )}
          {collapsed && (
            <div className="absolute left-full ml-3 px-2 py-1 rounded bg-zinc-900 text-white text-[10px] font-bold tracking-wide whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all z-50">
              Admin
            </div>
          )}
        </button>

        {/* Toggle Collapse */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center p-2 rounded-lg border border-zinc-150 hover:bg-zinc-50 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
