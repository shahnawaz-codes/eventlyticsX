"use client";

import { useState } from "react";
import {
  Activity,
  ArrowLeft,
  Loader2,
  Copy,
  Check,
  Terminal,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Project } from "@/modules/project/types";
import { toast } from "sonner";
import { CodeBlock } from "@/app/docs/components/CodeBlock";

export function SDKSetupWizard({
  project,
  onBack,
  onManualCheck,
}: {
  project: Project;
  onBack: () => void;
  onManualCheck: () => Promise<void>;
}) {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleCopyCmd = () => {
    navigator.clipboard.writeText("npm install eventlytics-browser");
    setCopiedCmd(true);
    toast.success("Install command copied to clipboard!");
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const codeSnippet = `import { Analytics } from "eventlytics-browser";

// Create the singleton instance
const analytics = new Analytics({
  projectKey: "${project.public_key}"
});

// Start auto-tracking page-views, clicks, and exits
analytics.init();`;

  const triggerManualCheck = async () => {
    setChecking(true);
    const checkPromise = onManualCheck();
    toast.promise(checkPromise, {
      loading: "Checking integration status...",
      success: "Status checked. Waiting for tracking events...",
      error: "Failed to check status",
    });
    await checkPromise;
    setTimeout(() => setChecking(false), 800);
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-100 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 transition-all select-none cursor-pointer"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-950">{project.name}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-250 px-2 py-0.5 text-[10px] font-semibold text-amber-700 select-none">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Not Verified
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-medium">SDK Integration Wizard</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-medium">Public Key:</span>
            <code className="rounded bg-zinc-100 px-2 py-0.5 text-zinc-700 font-mono text-[10px] select-all">
              {project.public_key}
            </code>
          </div>
        </div>
      </header>

      {/* Wizard Content */}
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Integration Steps */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Connect Your Website</h1>
              <p className="text-xs text-zinc-500">
                To unlock your analytics workspace, follow these simple integration steps to install and initialize the eventlyticsX SDK.
              </p>
            </div>

            <div className="space-y-5">
              {/* Step 1 */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3.5 shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-zinc-200/10">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-55 text-blue-600 text-xs font-bold font-mono border border-blue-200">1</span>
                  <h3 className="font-bold text-zinc-900 text-sm">Install the Browser SDK</h3>
                </div>
                <p className="text-xs text-zinc-500 pl-8 leading-relaxed">
                  Run the following command in your web project's root folder to install the browser tracking SDK.
                </p>
                <div className="pl-8">
                  <div className="flex items-center justify-between rounded-xl bg-zinc-900 p-3 font-mono text-xs text-zinc-100">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-zinc-500 shrink-0" />
                      <span>npm install eventlytics-browser</span>
                    </div>
                    <button
                      onClick={handleCopyCmd}
                      className="text-zinc-450 hover:text-white transition-colors cursor-pointer select-none"
                    >
                      {copiedCmd ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3.5 shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-zinc-200/10">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-55 text-blue-600 text-xs font-bold font-mono border border-blue-200">2</span>
                  <h3 className="font-bold text-zinc-900 text-sm">Initialize in your Entry Point</h3>
                </div>
                <p className="text-xs text-zinc-500 pl-8 leading-relaxed">
                  Import and instantiate the SDK singleton in your React/Next.js root file (e.g. <code className="text-zinc-650 bg-zinc-100 px-1 py-0.5 rounded font-mono text-[10px]">main.tsx</code> or <code className="text-zinc-650 bg-zinc-100 px-1 py-0.5 rounded font-mono text-[10px]">_app.tsx</code>), then call <code className="text-zinc-650 bg-zinc-100 px-1 py-0.5 rounded font-mono text-[10px]">.init()</code>.
                </p>
                <div className="pl-8">
                  <CodeBlock
                    code={codeSnippet}
                    language="typescript"
                    filename="analytics.ts"
                  />
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3.5 shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-zinc-200/10">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-55 text-blue-600 text-xs font-bold font-mono border border-blue-200">3</span>
                  <h3 className="font-bold text-zinc-900 text-sm">Open your application</h3>
                </div>
                <p className="text-xs text-zinc-500 pl-8 leading-relaxed">
                  Start your local development server or push your app to staging, and open the webpage. The SDK automatically triggers a <code className="text-zinc-650 bg-zinc-100 px-1 py-0.5 rounded font-mono text-[10px]">page-view</code> event.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Status Monitor */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm flex-1 flex flex-col justify-between min-h-[350px]">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <Activity className="h-4.5 w-4.5 text-blue-650" />
                    Live Telemetry Stream
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded bg-zinc-100 px-2 py-0.5 text-[9px] font-bold text-zinc-500">
                    REALTIME
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center py-10 text-center space-y-5">
                  {/* Pulsing Radar Ring Animation */}
                  <div className="relative flex h-24 w-24 items-center justify-center">
                    <div className="absolute animate-ping inline-flex h-20 w-20 rounded-full bg-blue-400 opacity-20" />
                    <div className="absolute animate-pulse inline-flex h-16 w-16 rounded-full bg-blue-500/10" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 border border-blue-150">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    </div>
                  </div>

                  <div className="space-y-1.5 max-w-xs">
                    <h4 className="font-bold text-zinc-900 text-sm">Listening for integration signal...</h4>
                    <p className="text-xs text-zinc-450 leading-relaxed">
                      We are waiting for the first page view telemetry package from your site. Once detected, this page will unlock.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status footer with manual check fallback */}
              <div className="border-t border-zinc-100 pt-4 flex flex-col gap-2.5">
                <button
                  onClick={triggerManualCheck}
                  disabled={checking}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 px-4 py-2.5 text-xs font-semibold text-zinc-700 transition-all select-none cursor-pointer"
                >
                  {checking ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-500" />
                      <span>Checking signal...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Check verification status</span>
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-450">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>The page updates automatically. No reload required.</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
