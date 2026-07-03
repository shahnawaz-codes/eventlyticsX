"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser, useClerk, UserButton } from "@clerk/nextjs";
import {
  Activity,
  Plus,
  Folder,
  ArrowRight,
  LogOut,
  Key,
  Database,
  ChevronRight,
  AlertCircle,
  Copy,
  Check,
  MoreVertical,
  Edit3,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  useCreateProject,
  useDeleteProject,
  useUpdateProject,
} from "@/modules/project/hooks/mutation";
import { useProjects } from "@/modules/project/hooks/query";
import { io, Socket } from "socket.io-client";

interface Project {
  id: string;
  name: string;
  public_key: string;
  userId: string;
}

export default function DashboardPage() {
  //__Auth
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const isPending = !isLoaded;
  const router = useRouter();
  //___copy
  const [copiedId, setCopiedId] = useState<string | null>(null);
  //___Project
  const {
    mutateAsync: createProject,
    isPending: isCreating,
    error,
  } = useCreateProject();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const [newProjectName, setNewProjectName] = useState("");

  // Dropdown & Modal States
  const [activeMenuProjectId, setActiveMenuProjectId] = useState<string | null>(
    null,
  );
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editProjectName, setEditProjectName] = useState("");
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  // Mutation hooks
  const { mutateAsync: deleteProject, isPending: isDeleting } =
    useDeleteProject();
  const { mutateAsync: updateProject, isPending: isUpdating } =
    useUpdateProject();

  const handleDeleteProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletingProject) return;
    if (deleteConfirmationText !== deletingProject.name) return;
    try {
      await deleteProject(deletingProject.id);
      setDeletingProject(null);
      setDeleteConfirmationText("");
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editProjectName.trim()) return;
    try {
      await updateProject({
        projectId: editingProject.id,
        projectName: editProjectName.trim(),
      });
      setEditingProject(null);
      setEditProjectName("");
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    try {
      const project = await createProject(newProjectName);
      setNewProjectName("");
      // Redirect to the newly created project's dashboard details page
      router.push(`/dashboard/project/${project.id}`);
    } catch (err: any) {
      console.error("Error creating project:", err);
    }
  };
  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-3">
          <Activity className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-medium text-zinc-500">
            Loading your workspace...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/50">
      {/* Dashboard Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-md shadow-blue-500/20">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-950">
              eventlytics<span className="text-blue-600">X</span>
            </span>
            <span className="ml-2 rounded bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-650">
              Console
            </span>
          </div>

          <div className="flex items-center gap-4">
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col gap-8">
        {/* Banner / Header Title */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">
            Developer Workspace
          </h1>
          <p className="text-sm text-zinc-500">
            Create web projects, configure event triggers, and monitor tracking
            traffic details.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 flex gap-3 items-start animate-fade-in">
            <AlertCircle className="h-5 w-5 text-red-650 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-red-800">
                Something went wrong
              </h4>
              <p className="text-xs text-red-700 leading-normal">
                {error.message}
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Projects List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
                <Database className="h-4 w-4 text-zinc-400" />
                Active Projects
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-bold text-zinc-500">
                  {projects?.length}
                </span>
              </h2>
              {projectsLoading ? (
                // Loading Skeleton
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-32 w-full animate-pulse bg-white rounded-2xl border border-zinc-200/60"
                    />
                  ))}
                </div>
              ) : projects?.length === 0 || projects === undefined ? (
                // Empty State
                <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center flex flex-col items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                    <Folder className="h-6 w-6" />
                  </div>
                  <div className="max-w-sm space-y-1">
                    <h3 className="font-bold text-zinc-900">No projects yet</h3>
                    <p className="text-xs text-zinc-500 leading-normal">
                      Create your first project on the right panel to get your
                      tracking public key and integrate the SDK.
                    </p>
                  </div>
                </div>
              ) : (
                // Projects List Render
                <div className="space-y-3.5">
                  {projects?.map((project: Project) => (
                    <div
                      key={project.id}
                      className="group relative rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:border-zinc-300/80 hover:shadow-md hover:shadow-zinc-200/20"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-50 border border-zinc-150 text-zinc-650">
                              <Folder className="h-4.5 w-4.5" />
                            </div>
                            <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                              {project.name}
                            </h3>
                          </div>

                          {/* Public Key Display */}
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-medium text-zinc-400 flex items-center gap-1">
                              <Key className="h-3 w-3" /> Public Key:
                            </span>
                            <code className="rounded bg-zinc-100 px-2 py-0.5 text-zinc-700 font-mono text-[11px] select-all">
                              {project.public_key}
                            </code>
                            <button
                              onClick={() =>
                                handleCopyKey(project.public_key, project.id)
                              }
                              className="text-zinc-400 hover:text-zinc-900 transition-colors select-none"
                              title="Copy Key"
                            >
                              {copiedId === project.id ? (
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="self-end sm:self-center flex items-center gap-2">
                          <a
                            href={`/dashboard/project/${project.id}`}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-50 border border-blue-150 px-3.5 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-600 hover:text-white transition-all select-none"
                          >
                            <span>Go to Project</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </a>

                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setActiveMenuProjectId(
                                  activeMenuProjectId === project.id
                                    ? null
                                    : project.id,
                                );
                              }}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 transition-all select-none focus:outline-none cursor-pointer"
                              title="Project Actions"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>

                            {activeMenuProjectId === project.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setActiveMenuProjectId(null);
                                  }}
                                />
                                <div className="absolute right-0 mt-1.5 w-36 rounded-xl border border-zinc-200 bg-white p-1 shadow-lg z-20 animate-in fade-in slide-in-from-top-1 duration-100">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setActiveMenuProjectId(null);
                                      setEditingProject(project);
                                      setEditProjectName(project.name);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                                  >
                                    <Edit3 className="h-3.5 w-3.5 text-zinc-400" />
                                    Edit Name
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setActiveMenuProjectId(null);
                                      setDeletingProject(project);
                                      setDeleteConfirmationText("");
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-red-650 hover:bg-red-50 cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Delete
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Create Project Panel (4 cols) */}
          <div className="lg:col-span-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-950 mb-1.5 flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              New Project
            </h2>
            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
              Name your workspace. Once created, we will generate a dedicated
              tracker key and load the SDK installation guidelines.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="projectName"
                  className="text-xs font-bold text-zinc-700 uppercase tracking-wider"
                >
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  required
                  placeholder="e.g. My Portfolio Site"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isCreating || !newProjectName.trim()}
                className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2.5 text-sm font-semibold shadow-md shadow-blue-500/10 transition-all select-none cursor-pointer"
              >
                {isCreating ? (
                  <>
                    <Activity className="h-4 w-4 animate-spin mr-1.5" />
                    <span>Creating project...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1.5" />
                    <span>Create Project</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Edit Project Name Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-55 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-zinc-950/45 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setEditingProject(null)}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-md scale-100 rounded-2xl border border-zinc-150 bg-white p-6 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2 mb-2">
              <Edit3 className="h-5 w-5 text-blue-600" />
              Edit Project Name
            </h3>
            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
              Change the display name of your project. This will not change your
              public tracking key.
            </p>

            <form onSubmit={handleEditProject} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="editProjectName"
                  className="text-xs font-bold text-zinc-700 uppercase tracking-wider"
                >
                  Project Name
                </label>
                <input
                  type="text"
                  id="editProjectName"
                  required
                  placeholder="e.g. My Updated Site"
                  value={editProjectName}
                  onChange={(e) => setEditProjectName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none transition-colors"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-all select-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isUpdating ||
                    !editProjectName.trim() ||
                    editProjectName.trim() === editingProject.name
                  }
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2.5 text-sm font-semibold shadow-md shadow-blue-500/10 transition-all select-none cursor-pointer"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Project Modal */}
      {deletingProject && (
        <div className="fixed inset-0 z-55 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-zinc-950/45 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setDeletingProject(null)}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-md scale-100 rounded-2xl border border-red-100 bg-white p-6 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-red-650 flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-650" />
              Delete Project?
            </h3>
            <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
              Are you absolutely sure you want to delete{" "}
              <span className="font-semibold text-zinc-800">
                "{deletingProject.name}"
              </span>
              ? This action is permanent and will delete all analytics data,
              events, and API configurations. This cannot be undone.
            </p>

            <form onSubmit={handleDeleteProject} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="deleteConfirm"
                  className="text-xs font-medium text-zinc-650 leading-relaxed block"
                >
                  To confirm, type{" "}
                  <span className="font-mono bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-semibold text-[11px] select-all">
                    {deletingProject.name}
                  </span>{" "}
                  below:
                </label>
                <input
                  type="text"
                  id="deleteConfirm"
                  required
                  placeholder="Type project name exactly"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-red-500 focus:outline-none transition-colors"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingProject(null)}
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-all select-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isDeleting ||
                    deleteConfirmationText !== deletingProject.name
                  }
                  className="inline-flex items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-200 text-white px-4 py-2.5 text-sm font-semibold shadow-md shadow-red-500/10 transition-all select-none cursor-pointer"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete Project</span>
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
