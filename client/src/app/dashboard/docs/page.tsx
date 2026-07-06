"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
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
} from "lucide-react";
import { useProjects } from "@/modules/project/hooks/query";
import { useCreateProject } from "@/modules/project/hooks/mutation";
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
  const { data: projects, isLoading: loadingProjects } = useProjects();
  const { mutateAsync: createProject, isPending: creating } = useCreateProject();
  const { user } = useUser();
  const isPending = !isLoaded;
  const router = useRouter();
  const searchParams = useSearchParams();

  // Selected project ID state
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  // Active documentation tab
  const [activeTab, setActiveTab] = useState<TabType>("intro");

  // Copy state
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // New project creation state
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/auth/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Pre-select project from query string or default to first project
  useEffect(() => {
    if (projects && projects.length > 0) {
      const projectQuery = searchParams.get("project");
      const match = projects.find((p: Project) => p.id === projectQuery);
      
      if (match) {
        setSelectedProjectId(match.id);
      } else if (!selectedProjectId || !projects.some((p: Project) => p.id === selectedProjectId)) {
        setSelectedProjectId(projects[0].id);
      }
    }
  }, [projects, searchParams, selectedProjectId]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectNameToCreate = newProjectName.trim();
    if (!projectNameToCreate) return;

    try {
      setModalError(null);
      const newProj = await createProject(projectNameToCreate);

      if (newProj && newProj.id) {
        setSelectedProjectId(newProj.id);
        toast.success(`Project "${projectNameToCreate}" created successfully!`);
      }

      // Clean up modal
      setNewProjectName("");
      setShowModal(false);
    } catch (err: any) {
      console.error("Error creating project in docs:", err);
      setModalError(err.message || "An unexpected error occurred.");
      toast.error(err.message || "Failed to create project");
    }
  };

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    toast.success("Snippet copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (isPending || (isSignedIn && loadingProjects)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-3">
          <Activity className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-medium text-zinc-500">
            Loading documentation...
          </span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Selected project details
  const currentProject = projects?.find((p: Project) => p.id === selectedProjectId);
  const activeKey = currentProject
    ? currentProject.public_key
    : "<YOUR_PUBLIC_KEY>";

  // SDK Code Snippets
  const trackingEndpoint = `${API_BASE_URL}/api/track`;
  const trackingScriptUrl = `${API_BASE_URL}/analytics.js`;

  const htmlCode = `<!-- 1. Include standard tracking script -->
<script src="${trackingScriptUrl}"></script>

<!-- 2. Initialize using your public key -->
<script>
  Analytics.init("${trackingEndpoint}", "${activeKey}");
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
          "${activeKey}"
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
    "sessionId": "sess_dev_12345"
  }'`;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/50">
      {/* Docs Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 transition-all select-none cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-400">
                eventlyticsX
              </span>
              <span className="text-zinc-300 text-sm">/</span>
              <span className="text-sm font-bold text-zinc-800 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-blue-650" /> Documentation
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Project Selection Dropdown */}
            {projects && projects.length > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-400 hidden sm:inline">
                  Active Key:
                </span>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-700 outline-none focus:border-blue-500 transition-colors"
                >
                  {projects.map((p: Project) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.public_key.slice(0, 8)}...)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xxs font-bold text-zinc-405 uppercase tracking-wider">
                No active keys
              </div>
            )}

            {/* Create project CTA inside docs */}
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold transition-all select-none cursor-pointer shadow-sm shadow-blue-500/10"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Generate Public Key</span>
              <span className="md:hidden">New Key</span>
            </button>
          </div>
        </div>
      </header>

      {/* Grid Container */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR NAVIGATION (Gemini style) */}
        <aside className="lg:w-64 shrink-0 flex flex-col gap-1 lg:sticky lg:top-24 h-fit">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-3 mb-2">
            Guides & SDKs
          </div>

          <button
            onClick={() => setActiveTab("intro")}
            className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all select-none cursor-pointer ${
              activeTab === "intro"
                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2"
                : "text-zinc-650 hover:bg-zinc-100 hover:text-zinc-950"
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles
                className={`h-4 w-4 ${activeTab === "intro" ? "text-blue-600" : "text-zinc-400"}`}
              />
              Getting Started
            </span>
            <ChevronRight className="h-3 w-3 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("html")}
            className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all select-none cursor-pointer ${
              activeTab === "html"
                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2"
                : "text-zinc-650 hover:bg-zinc-100 hover:text-zinc-950"
            }`}
          >
            <span className="flex items-center gap-2">
              <Code
                className={`h-4 w-4 ${activeTab === "html" ? "text-blue-600" : "text-zinc-400"}`}
              />
              HTML Script
            </span>
            <ChevronRight className="h-3 w-3 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("react")}
            className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all select-none cursor-pointer ${
              activeTab === "react"
                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2"
                : "text-zinc-650 hover:bg-zinc-100 hover:text-zinc-950"
            }`}
          >
            <span className="flex items-center gap-2">
              <Code
                className={`h-4 w-4 ${activeTab === "react" ? "text-blue-600" : "text-zinc-400"}`}
              />
              React SDK Hook
            </span>
            <ChevronRight className="h-3 w-3 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("nextjs")}
            className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all select-none cursor-pointer ${
              activeTab === "nextjs"
                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2"
                : "text-zinc-650 hover:bg-zinc-100 hover:text-zinc-950"
            }`}
          >
            <span className="flex items-center gap-2">
              <Layers
                className={`h-4 w-4 ${activeTab === "nextjs" ? "text-blue-600" : "text-zinc-400"}`}
              />
              Next.js Snippet
            </span>
            <ChevronRight className="h-3 w-3 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("api")}
            className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all select-none cursor-pointer ${
              activeTab === "api"
                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2"
                : "text-zinc-650 hover:bg-zinc-100 hover:text-zinc-950"
            }`}
          >
            <span className="flex items-center gap-2">
              <Terminal
                className={`h-4 w-4 ${activeTab === "api" ? "text-blue-600" : "text-zinc-400"}`}
              />
              API & cURL Reference
            </span>
            <ChevronRight className="h-3 w-3 opacity-60" />
          </button>
        </aside>

        {/* DOCUMENTATION VIEW (Right Panel) */}
        <main className="flex-1 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm min-h-[500px]">
          {/* 1. Introduction Guide */}
          {activeTab === "intro" && (
            <div className="space-y-6">
              <div className="space-y-2 border-b border-zinc-100 pb-5">
                <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Introduction
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">
                  Getting Started with eventlyticsX
                </h1>
                <p className="text-sm text-zinc-550 leading-relaxed">
                  Welcome to eventlyticsX—the privacy-centric, lightweight,
                  real-time analytics provider for developers. Our tracker uses
                  a single script less than 1KB, operates on an event-driven
                  flow, and ensures data compliance without cookies or intrusive
                  fingerprinting.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                  Core Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-zinc-150 p-4 space-y-2 hover:border-zinc-350 transition-colors">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Activity className="h-4 w-4" />
                    </span>
                    <h3 className="text-xs font-bold text-zinc-900">
                      Real-Time Aggregates
                    </h3>
                    <p className="text-xxs text-zinc-450 leading-normal">
                      Monitor incoming traffic streams, views, and clicks with
                      latency under 150ms.
                    </p>
                  </div>

                  <div className="rounded-xl border border-zinc-150 p-4 space-y-2 hover:border-zinc-350 transition-colors">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650">
                      <Code className="h-4 w-4" />
                    </span>
                    <h3 className="text-xs font-bold text-zinc-900">
                      Multiple SDKs Supported
                    </h3>
                    <p className="text-xxs text-zinc-450 leading-normal">
                      Native HTML scripts, React hooks, and Next.js Script
                      embeds out of the box.
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions regarding public key selection */}
              <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4 flex gap-3 items-start">
                <Key className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-zinc-900">
                    Personalize Your Code
                  </h4>
                  <p className="text-xxs text-zinc-550 leading-normal">
                    Select your active project in the top-right header, or
                    create a new one using the **Generate Public Key** button.
                    Once selected, all code blocks across the documentation tabs
                    will automatically insert your unique public key!
                  </p>
                </div>
              </div>

              {/* Actionable CTA if no projects exist */}
              {projects.length === 0 && (
                <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/20 p-6 text-center space-y-4 flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FolderPlus className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h3 className="text-xs font-bold text-zinc-900">
                      No Projects Available
                    </h3>
                    <p className="text-xxs text-zinc-550 leading-normal">
                      Create a project workspace to instantly obtain an active
                      tracking key and begin monitoring events.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold transition-all shadow-md select-none cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Generate Your First Key
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2. HTML script guide */}
          {activeTab === "html" && (
            <div className="space-y-6">
              <div className="space-y-2 border-b border-zinc-100 pb-5">
                <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  HTML Script
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">
                  Integration with HTML / Vanilla JS
                </h1>
                <p className="text-sm text-zinc-550 leading-relaxed">
                  For static files or traditional multi-page websites, drop our
                  CDN script tag into the head of your templates.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                  <span>Usage Snippet</span>
                  <span className="text-[10px] font-medium text-zinc-400">
                    Current Key:{" "}
                    <code className="font-mono text-zinc-800">
                      {activeKey.slice(0, 10)}...
                    </code>
                  </span>
                </div>

                {/* Code panel */}
                <div className="rounded-xl border border-zinc-200 bg-zinc-950 font-mono text-xs overflow-hidden shadow-md">
                  <div className="flex items-center justify-between bg-zinc-900 px-4 py-2 border-b border-zinc-800">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                      index.html
                    </span>
                    <button
                      onClick={() => handleCopyCode(htmlCode, 1)}
                      className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer select-none text-[10px]"
                    >
                      {copiedIndex === 1 ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-emerald-500 font-bold">
                            Copied
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-5 overflow-x-auto text-zinc-300 whitespace-pre">
                    {htmlCode}
                  </pre>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  Parameters details
                </h3>
                <div className="space-y-2 text-xxs text-zinc-550">
                  <div className="flex items-start gap-2 border-b border-zinc-100 pb-2">
                    <span className="font-mono bg-zinc-100 text-zinc-850 px-1.5 py-0.5 rounded font-bold">
                      endPoint
                    </span>
                    <span className="leading-relaxed">
                      The tracking URL where JSON request body events are
                      POSTed.
                    </span>
                  </div>
                  <div className="flex items-start gap-2 border-b border-zinc-100 pb-2">
                    <span className="font-mono bg-zinc-100 text-zinc-850 px-1.5 py-0.5 rounded font-bold">
                      projectKey
                    </span>
                    <span className="leading-relaxed">
                      Your project's specific public key starting with{" "}
                      <code className="font-mono text-zinc-850">evX_</code>.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. React hook */}
          {activeTab === "react" && (
            <div className="space-y-6">
              <div className="space-y-2 border-b border-zinc-100 pb-5">
                <div className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  React Hook
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">
                  Integration with Single-Page React Applications
                </h1>
                <p className="text-sm text-zinc-550 leading-relaxed">
                  For client-rendered React applications, create a reusable
                  custom Hook to inject the tracker script dynamically on app
                  initialization.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                  <span>Custom Hook Snippet</span>
                  <span className="text-[10px] font-medium text-zinc-400">
                    Current Key:{" "}
                    <code className="font-mono text-zinc-800">
                      {activeKey.slice(0, 10)}...
                    </code>
                  </span>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-950 font-mono text-xs overflow-hidden shadow-md">
                  <div className="flex items-center justify-between bg-zinc-900 px-4 py-2 border-b border-zinc-800">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                      useAnalytics.ts
                    </span>
                    <button
                      onClick={() => handleCopyCode(reactCode, 2)}
                      className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer select-none text-[10px]"
                    >
                      {copiedIndex === 2 ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-emerald-500 font-bold">
                            Copied
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-5 overflow-x-auto text-zinc-300 whitespace-pre">
                    {reactCode}
                  </pre>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  How to consume
                </h3>
                <p className="text-xxs text-zinc-550 leading-relaxed">
                  Import the custom hook inside your main layout/entry component
                  (e.g.{" "}
                  <code className="font-mono bg-zinc-100 text-zinc-850 px-1 py-0.5 rounded">
                    App.tsx
                  </code>{" "}
                  or{" "}
                  <code className="font-mono bg-zinc-100 text-zinc-850 px-1 py-0.5 rounded">
                    main.tsx
                  </code>
                  ) and execute the function inside the default export
                  component.
                </p>
              </div>
            </div>
          )}

          {/* 4. NextJS snippet */}
          {activeTab === "nextjs" && (
            <div className="space-y-6">
              <div className="space-y-2 border-b border-zinc-100 pb-5">
                <div className="inline-flex items-center gap-1 bg-zinc-900 text-zinc-50 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Next.js
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">
                  Integration with Next.js (App Router)
                </h1>
                <p className="text-sm text-zinc-550 leading-relaxed">
                  Embed the lightweight tracking script utilizing Next.js native{" "}
                  <code className="font-mono bg-zinc-100 text-zinc-850 px-1 py-0.5 rounded">
                    next/script
                  </code>{" "}
                  utility for server-side optimization.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                  <span>Layout Script Embed</span>
                  <span className="text-[10px] font-medium text-zinc-400">
                    Current Key:{" "}
                    <code className="font-mono text-zinc-800">
                      {activeKey.slice(0, 10)}...
                    </code>
                  </span>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-950 font-mono text-xs overflow-hidden shadow-md">
                  <div className="flex items-center justify-between bg-zinc-900 px-4 py-2 border-b border-zinc-800">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                      app/layout.tsx
                    </span>
                    <button
                      onClick={() => handleCopyCode(nextCode, 3)}
                      className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer select-none text-[10px]"
                    >
                      {copiedIndex === 3 ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-emerald-500 font-bold">
                            Copied
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-5 overflow-x-auto text-zinc-300 whitespace-pre">
                    {nextCode}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* 5. API Reference */}
          {activeTab === "api" && (
            <div className="space-y-6">
              <div className="space-y-2 border-b border-zinc-100 pb-5">
                <div className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  API cURL
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">
                  Direct API Integration (cURL Reference)
                </h1>
                <p className="text-sm text-zinc-550 leading-relaxed">
                  For backend-level event dispatching or customized tracking
                  wrappers, interact with our POST API endpoint directly.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                  <span>POST API Request</span>
                  <span className="text-[10px] font-medium text-zinc-400">
                    Current Key:{" "}
                    <code className="font-mono text-zinc-800">
                      {activeKey.slice(0, 10)}...
                    </code>
                  </span>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-950 font-mono text-xs overflow-hidden shadow-md">
                  <div className="flex items-center justify-between bg-zinc-900 px-4 py-2 border-b border-zinc-800">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                      Terminal Request
                    </span>
                    <button
                      onClick={() => handleCopyCode(apiCurlCode, 4)}
                      className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer select-none text-[10px]"
                    >
                      {copiedIndex === 4 ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-emerald-500 font-bold">
                            Copied
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Command</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-5 overflow-x-auto text-zinc-300 whitespace-pre">
                    {apiCurlCode}
                  </pre>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  Response Format
                </h3>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 font-mono text-[11px] text-zinc-650">
                  <pre>{`{
  "success": true,
  "event": {
    "id": "evt_uuid_1052f136",
    "eventType": "page-view",
    "projectKey": "${activeKey}",
    "path": "/landing-page",
    "referrer": "https://google.com",
    "sessionId": "sess_dev_12345",
    "createdAt": "${new Date().toISOString()}"
  }
}`}</pre>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CREATE PROJECT DIALOG MODAL (State Driven) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-xl p-6 space-y-4">
            {/* Modal Close */}
            <button
              onClick={() => {
                setShowModal(false);
                setNewProjectName("");
                setModalError(null);
              }}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors select-none cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Modal Heading */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-600" />
                Generate Tracking Key
              </h3>
              <p className="text-xxs text-zinc-550 leading-relaxed">
                Provide a name for your web application. We will generate a
                unique key configuration block to link your telemetry events.
              </p>
            </div>

            {/* Modal Error */}
            {modalError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xxs text-red-700 leading-normal">
                {modalError}
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="docsProjectName"
                  className="text-[10px] font-bold text-zinc-700 uppercase tracking-wider"
                >
                  Project Workspace Name
                </label>
                <input
                  type="text"
                  id="docsProjectName"
                  required
                  placeholder="e.g. E-Commerce Storefront"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none transition-colors"
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
                  className="rounded-xl border border-zinc-200 hover:bg-zinc-50 px-4 py-2.5 text-xs font-semibold text-zinc-650 transition-colors select-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newProjectName.trim()}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2.5 text-xs font-bold shadow-md shadow-blue-500/10 transition-all select-none cursor-pointer"
                >
                  {creating ? (
                    <>
                      <Activity className="h-3.5 w-3.5 animate-spin mr-1.5" />
                      <span>Generating...</span>
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
        <div className="flex min-h-screen items-center justify-center bg-zinc-50">
          <div className="flex flex-col items-center gap-3">
            <Activity className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-sm font-medium text-zinc-500">
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
