"use client";

import { AuthView } from "@neondatabase/auth-ui";
import { useParams } from "next/navigation";
import { Activity } from "lucide-react";

export default function AuthPage() {
  const params = useParams();
  const authRoute = Array.isArray(params?.auth) ? params.auth[0] : "sign-in";
  const currentView = authRoute === "sign-up" ? "sign-up" : "sign-in";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50/30 to-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Blur Background Circles */}
      <div className="absolute top-10 right-1/4 -z-10 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="absolute bottom-10 left-1/4 -z-10 h-72 w-72 rounded-full bg-blue-600/5 blur-3xl" />

      <div className="w-full max-w-md space-y-6 p-8 bg-white rounded-2xl border border-zinc-200/80 shadow-xl shadow-zinc-200/40">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-md shadow-blue-500/20">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-950">
              eventlytics<span className="text-blue-600">X</span>
            </span>
          </div>

          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            {currentView === "sign-up" ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-1.5 text-sm text-zinc-500 text-center">
            {currentView === "sign-up" 
              ? "Get started with Eventlytics today" 
              : "Enter your credentials to access your dashboard"}
          </p>
        </div>

        <div className="mt-6">
          <AuthView path={currentView} />
        </div>
      </div>
    </div>
  );
}
