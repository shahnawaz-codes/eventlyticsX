"use client";

import React from "react";
import { Globe, Cpu, Database, Info, Activity } from "lucide-react";

export function DataLifeCycleDiagram() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-5 flex flex-col items-center select-none overflow-x-auto my-6">
      <svg viewBox="0 0 680 140" className="w-full max-w-[620px] h-auto text-zinc-700 font-medium">
        <defs>
          <filter id="soft-shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" floodColor="#091e42" />
          </filter>
        </defs>

        {/* Node 1: Client Application */}
        <rect x="10" y="25" width="130" height="70" rx="8" fill="#ffffff" stroke="#e4e4e7" strokeWidth="1.5" filter="url(#soft-shadow)" />
        <text x="75" y="55" textAnchor="middle" fill="#090d16" fontSize="11" fontWeight="bold">Client Application</text>
        <text x="75" y="70" textAnchor="middle" fill="#2563eb" fontSize="9" fontWeight="semibold">eventlytics-browser</text>
        <text x="75" y="82" textAnchor="middle" fill="#71717a" fontSize="8">analytics.track()</text>

        {/* Connection 1 */}
        <path d="M 140 60 L 250 60" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
        <polygon points="252,60 244,56 246,60 244,64" fill="#64748b" />
        <text x="195" y="50" textAnchor="middle" fill="#4b5563" fontSize="8" fontWeight="semibold">HTTPS POST</text>

        {/* Node 2: API Gateway */}
        <rect x="260" y="25" width="130" height="70" rx="8" fill="#ffffff" stroke="#e4e4e7" strokeWidth="1.5" filter="url(#soft-shadow)" />
        <text x="325" y="55" textAnchor="middle" fill="#090d16" fontSize="11" fontWeight="bold">Ingestion Gateway</text>
        <text x="325" y="70" textAnchor="middle" fill="#4f46e5" fontSize="9" fontWeight="semibold">Express Router</text>
        <text x="325" y="82" textAnchor="middle" fill="#10b981" fontSize="8" fontWeight="bold">POST /api/track</text>

        {/* Connection 2 */}
        <path d="M 390 60 L 500 60" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
        <polygon points="502,60 494,56 496,60 494,64" fill="#64748b" />
        <text x="445" y="50" textAnchor="middle" fill="#4b5563" fontSize="8" fontWeight="semibold">Batch Save</text>

        {/* Node 3: Database */}
        <rect x="510" y="25" width="130" height="70" rx="8" fill="#ffffff" stroke="#e4e4e7" strokeWidth="1.5" filter="url(#soft-shadow)" />
        <text x="575" y="55" textAnchor="middle" fill="#090d16" fontSize="11" fontWeight="bold">Analytics Store</text>
        <text x="575" y="70" textAnchor="middle" fill="#7c3aed" fontSize="9" fontWeight="semibold">Prisma / Database</text>
        <text x="575" y="82" textAnchor="middle" fill="#71717a" fontSize="8">Aggregated Views</text>
      </svg>
    </div>
  );
}

