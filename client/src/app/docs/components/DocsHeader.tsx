"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { ArrowLeft, BookOpen, Plus, Activity } from "lucide-react";

interface Project {
  id: string;
  name: string;
  public_key: string;
  userId: string;
}

interface DocsHeaderProps {
  projects: Project[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  setShowModal: (show: boolean) => void;
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
}

export function DocsHeader({
  projects,
  selectedProjectId,
  setSelectedProjectId,
  setShowModal,
  isLoaded,
  isSignedIn,
}: DocsHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(isSignedIn ? "/dashboard" : "/")}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 transition-all select-none cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-400 select-none">
              eventlyticsX
            </span>
            <span className="text-zinc-300 text-sm">/</span>
            <span className="text-sm font-bold text-blue-650 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-blue-650" /> Docs
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Project Selection Dropdown */}
          {isLoaded && isSignedIn && (
            <>
              {projects.length > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-505 hidden md:inline">
                    Active Key:
                  </span>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-700 outline-none focus:border-blue-500 transition-all cursor-pointer"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.public_key.slice(0, 8)}...)
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="rounded-lg bg-zinc-100 border border-zinc-200/80 px-2.5 py-1 text-2xs font-bold text-zinc-400 uppercase tracking-wider">
                  No active projects
                </div>
              )}

              {/* Create project CTA inside docs */}
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold transition-all select-none cursor-pointer shadow-sm shadow-blue-500/10"
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
                <button className="text-xs font-semibold text-zinc-650 hover:text-zinc-950 transition-colors cursor-pointer select-none">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-sm shadow-blue-500/10 cursor-pointer select-none">
                  Get Free Key
                </button>
              </SignUpButton>
            </div>
          )}

          {/* UserProfile Button if signed in */}
          {isLoaded && isSignedIn && (
            <div className="border-l border-zinc-200 pl-3">
              <UserButton afterSignOutUrl="/" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
