"use client";

import { useState, useEffect } from "react";
import { Sparkles, Check, ChevronDown, ChevronUp, BookOpen, Code, Lightbulb } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  difficultyColor: string;
  description: string;
  tip: string;
  codeHint: string;
}

export default function LearningChallenges() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("analytics_challenges_completed");
    if (saved) {
      try {
        setCompleted(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleChallenge = (id: string) => {
    const updated = { ...completed, [id]: !completed[id] };
    setCompleted(updated);
    localStorage.setItem("analytics_challenges_completed", JSON.stringify(updated));
  };

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const challenges: Challenge[] = [
    {
      id: "date-filters",
      title: "Task 1: Dynamic Date Filters Integration",
      difficulty: "Easy",
      difficultyColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
      description: "Implement dates in the date filter dropdown in the dashboard header. Update components dynamically when the dates change.",
      tip: "Leverage standard date states in GoogleAnalyticsDashboard and feed them into useAnalytics.overview(projectId, { startDate, endDate }).",
      codeHint: `// In your parent component, define a state:
const [dateRange, setDateRange] = useState({ startDate: '2026-06-01', endDate: '2026-06-30' });

// Pass setDateRange into your header dropdown and use it to update.`,
    },
    {
      id: "realtime-websocket",
      title: "Task 2: Realtime Active User Stream",
      difficulty: "Medium",
      difficultyColor: "text-amber-600 bg-amber-50 border-amber-100",
      description: "Replace the mock active visitors count with actual live counts using interval polling or a WebSocket stream from the server.",
      tip: "Use react-query refetchInterval option or set up an SSE (Server-Sent Events) listener for real-time counts.",
      codeHint: `// Use react-query's built-in refetchInterval
const { data: realtimeData } = useQuery({
  queryKey: ["realtime", projectId],
  queryFn: () => getRealtime(projectId),
  refetchInterval: 3000 // Polls database every 3 seconds
});`,
    },
    {
      id: "live-logs-table",
      title: "Task 3: Live Visitor Logs Interactive Table",
      difficulty: "Medium",
      difficultyColor: "text-amber-600 bg-amber-50 border-amber-100",
      description: "Add a live telemetry stream card at the bottom. Allow users to filter the logs by event classification (like pageview vs click).",
      tip: "Add a filter tabs widget above the visitor logs table in the UI and use array.filter() to narrow down the table rows.",
      codeHint: `const [eventTypeFilter, setEventTypeFilter] = useState("all");

const filteredEvents = recentEvents.filter(evt => 
  eventTypeFilter === "all" || evt.eventType === eventTypeFilter
);`,
    },
    {
      id: "custom-events",
      title: "Task 4: Register Custom Click Events",
      difficulty: "Hard",
      difficultyColor: "text-rose-600 bg-rose-50 border-rose-100",
      description: "Inject custom event tracking in the client app. Add trackEvent('button_click', { buttonId: 'pay-btn' }) to record conversions.",
      tip: "Write a utility tracker script that dispatches POST requests to the telemetry endpoint on button click/form submission.",
      codeHint: `export const trackEvent = async (eventType: string, metadata: any) => {
  await axios.post('http://localhost:5000/api/events', {
    publicKey: YOUR_PUBLIC_KEY,
    eventType,
    path: window.location.pathname,
    metadata
  });
};`,
    },
  ];

  const totalCompleted = Object.values(completed).filter(Boolean).length;

  return (
    <div className="rounded-2xl border border-amber-250 bg-amber-50/20 p-6 shadow-sm space-y-4 select-none animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="h-8.5 w-8.5 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
              <span>Senior Developer Challenge Center</span>
            </h3>
            <p className="text-[10px] text-zinc-500 font-medium">
              Complete these tasks to connect your actual analytics API logic!
            </p>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold text-white tracking-wide shadow-sm self-start sm:self-center">
          Progress: {totalCompleted} / {challenges.length} Done
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-3">
        {challenges.map((challenge) => {
          const isCompleted = !!completed[challenge.id];
          const isExpanded = expanded === challenge.id;

          return (
            <div
              key={challenge.id}
              className={`rounded-xl border transition-all ${
                isCompleted 
                  ? "bg-zinc-50/50 border-zinc-200/80 opacity-80" 
                  : "bg-white border-zinc-200 shadow-sm hover:border-zinc-300"
              }`}
            >
              <div className="p-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  {/* Custom Checkbox */}
                  <button
                    onClick={() => toggleChallenge(challenge.id)}
                    className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                      isCompleted
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                        : "border-zinc-300 hover:border-zinc-500 bg-white"
                    }`}
                  >
                    {isCompleted && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        onClick={() => toggleExpand(challenge.id)}
                        className={`text-xs font-bold truncate cursor-pointer hover:text-amber-600 transition-colors ${
                          isCompleted ? "line-through text-zinc-400" : "text-zinc-800"
                        }`}
                      >
                        {challenge.title}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase ${challenge.difficultyColor}`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleExpand(challenge.id)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 cursor-pointer shrink-0"
                  title="Show code hints"
                >
                  {isExpanded ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
                </button>
              </div>

              {/* Collapsed Hints */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1.5 border-t border-zinc-100 bg-zinc-50/50 rounded-b-xl space-y-3.5 animate-in slide-in-from-top-1 duration-150">
                  <div className="flex items-start gap-2 text-xxs text-zinc-650 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                    <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-700">Implementation Tip:</span> {challenge.tip}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                      <Code className="h-3 w-3" /> Sample Code Template
                    </span>
                    <pre className="text-[10px] text-zinc-700 font-mono bg-zinc-900 text-white p-3 rounded-lg overflow-x-auto border border-zinc-950 shadow-inner">
                      {challenge.codeHint}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
