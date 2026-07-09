"use client";

import React, { useState } from "react";
import { Sparkles, Cpu, Terminal, ChevronRight, ExternalLink } from "lucide-react";

type TabType = "intro" | "setup" | "api";

interface DocsSidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function DocsSidebar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}: DocsSidebarProps) {
  // Collapsible sections
  const [guidesExpanded, setGuidesExpanded] = useState(true);

  return (
    <aside className="lg:w-64 shrink-0 flex flex-col gap-1 lg:sticky lg:top-24 h-fit bg-white p-3.5 rounded-2xl border border-zinc-200/80 shadow-sm select-none">
      {/* Search Input Bar (Fumadocs Style) */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search docs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-all shadow-2xs"
        />
        <div className="absolute right-2.5 top-2.5 hidden sm:flex items-center gap-0.5 pointer-events-none select-none text-[9px] font-bold text-zinc-400 bg-zinc-150 border border-zinc-250/60 rounded px-1 py-0.5 leading-none">
          <span>⌘</span>
          <span>K</span>
        </div>
      </div>

      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
        <span>Guides & References</span>
        <button
          onClick={() => setGuidesExpanded(!guidesExpanded)}
          className="hover:text-zinc-800 transition-colors cursor-pointer text-[8px]"
        >
          {guidesExpanded ? "Collapse" : "Expand"}
        </button>
      </div>

      {guidesExpanded && (
        <div className="flex flex-col gap-1 animate-in fade-in duration-150">
          <button
            onClick={() => setActiveTab("intro")}
            className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all select-none cursor-pointer ${
              activeTab === "intro"
                ? "bg-blue-50/80 text-blue-700 border-l-2 border-blue-500 pl-2"
                : "text-zinc-650 hover:bg-zinc-50 hover:text-zinc-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles
                className={`h-4 w-4 ${activeTab === "intro" ? "text-blue-600" : "text-zinc-450"}`}
              />
              1. Getting Started
            </span>
            <ChevronRight className="h-3 w-3 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("setup")}
            className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all select-none cursor-pointer ${
              activeTab === "setup"
                ? "bg-blue-50/80 text-blue-700 border-l-2 border-blue-500 pl-2"
                : "text-zinc-650 hover:bg-zinc-50 hover:text-zinc-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <Cpu
                className={`h-4 w-4 ${activeTab === "setup" ? "text-blue-600" : "text-zinc-450"}`}
              />
              2. React Browser SDK
            </span>
            <ChevronRight className="h-3 w-3 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("api")}
            className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all select-none cursor-pointer ${
              activeTab === "api"
                ? "bg-blue-50/80 text-blue-700 border-l-2 border-blue-500 pl-2"
                : "text-zinc-650 hover:bg-zinc-50 hover:text-zinc-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <Terminal
                className={`h-4 w-4 ${activeTab === "api" ? "text-blue-600" : "text-zinc-450"}`}
              />
              3. Ingestion API Spec
            </span>
            <ChevronRight className="h-3 w-3 opacity-60" />
          </button>
        </div>
      )}

      {/* External Repository links */}
      <div className="mt-4 pt-4 border-t border-zinc-100 px-3">
        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">Helpful Links</span>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-800 flex items-center gap-1.5 py-1"
        >
          SDK Repository <ExternalLink className="h-3 w-3" />
        </a>
        <a
          href="mailto:support@eventlyticsx.com"
          className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-800 flex items-center gap-1.5 py-1"
        >
          Developer Support
        </a>
      </div>
    </aside>
  );
}
