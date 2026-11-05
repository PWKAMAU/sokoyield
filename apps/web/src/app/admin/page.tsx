"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, ShieldCheck, Scale, ArrowLeft } from "lucide-react";
import { ApiHealthMonitor } from "@/components/admin/api-health-monitor";
import { LiquidityMonitor } from "@/components/admin/liquidity-monitor";
import { DisputeVault } from "@/components/admin/dispute-vault";

export default function AdminControlRoomPage() {
  const [activeTab, setActiveTab] = useState<"liquidity" | "health" | "disputes">("liquidity");

  return (
    <div className="min-h-screen bg-[#0a1124] text-[#e6ebf5] flex flex-col font-sans selection:bg-[#f2e30b] selection:text-black">
      {/* Top Header */}
      <header className="border-b border-[#1f2a48] bg-[#0a1124]/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-[#8a95b0] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Buyer SaaS Terminal</span>
            </Link>

            <div className="h-4 w-px bg-[#1f2a48]" />

            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-black tracking-tight flex items-center">
                <span className="text-[#39ff88]">Soko</span>
                <span className="text-[#f2e30b]">Yield</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#e5262b]/15 text-[#e5262b] border border-[#e5262b]/30">
                Admin Control Room
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#39ff88] animate-ping" />
            <span className="text-xs font-mono text-[#8a95b0]">Platform Telemetry Active</span>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-[#1f2a48] bg-[#111a33]/60 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("liquidity")}
            className={`py-3.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "liquidity"
                ? "border-[#f2e30b] text-[#f2e30b]"
                : "border-transparent text-[#8a95b0] hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Stripe Liquidity &amp; Escrow Monitor</span>
          </button>

          <button
            onClick={() => setActiveTab("health")}
            className={`py-3.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "health"
                ? "border-[#39ff88] text-[#39ff88]"
                : "border-transparent text-[#8a95b0] hover:text-white"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>API Health &amp; Uptime (Kindwise, Agrio, Twilio)</span>
          </button>

          <button
            onClick={() => setActiveTab("disputes")}
            className={`py-3.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "disputes"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-[#8a95b0] hover:text-white"
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Dispute Resolution Vault</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1">
        {activeTab === "liquidity" && <LiquidityMonitor />}
        {activeTab === "health" && <ApiHealthMonitor />}
        {activeTab === "disputes" && <DisputeVault />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1f2a48] py-4 bg-[#0a1124] text-center text-xs text-[#8a95b0] font-mono">
        SokoYield Admin Control Room &bull; Live Telemetry &amp; Escrow Governance &bull; Phase 6 Production Build
      </footer>
    </div>
  );
}
