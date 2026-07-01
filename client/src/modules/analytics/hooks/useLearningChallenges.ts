import { useState, useEffect } from "react";

interface Challenge {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  difficultyColor: string;
  description: string;
  tip: string;
  codeHint: string;
}

export function useLearningChallenges() {
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

  return {
    completed,
    expanded,
    toggleChallenge,
    toggleExpand,
    challenges,
    totalCompleted,
  };
}