export function SdkInitLifecycleDiagram() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-5 flex flex-col items-center select-none overflow-x-auto my-6">
      <svg viewBox="0 0 680 120" className="w-full max-w-[620px] h-auto text-zinc-700 font-medium">
        <defs>
          <filter id="box-shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.06" floodColor="#091e42" />
          </filter>
        </defs>

        {/* Step 1 */}
        <rect x="5" y="25" width="135" height="60" rx="8" fill="#ffffff" stroke="#e4e4e7" strokeWidth="1.5" filter="url(#box-shadow)" />
        <text x="72.5" y="48" textAnchor="middle" fill="#090d16" fontSize="10" fontWeight="bold">1. Configure</text>
        <text x="72.5" y="65" textAnchor="middle" fill="#4f46e5" fontSize="8" fontFamily="monospace">new AnalyticsConfig</text>

        {/* Arrow 1 */}
        <path d="M 140 55 L 180 55" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
        <polygon points="182,55 174,51 176,55 174,59" fill="#94a3b8" />

        {/* Step 2 */}
        <rect x="185" y="25" width="135" height="60" rx="8" fill="#ffffff" stroke="#e4e4e7" strokeWidth="1.5" filter="url(#box-shadow)" />
        <text x="252.5" y="48" textAnchor="middle" fill="#090d16" fontSize="10" fontWeight="bold">2. Construct Instance</text>
        <text x="252.5" y="65" textAnchor="middle" fill="#52525b" fontSize="8">Generates unique SessionId</text>

        {/* Arrow 2 */}
        <path d="M 320 55 L 360 55" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
        <polygon points="362,55 354,51 356,55 354,59" fill="#94a3b8" />

        {/* Step 3 */}
        <rect x="365" y="25" width="135" height="60" rx="8" fill="#ffffff" stroke="#e4e4e7" strokeWidth="1.5" filter="url(#box-shadow)" />
        <text x="432.5" y="48" textAnchor="middle" fill="#090d16" fontSize="10" fontWeight="bold">3. Call .init()</text>
        <text x="432.5" y="65" textAnchor="middle" fill="#2563eb" fontSize="8" fontWeight="bold">Registers Event Listeners</text>

        {/* Arrow 3 */}
        <path d="M 500 55 L 540 55" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
        <polygon points="542,55 534,51 536,55 534,59" fill="#94a3b8" />

        {/* Step 4 */}
        <rect x="545" y="15" width="130" height="80" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <text x="610" y="34" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="extrabold">Active Auto-Listeners</text>
        <text x="610" y="48" textAnchor="middle" fill="#475569" fontSize="8">• pageView</text>
        <text x="610" y="60" textAnchor="middle" fill="#475569" fontSize="8">• trackPageClick</text>
        <text x="610" y="72" textAnchor="middle" fill="#475569" fontSize="8">• pageExit</text>
      </svg>
    </div>
  );
}

export function ClickInterceptorDiagram() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-5 flex flex-col items-center select-none overflow-x-auto my-6">
      <svg viewBox="0 0 680 140" className="w-full max-w-[620px] h-auto text-zinc-700 font-medium">
        <defs>
          <filter id="element-shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.06" floodColor="#091e42" />
          </filter>
        </defs>

        {/* Step 1: Click Trigger */}
        <rect x="10" y="35" width="125" height="50" rx="8" fill="#ffffff" stroke="#e4e4e7" strokeWidth="1.5" filter="url(#element-shadow)" />
        <text x="72.5" y="64" textAnchor="middle" fill="#090d16" fontSize="10" fontWeight="bold">User Clicks DOM Node</text>

        {/* Arrow 1 */}
        <path d="M 135 60 L 195 60" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
        <polygon points="197,60 189,56 191,60 189,64" fill="#94a3b8" />

        {/* Step 2: Decision Diamond */}
        <polygon points="260,20 320,60 260,100 200,60" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <text x="260" y="55" textAnchor="middle" fill="#0f172a" fontSize="8" fontWeight="extrabold">Has attribute</text>
        <text x="260" y="68" textAnchor="middle" fill="#2563eb" fontSize="8" fontWeight="bold">data-track?</text>

        {/* Arrow Decision: YES */}
        <path d="M 320 60 L 400 60" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
        <polygon points="402,60 394,56 396,60 394,64" fill="#94a3b8" />
        <text x="360" y="50" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold">YES</text>

        {/* Arrow Decision: NO */}
        <path d="M 260 100 L 260 120 L 515 120 L 515 85" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
        <polygon points="515,83 511,91 515,89 519,91" fill="#94a3b8" />
        <text x="280" y="112" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="bold">NO</text>

        {/* Step 3: Record Click */}
        <rect x="405" y="35" width="130" height="50" rx="8" fill="#ffffff" stroke="#e4e4e7" strokeWidth="1.5" filter="url(#element-shadow)" />
        <text x="470" y="58" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">SDK dispatches Event</text>
        <text x="470" y="70" textAnchor="middle" fill="#71717a" fontSize="8">eventName = click-tag-value</text>

        {/* Arrow 3 */}
        <path d="M 535 60 L 585 60" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
        <polygon points="587,60 579,56 581,60 579,64" fill="#94a3b8" />

        {/* Step 4: End */}
        <circle cx="610" cy="60" r="20" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <text x="610" y="63" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="bold">Exit</text>
      </svg>
    </div>
  );
}
