"use client";

import { useState } from "react";
import { Search, HelpCircle, Grid, ArrowLeft, RefreshCw, ChevronDown, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  projectName: string;
  projectId: string;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function DashboardHeader({
  projectName,
  projectId,
  onRefresh,
  refreshing = false,
}: DashboardHeaderProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white px-4 py-2 flex items-center justify-between shadow-sm select-none">
      {/* Left: Brand + Property Selector */}
      <div className="flex items-center gap-4">
        {/* GA-Style Logo */}
        <div 
          onClick={() => router.push("/dashboard")} 
          className="flex items-center gap-1.5 cursor-pointer hover:opacity-90 active:scale-95 transition-all"
        >
          <div className="flex items-end gap-0.5 h-6">
            <span className="w-1 bg-[#F9AB00] rounded-t-sm h-3 animate-pulse"></span>
            <span className="w-1 bg-[#F29900] rounded-t-sm h-4.5"></span>
            <span className="w-1 bg-[#E8710A] rounded-t-sm h-6"></span>
          </div>
          <span className="font-sans font-semibold text-[16px] tracking-tight text-zinc-700">Analytics</span>
        </div>

        {/* Divider */}
        <span className="text-zinc-300 text-sm">|</span>

        {/* Property Selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 text-xs text-zinc-600 font-medium hover:text-zinc-900 hover:bg-zinc-50 px-2.5 py-1.5 rounded-lg border border-zinc-200 transition-all cursor-pointer"
          >
            <span className="text-zinc-400 font-normal">All accounts &gt;</span>
            <span className="text-zinc-800 font-bold truncate max-w-[150px]">{projectName}</span>
            <ChevronDown className={`h-3 w-3 text-zinc-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
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
                    <p className="text-xs font-bold text-zinc-900 truncate">{projectName}</p>
                    <p className="text-[10px] text-zinc-400 font-mono truncate">ID: {projectId}</p>
                  </div>
                </div>
                <div className="mt-2 border-t border-zinc-100 pt-1.5">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push("/dashboard");
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

      {/* Center: Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-xl mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-450" />
          <input
            type="text"
            placeholder="Try searching &quot;Explorations&quot;..."
            className="w-full rounded-full border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-1.5 text-xs text-zinc-700 outline-none transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-blue-400 focus:bg-white focus:shadow-sm"
          />
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-zinc-650 hover:text-zinc-950 border border-zinc-200 rounded-lg hover:bg-zinc-50 active:scale-95 transition-all select-none cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-blue-600" : "text-zinc-400"}`} />
            <span className="hidden sm:inline">{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        )}

        <button
          onClick={() => router.push("/dashboard")}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all select-none cursor-pointer"
          title="Back to Dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <button
          className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 transition-colors"
          title="Documentation"
        >
          <HelpCircle className="h-5 w-5" />
        </button>

        <button
          className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-55 transition-colors"
          title="Apps"
        >
          <Grid className="h-5 w-5" />
        </button>

        {/* User initials bubble (can connect to Clerk) */}
        <div className="h-7 w-7 rounded-full bg-orange-600 hover:opacity-90 text-white font-bold text-xs flex items-center justify-center shadow-inner cursor-pointer transition-opacity">
          S
        </div>
      </div>
    </header>
  );
}
