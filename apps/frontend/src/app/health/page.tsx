"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../lib/api-client";
import { Activity, ShieldCheck, Server, Webhook } from "lucide-react";

export default function HealthPage() {
  // Query backend health route (assumed base status check is root or health check endpoint)
  const { data: backendStatus, isLoading, isError } = useQuery({
    queryKey: ["backend-health"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/");
        return res.status === 200 ? "Healthy" : "Unhealthy";
      } catch (err) {
        return "Degraded / Unreachable";
      }
    },
    refetchInterval: 10000, // Poll every 10 seconds
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-black">
      <div className="w-full max-w-md p-6 glass rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl" />
        
        <div className="flex items-center space-x-3 mb-6">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          <h1 className="text-xl font-semibold tracking-tight">System Status Diagnostic</h1>
        </div>

        <div className="space-y-4">
          {/* Frontend Check */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-medium">Frontend Web Gateway</span>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Online
            </span>
          </div>

          {/* Backend Check */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
            <div className="flex items-center space-x-3">
              <Server className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium">NestJS Core Service</span>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                isLoading
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : isError || backendStatus !== "Healthy"
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              }`}
            >
              {isLoading ? "Checking..." : backendStatus}
            </span>
          </div>

          {/* Target Host Config */}
          <div className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-1.5">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Webhook className="w-3.5 h-3.5" />
              <span>Target Backend API URL</span>
            </div>
            <code className="text-xs text-indigo-300 block font-mono bg-black/40 px-2 py-1 rounded select-all break-all">
              {process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}
            </code>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <p className="text-[10px] text-muted-foreground tracking-wider uppercase font-semibold">
            MangaNarrator AI diagnostic system v1.0.0
          </p>
        </div>
      </div>
    </main>
  );
}
