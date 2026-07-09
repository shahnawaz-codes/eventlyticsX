"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjects, createProject } from "@/modules/project/project.service";
import { Activity, Plus, X } from "lucide-react";
import { toast } from "sonner";

// Import modular components
import { DocsHeader } from "./components/DocsHeader";
import { DocsSidebar } from "./components/DocsSidebar";
import { DocsTableOfContents } from "./components/DocsTableOfContents";
import { DocsContentArea } from "./components/DocsContentArea";

interface Project {
  id: string;
  name: string;
  public_key: string;
  userId: string;
}

type TabType = "intro" | "setup" | "api";

function DocsContent() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();
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

  // Search filter query state
  const [searchQuery, setSearchQuery] = useState<string>("");

  // New project modal state
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "https://eventlyticsx.onrender.com";

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
    if (tabQuery && ["intro", "setup", "api"].includes(tabQuery)) {
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

  // Selected project details
  const currentProject = projects?.find((p) => p.id === selectedProjectId);
  const activeKey = currentProject
    ? currentProject.public_key
    : "evX_your-project-key-here";

  const trackingEndpoint = `${API_BASE_URL}/api/track`;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/50 text-zinc-800 font-sans antialiased selection:bg-blue-600/10 selection:text-blue-800">
      {/* Docs Header */}
      <DocsHeader
        projects={projects}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        setShowModal={setShowModal}
        isLoaded={isLoaded}
        isSignedIn={isSignedIn}
      />

      {/* Grid Container */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <DocsSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Content Area */}
        <main className="flex-1 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm min-h-[550px]">
          {/* Breadcrumbs (Nextra Style) */}
          <div className="flex items-center gap-1.5 text-2xs text-zinc-400 font-semibold mb-4 select-none">
            <span>Docs</span>
            <span>/</span>
            <span className="text-zinc-600 capitalize">
              {activeTab === "intro" ? "Getting Started" : activeTab === "setup" ? "React SDK" : "API Reference"}
            </span>
          </div>

          <DocsContentArea
            activeTab={activeTab}
            activeKey={activeKey}
            trackingEndpoint={trackingEndpoint}
            searchQuery={searchQuery}
          />
        </main>

        {/* Table of Contents */}
        <DocsTableOfContents activeTab={activeTab} />
      </div>

      {/* CREATE PROJECT DIALOG MODAL (State Driven) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-fade-in animate-duration-150">
          <div className="relative w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-xl p-6 space-y-4">
            {/* Modal Close */}
            <button
              onClick={() => {
                setShowModal(false);
                setNewProjectName("");
                setModalError(null);
              }}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-50 rounded-lg transition-colors select-none cursor-pointer"
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
                Provide a name for your web application. We will generate a unique key configuration block to link your telemetry events.
              </p>
            </div>

            {/* Modal Error */}
            {modalError && (
              <div className="rounded-xl border border-red-205 bg-red-50 p-3 text-xxs text-red-700 leading-normal">
                {modalError}
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="docsProjectName"
                  className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider"
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
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-450 focus:border-blue-500 focus:outline-none transition-all"
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
                  className="rounded-xl border border-zinc-200 hover:bg-zinc-50 px-4 py-2.5 text-xs font-semibold text-zinc-550 hover:text-zinc-950 transition-colors select-none cursor-pointer"
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
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-800">
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
