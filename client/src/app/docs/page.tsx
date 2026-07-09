"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjects, createProject } from "@/modules/project/project.service";
import {
  Activity,
  ArrowLeft,
  Code,
  Terminal,
  Copy,
  Check,
  Plus,
  BookOpen,
  Sparkles,
  Key,
  FolderPlus,
  X,
  Layers,
  ChevronRight,
  Globe,
  Database,
  Cpu,
} from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  public_key: string;
  userId: string;
}

type TabType = "intro" | "html" | "react" | "nextjs" | "api";

function DocsContent() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load projects if signed in
  const { data: projects = [], isLoading: loadingProjects } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
    enabled: isLoaded && isSignedIn,
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (newProj) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      if (newProj && newProj.id) {
        setSelectedProjectId(newProj.id);
        toast.success(`Project "${newProj.name || "New Project"}" created successfully!`);
      }
      setShowModal(false);
      setNewProjectName("");
    },
    onError: (err: any) => {
      setModalError(err.message || "Failed to create project");
      toast.error(err.message || "Failed to create project");
    },
  });

  // Selected project ID state
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  // Active documentation tab
  const [activeTab, setActiveTab] = useState<TabType>("intro");

  // Copy states for snippets
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // New project modal state
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  // Pre-select project from query parameter or default to first project
  useEffect(() => {
    if (projects && projects.length > 0) {
      const projectQuery = searchParams.get("project");
      const match = projects.find((p) => p.id === projectQuery);

      if (match) {
        setSelectedProjectId(match.id);
      } else if (!selectedProjectId || !projects.some((p) => p.id === selectedProjectId)) {
        setSelectedProjectId(projects[0].id);
      }
    }
  }, [projects, searchParams, selectedProjectId]);

  // Synchronize active tab with URL query parameter
  useEffect(() => {
    const tabQuery = searchParams.get("tab") as TabType;
    if (tabQuery && ["intro", "html", "react", "nextjs", "api"].includes(tabQuery)) {
      setActiveTab(tabQuery);
    }
  }, [searchParams]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectNameToCreate = newProjectName.trim();
    if (!projectNameToCreate) return;
    setModalError(null);
    createProjectMutation.mutate(projectNameToCreate);
  };

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    toast.success("Snippet copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Selected project details
  const currentProject = projects?.find((p) => p.id === selectedProjectId);
  const activeKey = currentProject
    ? currentProject.public_key
    : "evX_your-project-key-here";

  // SDK Code Snippets
  const trackingEndpoint = `${API_BASE_URL}/api/track`;
  const trackingScriptUrl = `${API_BASE_URL}/analytics.js`;

  const htmlCode = `<!-- 1. Include standard tracking script -->
<script src="${trackingScriptUrl}"></script>

<!-- 2. Initialize using your public key -->
<script>
  Analytics.init("${trackingEndpoint}", "${activeKey}");
</script>`;

  const reactInitCode = `import { Analytics } from "eventlytics-browser";

// Instantiate the SDK as a singleton client
export const analytics = new Analytics(
  "${trackingEndpoint}", // Tracking backend URL
  "${activeKey}"         // Your Public Project Key
);`;

  const reactEntryCode = `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { analytics } from "./analytics";

// Start automatic page view, exit duration, and element tracking on app load
analytics.init();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

  const reactCustomTrackCode = `import { analytics } from "../analytics";

export function PurchaseButton() {
  const handlePurchase = () => {
    // 1. Dispatch custom event manually
    analytics.track("purchase-completed", {
      item: "Premium Plan Subscription",
      value: 49.00,
      currency: "USD"
    });
  };

  return (
    <button onClick={handlePurchase}>
      Upgrade Plan
    </button>
  );
}

// 2. Or, use auto-tracking by simply adding the data-track attribute:
// <button data-track="upgrade-button-hero">Upgrade Plan</button>`;

  const nextCode = `// Add this snippet to your Next.js root layout (app/layout.tsx)
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="${trackingScriptUrl}"
          strategy="afterInteractive"
          onLoad={() => {
            if (window.Analytics) {
              window.Analytics.init(
                "${trackingEndpoint}",
                "${activeKey}"
              );
            }
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}`;

  const apiCurlCode = `curl -X POST "${trackingEndpoint}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "event": "page-view",
    "projectKey": "${activeKey}",
    "path": "/landing-page",
    "referrer": "https://google.com",
    "sessionId": "sess_dev_12345",
    "pageTitle": "Landing Page",
    "browser": "Chrome",
    "deviceType": "desktop"
  }'`;

  return (
    <div className="flex min-h-screen flex-col bg-[#0b1326] text-slate-100 font-sans antialiased selection:bg-blue-600/30 selection:text-white">
      {/* Dynamic Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d10_1px,transparent_1px),linear-gradient(to_bottom,#1f293d10_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl opacity-60" />
      <div className="absolute bottom-10 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl opacity-50" />

      {/* Docs Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b1326]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(isSignedIn ? "/dashboard" : "/")}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all select-none cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-500 select-none">
                eventlyticsX
              </span>
              <span className="text-slate-700 text-sm">/</span>
              <span className="text-sm font-bold text-blue-400 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-blue-400" /> Docs
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Project Selection Dropdown */}
            {isLoaded && isSignedIn && (
              <>
                {projects.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 hidden md:inline">
                      Active Key:
                    </span>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1.5 text-xs font-semibold text-slate-300 outline-none focus:border-blue-500 transition-all cursor-pointer"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id} className="bg-slate-950 text-slate-300">
                          {p.name} ({p.public_key.slice(0, 8)}...)
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="rounded-lg bg-slate-900/50 border border-slate-800/80 px-2.5 py-1 text-2xs font-bold text-slate-500 uppercase tracking-wider">
                    No active projects
                  </div>
                )}

                {/* Create project CTA inside docs */}
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold transition-all select-none cursor-pointer shadow-md shadow-blue-500/20"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">New Key</span>
                </button>
              </>
            )}

            {/* Authentication Buttons if not signed in */}
            {isLoaded && !isSignedIn && (
              <div className="flex items-center gap-3">
                <SignInButton mode="modal">
                  <button className="text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer select-none">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer select-none">
                    Get Free Key
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Grid Container */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col lg:flex-row gap-8 relative">
        {/* SIDEBAR NAVIGATION */}
        <aside className="lg:w-64 shrink-0 flex flex-col gap-1 lg:sticky lg:top-24 h-fit bg-slate-950/30 p-3 rounded-2xl border border-slate-800/40 backdrop-blur-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Guides & Integration
          </div>

          <button
            onClick={() => setActiveTab("intro")}
            className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all select-none cursor-pointer ${
              activeTab === "intro"
                ? "bg-blue-900/20 text-blue-400 border-l-2 border-blue-500 pl-2"
                : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-100"
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles
                className={`h-4 w-4 ${activeTab === "intro" ? "text-blue-400" : "text-slate-500"}`}
              />
              Getting Started
            </span>
            <ChevronRight className="h-3 w-3 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("html")}
            className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all select-none cursor-pointer ${
              activeTab === "html"
                ? "bg-blue-900/20 text-blue-400 border-l-2 border-blue-500 pl-2"
                : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-100"
            }`}
          >
            <span className="flex items-center gap-2">
              <Code
                className={`h-4 w-4 ${activeTab === "html" ? "text-blue-400" : "text-slate-500"}`}
              />
              HTML Script Tag
            </span>
            <ChevronRight className="h-3 w-3 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("react")}
            className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all select-none cursor-pointer ${
              activeTab === "react"
                ? "bg-blue-900/20 text-blue-400 border-l-2 border-blue-500 pl-2"
                : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-100"
            }`}
          >
            <span className="flex items-center gap-2">
              <Cpu
                className={`h-4 w-4 ${activeTab === "react" ? "text-blue-400" : "text-slate-500"}`}
              />
              React Browser SDK
            </span>
            <ChevronRight className="h-3 w-3 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("nextjs")}
            className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all select-none cursor-pointer ${
              activeTab === "nextjs"
                ? "bg-blue-900/20 text-blue-400 border-l-2 border-blue-500 pl-2"
                : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-100"
            }`}
          >
            <span className="flex items-center gap-2">
              <Layers
                className={`h-4 w-4 ${activeTab === "nextjs" ? "text-blue-400" : "text-slate-500"}`}
              />
              Next.js Layout
            </span>
            <ChevronRight className="h-3 w-3 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("api")}
            className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all select-none cursor-pointer ${
              activeTab === "api"
                ? "bg-blue-900/20 text-blue-400 border-l-2 border-blue-500 pl-2"
                : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-100"
            }`}
          >
            <span className="flex items-center gap-2">
              <Terminal
                className={`h-4 w-4 ${activeTab === "api" ? "text-blue-400" : "text-slate-500"}`}
              />
              API & cURL Reference
            </span>
            <ChevronRight className="h-3 w-3 opacity-60" />
          </button>
        </aside>

        {/* DOCUMENTATION VIEW */}
        <main className="flex-1 bg-[#10192e]/40 rounded-2xl border border-slate-800/40 p-6 sm:p-8 shadow-2xl backdrop-blur-sm min-h-[550px]">
          {/* 1. Introduction Tab */}
          {activeTab === "intro" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2.5 border-b border-slate-800 pb-5">
                <div className="inline-flex items-center gap-1.5 bg-blue-900/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Documentation
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Getting Started with eventlyticsX
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Welcome to eventlyticsX—the privacy-first, lightweight, real-time analytics provider for developers. 
                  Our tracker uses a single script less than 1KB, operates on an event-driven flow, and ensures compliance 
                  (GDPR, CCPA) out of the box without cookies or intrusive visitor tracking.
                </p>
              </div>

              {/* Interactive SVG Architecture flow */}
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-6 relative overflow-hidden">
                <div className="absolute top-2 right-3 text-[9px] font-mono text-slate-600 font-bold uppercase tracking-wider select-none">
                  Data Stream Workflow
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4 max-w-lg mx-auto relative">
                  {/* Connector Lines (Dashed glowing path) */}
                  <div className="hidden sm:block absolute top-[28px] left-[50px] right-[50px] h-[2px] bg-slate-800 -z-10 overflow-hidden">
                    <div className="h-full w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-shimmer" />
                  </div>

                  {/* Node 1 */}
                  <div className="flex flex-col items-center gap-2 bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-lg w-28 text-center">
                    <Globe className="h-6 w-6 text-blue-400" />
                    <span className="text-[10px] font-bold text-white leading-none">Client Site</span>
                    <span className="text-[8px] text-slate-500 leading-none">SDK / Script</span>
                  </div>

                  {/* Node 2 */}
                  <div className="flex flex-col items-center gap-2 bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-lg w-28 text-center relative">
                    <div className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                    <Cpu className="h-6 w-6 text-indigo-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-white leading-none">Event Gateway</span>
                    <span className="text-[8px] text-emerald-400 font-mono leading-none">POST /track</span>
                  </div>

                  {/* Node 3 */}
                  <div className="flex flex-col items-center gap-2 bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-lg w-28 text-center">
                    <Database className="h-6 w-6 text-indigo-500" />
                    <span className="text-[10px] font-bold text-white leading-none">eventlyticsX</span>
                    <span className="text-[8px] text-slate-500 leading-none">Realtime DB</span>
                  </div>
                </div>
              </div>

              {/* Core features listing */}
              <div className="space-y-4">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Integration Paths Available
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-4 space-y-2 hover:border-slate-700 hover:bg-slate-900/40 transition-colors">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900/30 text-blue-400 border border-blue-800/40">
                      <Code className="h-4 w-4" />
                    </span>
                    <h3 className="text-xs font-bold text-white">Vanilla HTML Script Tag</h3>
                    <p className="text-xxs text-slate-400 leading-normal">
                      Embed a lightweight async script tag. Ideal for static templates, WordPress, or Webflow.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-4 space-y-2 hover:border-slate-700 hover:bg-slate-900/40 transition-colors">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-900/30 text-indigo-400 border border-indigo-800/40">
                      <Cpu className="h-4 w-4" />
                    </span>
                    <h3 className="text-xs font-bold text-white">NPM Browser SDK</h3>
                    <p className="text-xxs text-slate-400 leading-normal">
                      Full TypeScript bundle support via `eventlytics-browser`. Ideal for React, Angular, Vue, and SPA apps.
                    </p>
                  </div>
                </div>
              </div>

              {/* Personalization alert box */}
              <div className="rounded-xl bg-blue-950/20 border border-blue-900/30 p-4 flex gap-3 items-start">
                <Key className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">
                    Personalize Your Guides
                  </h4>
                  <p className="text-xxs text-slate-400 leading-normal">
                    {isSignedIn ? (
                      "Select your active project in the top-right header selector. Once selected, all code blocks across the documentation tabs will automatically insert your unique public key!"
                    ) : (
                      <>
                        Want code blocks pre-filled with your key?{" "}
                        <SignInButton mode="modal">
                          <span className="text-blue-400 hover:underline font-bold cursor-pointer">Sign in to your account</span>
                        </SignInButton>{" "}
                        to select your project's active workspace public key!
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Actionable CTA if signed in but no projects exist */}
              {isSignedIn && projects.length === 0 && (
                <div className="rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/20 p-6 text-center space-y-4 flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-900/30 text-blue-400 border border-blue-800/40 flex items-center justify-center">
                    <FolderPlus className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h3 className="text-xs font-bold text-white">Create a Tracking workspace</h3>
                    <p className="text-xxs text-slate-400 leading-normal">
                      You haven't created a project yet. Generate a workspace public key now to unlock interactive integrations.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold transition-all shadow-md select-none cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Generate Tracking Key
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2. HTML Script Tag Guide */}
          {activeTab === "html" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2.5 border-b border-slate-800 pb-5">
                <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  HTML Embed
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Integration with HTML / Vanilla JavaScript
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed">
                  For static websites, traditional multi-page servers (Express, Django, Rails), or CMS builders (WordPress, Webflow),
                  drop our CDN tracking script tag into the head of your templates.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Usage Snippet</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Project Key: <code className="text-slate-300">{activeKey.slice(0, 12)}...</code>
                  </span>
                </div>

                {/* Code Block */}
                <div className="rounded-xl border border-slate-800 bg-[#060e20] font-mono text-xs overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between bg-slate-950/80 px-4 py-2 border-b border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-sans">
                      index.html
                    </span>
                    <button
                      onClick={() => handleCopyCode(htmlCode, 1)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer select-none text-[10px]"
                    >
                      {copiedIndex === 1 ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Snippet</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-slate-300 whitespace-pre">
                    {htmlCode}
                  </pre>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Parameters Details
                </h3>
                <div className="space-y-2 text-xxs text-slate-400">
                  <div className="flex items-start gap-2 border-b border-slate-800 pb-2">
                    <span className="font-mono bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded font-bold">
                      endPoint
                    </span>
                    <span className="leading-relaxed">
                      The destination API tracker endpoint where tracking packages are POSTed.
                    </span>
                  </div>
                  <div className="flex items-start gap-2 border-b border-slate-800 pb-2">
                    <span className="font-mono bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded font-bold">
                      projectKey
                    </span>
                    <span className="leading-relaxed">
                      Your unique public key matching prefix <code className="font-mono text-blue-400">evX_</code>.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. React Browser SDK Tab */}
          {activeTab === "react" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2.5 border-b border-slate-800 pb-5">
                <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  NPM package
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  TypeScript & React Browser SDK Guide
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed">
                  For Single Page Applications (React, Vue, Vite, TypeScript), utilize our NPM package
                  <code className="text-indigo-400 font-mono bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded mx-1">eventlytics-browser</code> 
                  for full TypeScript support, type safety, and component lifecycle hook tracking.
                </p>
              </div>

              {/* Step 1: Install */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  1. Install Package
                </h3>
                <div className="rounded-xl border border-slate-800 bg-[#060e20] font-mono text-xs overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between bg-slate-950/80 px-4 py-2 border-b border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-sans">Terminal</span>
                    <button
                      onClick={() => handleCopyCode("npm install eventlytics-browser", 2)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer select-none text-[10px]"
                    >
                      {copiedIndex === 2 ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-slate-300">
                    npm install eventlytics-browser
                  </pre>
                </div>
              </div>

              {/* Step 2: Initialize Singleton */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  2. Instantiate Singleton Client (<code className="lowercase text-slate-400 font-mono font-normal">src/analytics.ts</code>)
                </h3>
                <div className="rounded-xl border border-slate-800 bg-[#060e20] font-mono text-xs overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between bg-slate-950/80 px-4 py-2 border-b border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-sans">analytics.ts</span>
                    <button
                      onClick={() => handleCopyCode(reactInitCode, 3)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer select-none text-[10px]"
                    >
                      {copiedIndex === 3 ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-slate-300 whitespace-pre">
                    {reactInitCode}
                  </pre>
                </div>
              </div>

              {/* Step 3: Entry point */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  3. Initialize on Load (<code className="lowercase text-slate-400 font-mono font-normal">src/main.tsx</code>)
                </h3>
                <div className="rounded-xl border border-slate-800 bg-[#060e20] font-mono text-xs overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between bg-slate-950/80 px-4 py-2 border-b border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-sans">main.tsx</span>
                    <button
                      onClick={() => handleCopyCode(reactEntryCode, 4)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer select-none text-[10px]"
                    >
                      {copiedIndex === 4 ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-slate-300 whitespace-pre">
                    {reactEntryCode}
                  </pre>
                </div>
              </div>

              {/* Step 4: Custom tracking & data-track */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  4. Track Custom Events & Elements (<code className="lowercase text-slate-400 font-mono font-normal">src/components/PurchaseButton.tsx</code>)
                </h3>
                <div className="rounded-xl border border-slate-800 bg-[#060e20] font-mono text-xs overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between bg-slate-950/80 px-4 py-2 border-b border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-sans">Usage</span>
                    <button
                      onClick={() => handleCopyCode(reactCustomTrackCode, 5)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer select-none text-[10px]"
                    >
                      {copiedIndex === 5 ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-slate-300 whitespace-pre">
                    {reactCustomTrackCode}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* 4. NextJS Integration */}
          {activeTab === "nextjs" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2.5 border-b border-slate-800 pb-5">
                <div className="inline-flex items-center gap-1.5 bg-slate-900 border border-slate-700/60 text-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Next.js App
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Integration with Next.js (App Router)
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Embed the lightweight tracking script utilizing Next.js native{" "}
                  <code className="font-mono bg-slate-900 border border-slate-800 text-slate-200 px-1 py-0.5 rounded">
                    next/script
                  </code>{" "}
                  utility for server-side optimization and async script hydration.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Layout Script Embed</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Project Key: <code className="text-slate-300">{activeKey.slice(0, 12)}...</code>
                  </span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#060e20] font-mono text-xs overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between bg-slate-950/80 px-4 py-2 border-b border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-sans">
                      app/layout.tsx
                    </span>
                    <button
                      onClick={() => handleCopyCode(nextCode, 6)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer select-none text-[10px]"
                    >
                      {copiedIndex === 6 ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-slate-300 whitespace-pre">
                    {nextCode}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* 5. API Reference & cURL */}
          {activeTab === "api" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2.5 border-b border-slate-800 pb-5">
                <div className="inline-flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Raw REST API
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  REST API & Ingestion Endpoint
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed">
                  For backend dispatching or custom tracking wrappers, call our REST endpoint directly 
                  from any server environment.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-900/60 border border-emerald-800 text-emerald-350 text-[10px] font-bold px-2 py-0.5 uppercase">
                      POST
                    </span>
                    <span>Endpoint URI</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    Project Key: <code className="text-slate-300">{activeKey.slice(0, 12)}...</code>
                  </span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#060e20] font-mono text-xs overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between bg-slate-950/80 px-4 py-2 border-b border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-sans">
                      cURL Command
                    </span>
                    <button
                      onClick={() => handleCopyCode(apiCurlCode, 7)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer select-none text-[10px]"
                    >
                      {copiedIndex === 7 ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy cURL</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-slate-300 whitespace-pre">
                    {apiCurlCode}
                  </pre>
                </div>
              </div>

              {/* Endpoint Payload Format Details */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Request Fields Schema
                </h3>
                <div className="space-y-2 text-xxs text-slate-400">
                  <div className="flex flex-col border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded font-bold">event</span>
                      <span className="text-rose-400 font-bold">required</span>
                      <span className="text-slate-550">string</span>
                    </div>
                    <span className="text-slate-400 mt-1">Name of the event. Common types: `page-view`, `page-exit`, `button-click`.</span>
                  </div>

                  <div className="flex flex-col border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded font-bold">projectKey</span>
                      <span className="text-rose-400 font-bold">required</span>
                      <span className="text-slate-550">string</span>
                    </div>
                    <span className="text-slate-400 mt-1">Your public API key associated with the property.</span>
                  </div>

                  <div className="flex flex-col border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded font-bold">sessionId</span>
                      <span className="text-amber-400 font-bold">optional</span>
                      <span className="text-slate-550">string</span>
                    </div>
                    <span className="text-slate-400 mt-1">UUID for tracking session duration & uniqueness.</span>
                  </div>
                </div>
              </div>

              {/* Ingestion Response Badges */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Ingestion HTTP Status Codes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xxs">
                  <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-lg space-y-1">
                    <span className="inline-block bg-blue-900/60 border border-blue-805 text-blue-300 font-bold px-1.5 py-0.5 rounded">
                      200 / 202
                    </span>
                    <h4 className="font-bold text-slate-200">Accepted / OK</h4>
                    <p className="text-slate-500 leading-tight">The event was successfully ingested and parsed.</p>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-lg space-y-1">
                    <span className="inline-block bg-yellow-900/60 border border-yellow-805 text-yellow-300 font-bold px-1.5 py-0.5 rounded">
                      401
                    </span>
                    <h4 className="font-bold text-slate-200">Unauthorized</h4>
                    <p className="text-slate-500 leading-tight">Invalid projectKey parameter provided.</p>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-lg space-y-1">
                    <span className="inline-block bg-rose-900/60 border border-rose-805 text-rose-300 font-bold px-1.5 py-0.5 rounded">
                      429
                    </span>
                    <h4 className="font-bold text-slate-200">Rate Limited</h4>
                    <p className="text-slate-500 leading-tight">Too many events sent from origin domain.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CREATE PROJECT DIALOG MODAL (State Driven) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            {/* Modal Close */}
            <button
              onClick={() => {
                setShowModal(false);
                setNewProjectName("");
                setModalError(null);
              }}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors select-none cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Modal Heading */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-400" />
                Generate Tracking Key
              </h3>
              <p className="text-xxs text-slate-400 leading-relaxed">
                Provide a name for your web application. We will generate a unique key configuration block to link your telemetry events.
              </p>
            </div>

            {/* Modal Error */}
            {modalError && (
              <div className="rounded-xl border border-red-500/20 bg-red-950/30 p-3 text-xxs text-red-400 leading-normal">
                {modalError}
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="docsProjectName"
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-wider"
                >
                  Project Workspace Name
                </label>
                <input
                  type="text"
                  id="docsProjectName"
                  required
                  placeholder="e.g. My NextJS Web App"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setNewProjectName("");
                    setModalError(null);
                  }}
                  className="rounded-xl border border-slate-800 hover:bg-slate-800/40 px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors select-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createProjectMutation.isPending || !newProjectName.trim()}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2.5 text-xs font-bold shadow-md shadow-blue-500/10 transition-all select-none cursor-pointer"
                >
                  {createProjectMutation.isPending ? (
                    <>
                      <Activity className="h-3.5 w-3.5 animate-spin mr-1.5" />
                      <span>Generating Key...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      <span>Generate Key</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DocsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0b1326] text-slate-100">
          <div className="flex flex-col items-center gap-3">
            <Activity className="h-8 w-8 animate-spin text-blue-500" />
            <span className="text-sm font-medium text-slate-500">
              Loading documentation...
            </span>
          </div>
        </div>
      }
    >
      <DocsContent />
    </Suspense>
  );
}
