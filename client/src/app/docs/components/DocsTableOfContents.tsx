"use client";

import React, { useEffect, useState } from "react";
import { List } from "lucide-react";

type TabType = "intro" | "setup" | "api";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface DocsTableOfContentsProps {
  activeTab: TabType;
}

const HEADINGS_BY_TAB: Record<TabType, Heading[]> = {
  intro: [
    { id: "getting-started-with-eventlyticsx", text: "Getting Started", level: 1 },
    { id: "core-ingestion-pipeline", text: "Core Ingestion Pipeline", level: 2 },
    { id: "integration-paths", text: "Integration Paths", level: 2 },
    { id: "workspace-configuration", text: "Workspace Configuration", level: 2 },
  ],
  setup: [
    { id: "react--browser-sdk-integration", text: "React & Browser SDK", level: 1 },
    { id: "sdk-execution-lifecycle", text: "SDK Execution Lifecycle", level: 2 },
    { id: "1-installation", text: "1. Installation", level: 2 },
    { id: "2-configuration-setup", text: "2. Configuration Setup", level: 2 },
    { id: "3-bind-event-listeners", text: "3. Bind Event Listeners", level: 2 },
    { id: "4-element-auto-tracking", text: "4. Element Auto-Tracking", level: 2 },
    { id: "5-manual-event-dispatching", text: "5. Manual Event Dispatching", level: 2 },
  ],
  api: [
    { id: "http-ingestion-api-reference", text: "HTTP Ingestion API", level: 1 },
    { id: "endpoint-details", text: "Endpoint Details", level: 2 },
    { id: "curl-request-template", text: "cURL Request Template", level: 2 },
    { id: "payload-schema-fields", text: "Payload Schema Fields", level: 2 },
    { id: "gateway-response-statuses", text: "Gateway Response Statuses", level: 2 },
  ],
};

export function DocsTableOfContents({ activeTab }: DocsTableOfContentsProps) {
  const headings = HEADINGS_BY_TAB[activeTab] || [];
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length > 0) {
      setActiveId(headings[0].id);
    }
  }, [activeTab]);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block w-52 shrink-0 lg:sticky lg:top-24 h-fit border-l border-zinc-200/80 pl-4 py-1 select-none">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
        <List className="h-3.5 w-3.5" />
        <span>On This Page</span>
      </div>

      <nav className="flex flex-col gap-2">
        {headings.map((h) => (
          <button
            key={h.id}
            onClick={() => handleScrollTo(h.id)}
            className={`text-left text-2xs font-semibold hover:text-zinc-950 transition-colors leading-tight cursor-pointer ${
              h.level === 1 ? "pl-0" : "pl-3 text-zinc-500"
            } ${activeId === h.id ? "text-blue-600 font-bold" : "text-zinc-650"}`}
          >
            {h.text}
          </button>
        ))}
      </nav>
    </aside>
  );
}
