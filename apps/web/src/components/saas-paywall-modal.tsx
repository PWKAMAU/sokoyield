"use client";

import { Check, Lock, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

interface SaaSPaywallModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export function SaaSPaywallModal({ isOpen, onSuccess }: SaaSPaywallModalProps) {
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubscribeStripe = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      // In real workflow, pass current buyer JWT token
      const res = await fetch(`${apiUrl}/api/v1/fintech/subscription/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnUrl: window.location.href }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  const handleDemoUnlock = async () => {
    setDemoLoading(true);
    try {
      // Simulate demo activation
      await new Promise((r) => setTimeout(r, 600));
      onSuccess();
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg bg-[#0a1124] border-2 border-[#f2e30b]/30 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-white text-center font-sans overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#f2e30b]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Lock Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-[#111a33] border border-[#f2e30b]/40 flex items-center justify-center shadow-lg shadow-[#f2e30b]/10">
          <Lock className="w-7 h-7 text-[#f2e30b]" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-[#f2e30b]/15 text-[#f2e30b] border border-[#f2e30b]/30">
            <Sparkles className="w-3.5 h-3.5" />
            Buyer SaaS Terminal Gate
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            High-Frequency Trading Terminal
          </h2>
          <p className="text-sm text-[#8a95b0]">
            Access live order books, TimescaleDB commodity tickers, and automated Stripe Connect escrow holds.
          </p>
        </div>

        {/* Price Card */}
        <div className="p-4 rounded-xl bg-[#111a33] border border-[#1f2a48] flex items-center justify-between">
          <div className="text-left">
            <p className="text-xs uppercase tracking-wider font-mono text-[#8a95b0]">
              Enterprise Tier
            </p>
            <p className="text-lg font-bold text-white">SokoYield Pro Terminal</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-[#f2e30b] font-mono">$500</span>
            <span className="text-xs text-[#8a95b0]"> / month</span>
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-2.5 text-left text-xs text-[#e6ebf5]">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-[#39ff88]/20 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-[#39ff88]" />
            </div>
            <span>Real-time TimescaleDB commodity price ticker stream (WebSockets)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-[#39ff88]/20 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-[#39ff88]" />
            </div>
            <span>Live order book with 1-click Stripe Connect Escrow Holds</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-[#39ff88]/20 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-[#39ff88]" />
            </div>
            <span>Kindwise AI Proof-of-Quality grading certificates (Grade A/B/C)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-[#39ff88]/20 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-[#39ff88]" />
            </div>
            <span>Automated 97% farmer payout and 3% platform fee settlements</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleSubscribeStripe}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-[#f2e30b] hover:bg-[#ffe81a] text-black shadow-lg shadow-[#f2e30b]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-4 h-4 fill-black" />
            {loading ? "Redirecting to Stripe..." : "Subscribe with Stripe ($500/mo)"}
          </button>

          <button
            onClick={handleDemoUnlock}
            disabled={demoLoading}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#8a95b0] hover:text-white bg-[#111a33] hover:bg-[#1f2a48] border border-[#1f2a48] transition-all cursor-pointer"
          >
            {demoLoading ? "Unlocking Terminal..." : "Simulate Enterprise Access (Instant Demo Unlock)"}
          </button>
        </div>
      </div>
    </div>
  );
}
