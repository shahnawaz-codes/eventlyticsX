"use client";

import {
  RefreshCw,
  ChevronDown,
  Activity,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useDashboardHeader } from "../hooks/useDashboardHeader";

interface DashboardHeaderProps {
  projectName: string;
  projectId: string;
  onRefresh?: () => void;
  refreshing?: boolean;
  dateRange: { label: string; startDate: string; endDate: string };
  setDateRange: (range: { label: string; startDate: string; endDate: string }) => void;
}

export default function DashboardHeader({
  projectName,
  projectId,
  onRefresh,
  refreshing = false,
  dateRange,
  setDateRange,
}: DashboardHeaderProps) {
  const {
    dropdownOpen,
    setDropdownOpen,
    dateDropdownOpen,
    setDateDropdownOpen,
    dateOptions,
    handleSelectDateOption,
    handleNavigateToDashboard,
  } = useDashboardHeader({ setDateRange });

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md select-none">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand + Property Selector */}
        <div className="flex items-center gap-4">
          {/* Logo Theme */}
          <div
            onClick={handleNavigateToDashboard}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 active:scale-95 transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-md shadow-blue-500/20">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-950">
              eventlytics<span className="text-blue-600">X</span>
            </span>
            <span className="ml-2 rounded bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-650 hidden sm:inline-block">
              Console
            </span>
          </div>

          {/* Divider */}
          <span className="text-zinc-300 text-sm">|</span>

          {/* Property Selector */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 text-xs text-zinc-650 font-medium hover:text-zinc-950 hover:bg-zinc-50 px-2.5 py-1.5 rounded-lg border border-zinc-200 transition-all cursor-pointer"
            >
              <span className="text-zinc-400 font-normal hidden sm:inline">All accounts &gt;</span>
              <span className="text-zinc-800 font-bold truncate max-w-[150px]">
                {projectName}
              </span>
              <ChevronDown
                className={`h-3 w-3 text-zinc-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-1.5 w-64 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg z-25 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-2 py-1.5 text-xxs font-bold text-zinc-400 uppercase tracking-wider">
                    Current Property
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-zinc-50 p-2 border border-zinc-150">
                    <div className="h-6.5 w-6.5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xxs animate-pulse">
                      {projectName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-zinc-900 truncate">
                        {projectName}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-mono truncate">
                        ID: {projectId}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 border-t border-zinc-100 pt-1.5">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleNavigateToDashboard();
                      }}
                      className="w-full text-left text-xs font-medium text-blue-600 hover:bg-blue-50 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      View All Projects
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-3">
          {/* Date Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-650 hover:text-zinc-950 border border-zinc-200 rounded-lg hover:bg-zinc-50 active:scale-95 transition-all select-none cursor-pointer"
            >
              <span>{dateRange.label}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-zinc-400 transition-transform ${dateDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dateDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDateDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-44 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg z-25 animate-in fade-in slide-in-from-top-1 duration-150">
                  {dateOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => {
                        handleSelectDateOption(opt);
                      }}
                      className={`w-full text-left text-xs px-2.5 py-2 rounded-lg transition-colors cursor-pointer ${
                        dateRange.label === opt.label
                          ? "bg-blue-50 text-blue-700 font-bold"
                          : "text-zinc-650 hover:bg-zinc-50 hover:text-zinc-900"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-zinc-650 hover:text-zinc-950 border border-zinc-200 rounded-lg hover:bg-zinc-50 active:scale-95 transition-all select-none cursor-pointer disabled:opacity-60"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-blue-600" : "text-zinc-400"}`}
              />
              <span className="hidden sm:inline">
                {refreshing ? "Refreshing..." : "Refresh"}
              </span>
            </button>
          )}

          {/* Clerk User Button Profile */}
          <div className="flex items-center ml-1">
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>
      </div>
    </header>
  );
}
