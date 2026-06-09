"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient, getJWTToken } from "@/lib/auth/client";
import {
  Activity,
  ArrowLeft,
  Key,
  Copy,
  Check,
  Code,
  Terminal,
  RefreshCw,
  Globe,
  Monitor,
  Eye,
  Users,
  Compass,
  ArrowUpRight,
  Sparkles,
  Link2,
  Settings
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  public_key: string;
  userId: string;
}

interface EventItem {
  id: string;
  eventType: string;
  path: string;
  referrer: string;
  sessionId: string;
  createdAt: string;
}

interface AnalyticsData {
  totalEvents: number;
  totalPageviews: number;
  uniqueVisitors: number;
  recentEvents: EventItem[];
  topPages: { path: string; views: number }[];
  topReferrers: { referrer: string; referrals: number }[];
}

export default function ProjectDetailsPage() {
  const session = authClient.useSession();
  const user = session.data?.user;
  const isPending = session.isPending;
  const router = useRouter();
  const params = useParams();
  const projectId = params?.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // SDK Docs state
  const [activeTab, setActiveTab] = useState<"html" | "react" | "next">("html");
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !user) {
      router.push("/auth/sign-in");
    }
  }, [isPending, user, router]);

  // Load project details and analytics
  useEffect(() => {
    if (user && projectId) {
      loadProjectData();
    }
  }, [user, projectId]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchProjectDetailsAndAnalytics();
    } catch (err: any) {
      console.error("Error loading project details:", err);
      setError(err.message || "An error occurred while loading project details.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchProjectDetailsAndAnalytics();
    } catch (err: any) {
      console.error("Error refreshing analytics:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchProjectDetailsAndAnalytics = async () => {
    const token = await getJWTToken();
    if (!token) {
      throw new Error("Failed to retrieve authentication token");
    }

    // 1. Fetch details
    const detailRes = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!detailRes.ok) {
      if (detailRes.status === 404) {
        throw new Error("Project not found or you do not have permission to access it.");
      }
      throw new Error("Failed to fetch project details.");
    }

    const detailData = await detailRes.json();
    setProject(detailData.project);

    // 2. Fetch analytics
    const analyticsRes = await fetch(`${API_BASE_URL}/api/projects/${projectId}/analytics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (analyticsRes.ok) {
      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData.analytics);
    }
  };

  const handleCopyKey = () => {
    if (!project) return;
    navigator.clipboard.writeText(project.public_key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Generate trend line points
  const getTrendDataPoints = () => {
    if (!analytics || !analytics.recentEvents || analytics.recentEvents.length === 0) {
      return [0, 0, 0, 0, 0, 0, 0];
    }
    
    // Group events by day in the last 7 days
    const counts = [0, 0, 0, 0, 0, 0, 0];
    const now = new Date();
    
    analytics.recentEvents.forEach((evt) => {
      const date = new Date(evt.createdAt);
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 7) {
        counts[6 - diffDays]++;
      }
    });

    // If all counts are zero, generate small variations just to show a live empty timeline
    if (counts.every(c => c === 0)) {
      return [0, 0, 0, 0, 0, 0, 0];
    }
    
    return counts;
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-3">
          <Activity className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-medium text-zinc-500">Loading project data...</span>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-zinc-200 p-8 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-red-50 text-red-650 flex items-center justify-center mx-auto">
            <Settings className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900">Unable to load project</h3>
          <p className="text-xs text-zinc-500 leading-normal">{error || "Project data is unavailable."}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  // SDK Code strings
  const trackingEndpoint = `${API_BASE_URL}/api/track`;
  const trackingScriptUrl = `${API_BASE_URL}/analytics.js`;

  const htmlCode = `<!-- 1. Include standard tracking script -->
<script src="${trackingScriptUrl}"></script>

<!-- 2. Initialize using your public key -->
<script>
  Analytics.init("${trackingEndpoint}", "${project.public_key}");
</script>`;

  const reactCode = `import { useEffect } from "react";

export function useAnalytics() {
  useEffect(() => {
    // Dynamically inject script
    const script = document.createElement("script");
    script.src = "${trackingScriptUrl}";
    script.async = true;
    script.onload = () => {
      if (window.Analytics) {
        window.Analytics.init(
          "${trackingEndpoint}", 
          "${project.public_key}"
        );
      }
    };
    document.head.appendChild(script);
  }, []);
}`;

  const nextCode = `// Add this layout snippet to your Next.js root layout (app/layout.tsx)
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="${trackingScriptUrl}"
          strategy="afterInteractive"
          onLoad={() => {
            if (window.Analytics) {
              window.Analytics.init(
                "${trackingEndpoint}",
                "${project.public_key}"
              );
            }
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}`;

  const currentCode = activeTab === "html" ? htmlCode : activeTab === "react" ? reactCode : nextCode;

  // Aggregate metrics
  const hasEvents = analytics && analytics.totalEvents > 0;
  const chartPoints = getTrendDataPoints();
  const maxVal = Math.max(...chartPoints, 5); // default base to avoid division by 0
  const chartHeight = 120;
  const chartWidth = 500;
  const svgPath = chartPoints
    .map((val, idx) => {
      const x = (idx / (chartPoints.length - 1)) * chartWidth;
      const y = chartHeight - (val / maxVal) * (chartHeight - 20) - 10;
      return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const svgAreaPath = `${svgPath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  // Test curl command for empty state
  const testCurlCommand = `curl -X POST "${trackingEndpoint}" \\
  -H "Content-Type: application/json" \\
  -d '{"event": "page-view", "projectKey": "${project.public_key}", "path": "/test-landing", "referrer": "Google", "sessionId": "sess_test_123"}'`;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/50">
      {/* Detail Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-150 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-400">Projects</span>
              <span className="text-zinc-300 text-sm">/</span>
              <span className="text-sm font-bold text-zinc-800">{project.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-150 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-650 hover:text-zinc-950 transition-all select-none cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-blue-600" : ""}`} />
              <span>{refreshing ? "Refreshing..." : "Refresh Data"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col gap-8">
        
        {/* Project Title and Public Key Banner */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">{project.name}</h1>
            <p className="text-xs text-zinc-400">Project UUID: {project.id}</p>
          </div>

          <div className="flex flex-col gap-2 self-start md:self-auto min-w-[280px]">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Project Public Key</span>
            <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-2.5">
              <code className="text-xs text-zinc-850 font-mono select-all truncate max-w-[200px]">{project.public_key}</code>
              <button
                onClick={handleCopyKey}
                className="ml-3 p-1.5 text-zinc-450 hover:text-zinc-900 rounded-lg hover:bg-zinc-150 transition-colors select-none cursor-pointer"
                title="Copy Key"
              >
                {copiedKey ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Integration SDK Docs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-600" />
                  SDK Integration Guide
                </h2>
                <p className="text-xs text-zinc-500">
                  Follow these instructions to connect your application and start recording page view and click events.
                </p>
              </div>

              {/* Tab headers */}
              <div className="flex border-b border-zinc-100">
                {(["html", "react", "next"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`border-b-2 px-4 py-2 text-xs font-bold transition-all capitalize select-none cursor-pointer ${
                      activeTab === tab
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-zinc-400 hover:text-zinc-650"
                    }`}
                  >
                    {tab === "html" ? "HTML Script" : tab === "react" ? "React SDK" : "Next.js"}
                  </button>
                ))}
              </div>

              {/* Code window */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-950 shadow-md overflow-hidden font-mono text-xs">
                <div className="flex items-center justify-between bg-zinc-900 px-4 py-2.5 border-b border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                    {activeTab === "html" ? "index.html" : activeTab === "react" ? "useAnalytics.ts" : "layout.tsx"}
                  </span>
                  <button
                    onClick={() => handleCopyCode(currentCode)}
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer select-none"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-emerald-500 font-bold text-[10px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span className="text-[10px]">Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-5 overflow-x-auto text-zinc-300">
                  <pre className="whitespace-pre">{currentCode}</pre>
                </div>
              </div>
            </div>

            {/* Test Curl Instructions */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-zinc-400" />
                  Test with terminal
                </h3>
                <p className="text-xs text-zinc-500">
                  Execute this curl command in your terminal to instantly trigger a test pageview event:
                </p>
              </div>

              <div className="rounded-xl border border-zinc-150 bg-zinc-50 p-4 font-mono text-[11px] relative group overflow-x-auto">
                <pre className="text-zinc-750 pr-8">{testCurlCommand}</pre>
                <button
                  onClick={() => handleCopyCode(testCurlCommand)}
                  className="absolute right-3 top-3.5 p-1 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200 rounded transition-colors select-none cursor-pointer"
                  title="Copy command"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Real aggregates or Empty State placeholder (5 cols) */}
          <div className="lg:col-span-5">
            {!hasEvents ? (
              // Empty State - Onboarding Placeholder
              <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-white p-8 text-center flex flex-col items-center justify-center gap-4 min-h-[380px]">
                <div className="relative flex h-10 w-10">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-10 w-10 bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <Activity className="h-5 w-5" />
                  </span>
                </div>
                <div className="max-w-sm space-y-1.5">
                  <h3 className="font-bold text-zinc-900">Awaiting Your First Event</h3>
                  <p className="text-xs text-zinc-500 leading-normal">
                    No analytics traffic has been tracked yet. Integrate the script into your code or run the curl command to trigger event stream records.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 border border-zinc-200/60 px-3 py-1 text-[10px] font-bold text-zinc-450 uppercase tracking-wider animate-pulse mt-2">
                  <span>Listening for events...</span>
                </div>
              </div>
            ) : (
              // Full Dashboard Statistics
              <div className="space-y-6">
                {/* Metric Overviews Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                    <span className="text-xxs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-zinc-400" />
                      Page Views
                    </span>
                    <div className="mt-1.5 text-2xl font-extrabold tracking-tight text-zinc-950">
                      {analytics?.totalPageviews}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                    <span className="text-xxs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-zinc-400" />
                      Unique Visitors
                    </span>
                    <div className="mt-1.5 text-2xl font-extrabold tracking-tight text-zinc-950">
                      {analytics?.uniqueVisitors}
                    </div>
                  </div>
                </div>

                {/* SVG Mini Trend Chart */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xxs font-bold text-zinc-400 uppercase tracking-wider">
                    <span>Traffic Volume</span>
                    <span className="text-blue-600">7-Day Trend</span>
                  </div>
                  
                  <div className="relative h-28 w-full">
                    <svg
                      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                      className="w-full h-full overflow-visible"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="detailGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Area Fill */}
                      <path d={svgAreaPath} fill="url(#detailGradient)" />

                      {/* Line */}
                      <path
                        d={svgPath}
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Top Visited Pages */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-zinc-400" />
                    Top Visited Pages
                  </h3>
                  
                  <div className="space-y-3 pt-1">
                    {analytics?.topPages.map((page) => (
                      <div key={page.path} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-zinc-650 truncate max-w-[200px]">{page.path}</span>
                          <span className="font-bold text-zinc-950">{page.views}</span>
                        </div>
                        <div className="h-1 w-full rounded-full bg-zinc-100 overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{
                              width: `${(page.views / (analytics.totalPageviews || 1)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Referrers */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                    <Compass className="h-4 w-4 text-zinc-400" />
                    Top Referrers
                  </h3>
                  
                  <div className="space-y-3 pt-1">
                    {analytics?.topReferrers.map((ref) => (
                      <div key={ref.referrer} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-650 truncate max-w-[200px]">{ref.referrer}</span>
                          <span className="font-bold text-zinc-950">{ref.referrals}</span>
                        </div>
                        <div className="h-1 w-full rounded-full bg-zinc-100 overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{
                              width: `${(ref.referrals / (analytics.totalEvents || 1)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Event Log */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3.5">
                  <h3 className="text-xs font-bold text-zinc-950 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Live Visitor Log
                  </h3>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {analytics?.recentEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="rounded-xl border border-zinc-100 bg-zinc-50/40 p-2.5 text-xxs flex items-center justify-between gap-4"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-blue-600 font-bold uppercase tracking-wider text-[9px]">
                              {evt.eventType}
                            </span>
                            <span className="font-mono text-zinc-800 truncate block max-w-[150px]">{evt.path}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-zinc-450">
                            <span>{evt.referrer || "Direct"}</span>
                            <span>•</span>
                            <span className="truncate block max-w-[100px]">{evt.sessionId}</span>
                          </div>
                        </div>
                        <span className="text-zinc-400 shrink-0 font-medium font-mono text-[9px]">
                          {new Date(evt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
