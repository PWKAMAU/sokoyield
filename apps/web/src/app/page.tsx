"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Unlock, ShieldCheck, Wallet, Shield } from "lucide-react";
import { LiveTickerBanner } from "@/components/live-ticker-banner";
import { OrderBook } from "@/components/order-book";
import { GeospatialNakuruMap } from "@/components/geospatial-nakuru-map";
import { SaaSPaywallModal } from "@/components/saas-paywall-modal";

export default function Home() {
  const [hasSubscription, setHasSubscription] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a1124] text-[#e6ebf5] flex flex-col font-sans selection:bg-[#f2e30b] selection:text-black">
      {/* Top Header */}
      <header className="border-b border-[#1f2a48] bg-[#0a1124]/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black tracking-tight flex items-center">
              <span className="text-[#39ff88]">Soko</span>
              <span className="text-[#f2e30b]">Yield</span>
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#111a33] text-[#f2e30b] border border-[#f2e30b]/30">
              Buyer SaaS Terminal ($500/mo)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Escrow Balance Chip */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111a33] border border-[#1f2a48] text-xs">
              <Wallet className="w-3.5 h-3.5 text-[#f2e30b]" />
              <span className="text-[#8a95b0] hidden md:inline">Platform Escrow:</span>
              <span className="font-mono font-bold text-white">KES 4,545,500.00</span>
            </div>

            {/* Admin Control Room Link */}
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#111a33] hover:bg-[#1f2a48] text-[#8a95b0] hover:text-white border border-[#1f2a48] transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#e5262b]" />
              <span>Control Room</span>
            </Link>

            {/* SaaS Status Toggle */}
            <button
              onClick={() => {
                if (hasSubscription) {
                  setHasSubscription(false);
                } else {
                  setShowPaywall(true);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                hasSubscription
                  ? "bg-[#39ff88]/15 text-[#39ff88] border-[#39ff88]/40 hover:bg-[#39ff88]/25"
                  : "bg-[#f2e30b]/15 text-[#f2e30b] border-[#f2e30b]/40 hover:bg-[#f2e30b]/25"
              }`}
            >
              {hasSubscription ? (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Pro Unlocked</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>$500/mo Paywall</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Streaming High-Frequency Ticker */}
      <LiveTickerBanner />

      {/* Main Terminal Dashboard */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 space-y-6">
        {/* Terminal Alert Banner for Paywall State */}
        {!hasSubscription && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#111a33] to-[#15203f] border border-[#f2e30b]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f2e30b] animate-ping" />
                <h4 className="text-sm font-bold text-white">
                  Enterprise Buyer SaaS Terminal Access Required
                </h4>
              </div>
              <p className="text-xs text-[#8a95b0]">
                Viewing simulated public overview. Upgrade to unlock high-frequency live order streaming and automated Stripe Connect settlements.
              </p>
            </div>
            <button
              onClick={() => setShowPaywall(true)}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-[#f2e30b] hover:bg-[#ffe81a] text-black shadow transition-all cursor-pointer shrink-0"
            >
              Unlock Terminal ($500/mo)
            </button>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Book takes 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <OrderBook />
          </div>

          {/* Nakuru County Geospatial Map takes 1 column */}
          <div className="space-y-6">
            <GeospatialNakuruMap />

            {/* Protocol Settlement Card */}
            <div className="p-4 rounded-xl bg-[#111a33] border border-[#1f2a48] space-y-3 font-sans">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#39ff88]" />
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  Escrow Payout Guarantee
                </h4>
              </div>
              <p className="text-xs text-[#8a95b0] leading-relaxed">
                Funds are held in platform Stripe escrow and released only upon physical delivery confirmation and AI grade matching.
              </p>
              <div className="pt-2 border-t border-[#1f2a48] flex justify-between text-xs font-mono">
                <span className="text-[#8a95b0]">Farmer Payout:</span>
                <span className="text-[#39ff88] font-bold">97.00%</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#8a95b0]">SokoYield Protocol Fee:</span>
                <span className="text-[#f2e30b] font-bold">3.00%</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Paywall Modal */}
      <SaaSPaywallModal
        isOpen={showPaywall}
        onSuccess={() => {
          setHasSubscription(true);
          setShowPaywall(false);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-[#1f2a48] py-4 bg-[#0a1124] text-center text-xs text-[#8a95b0] font-mono">
        SokoYield High-Frequency Trading &amp; Escrow Engine &bull; Phase 5 Production Build &bull; TimescaleDB &amp; Stripe Connect
      </footer>
    </div>
  );
}
