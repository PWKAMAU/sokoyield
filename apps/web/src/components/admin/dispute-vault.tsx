"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, XCircle, ShieldCheck, Scale, Cpu, Camera } from "lucide-react";

export interface DisputeItem {
  id: string;
  cropAsset: string;
  lotId: string;
  farmer: string;
  farmerLocation: string;
  buyer: string;
  tradeValueKes: string;
  originalGrade: string;
  originalAiConfidence: string;
  originalPhotoUrl: string;
  originalTimestamp: string;
  buyerComplaintPhotoUrl: string;
  buyerClaim: string;
  status: "OPEN" | "RESOLVED_FARMER_PAID" | "RESOLVED_BUYER_REFUNDED";
}

const DEFAULT_DISPUTE: DisputeItem = {
  id: "disp-101",
  cropAsset: "White Maize Grade A",
  lotId: "LOT-NKU-2026-8812",
  farmer: "Kiprono Farms (Njoro)",
  farmerLocation: "Nakuru County (-0.34, 35.94)",
  buyer: "KenAgro Grain Mills Ltd",
  tradeValueKes: "1597500.00",
  originalGrade: "GRADE_A",
  originalAiConfidence: "98.2%",
  originalPhotoUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80",
  originalTimestamp: "2026-11-04 14:22 UTC",
  buyerComplaintPhotoUrl: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80",
  buyerClaim: "Buyer depot inspection logged moisture content at 16.4% and reported localized grain discoloration upon delivery at Nakuru terminal depot.",
  status: "OPEN",
};

export function DisputeVault() {
  const [dispute, setDispute] = useState<DisputeItem>(DEFAULT_DISPUTE);
  const [rulingNotes, setRulingNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRuleFarmer = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setDispute((prev) => ({ ...prev, status: "RESOLVED_FARMER_PAID" }));
    } finally {
      setLoading(false);
    }
  };

  const handleRuleBuyer = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setDispute((prev) => ({ ...prev, status: "RESOLVED_BUYER_REFUNDED" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111a33] border border-[#1f2a48] rounded-xl overflow-hidden shadow-lg font-sans space-y-4">
      {/* Header */}
      <div className="p-4 border-b border-[#1f2a48] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-[#f2e30b]" />
          <h3 className="text-sm font-semibold text-white">Dispute Resolution Vault</h3>
        </div>
        <div>
          {dispute.status === "OPEN" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#f2e30b]/15 text-[#f2e30b] border border-[#f2e30b]/30">
              <AlertCircle className="w-3 h-3" />
              DISPUTE UNDER ADJUDICATION
            </span>
          )}
          {dispute.status === "RESOLVED_FARMER_PAID" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#39ff88]/15 text-[#39ff88] border border-[#39ff88]/30">
              <CheckCircle2 className="w-3 h-3" />
              RESOLVED &bull; FARMER PAID (97%)
            </span>
          )}
          {dispute.status === "RESOLVED_BUYER_REFUNDED" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#e5262b]/15 text-[#e5262b] border border-[#e5262b]/30">
              <XCircle className="w-3 h-3" />
              RESOLVED &bull; BUYER REFUNDED (100%)
            </span>
          )}
        </div>
      </div>

      {/* Dispute Summary Meta */}
      <div className="px-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 rounded bg-[#0a1124] border border-[#1f2a48]">
          <span className="text-[10px] text-[#8a95b0] block">Produce Lot</span>
          <span className="font-semibold text-white">{dispute.cropAsset}</span>
        </div>
        <div className="p-2.5 rounded bg-[#0a1124] border border-[#1f2a48]">
          <span className="text-[10px] text-[#8a95b0] block">Held Escrow Value</span>
          <span className="font-bold text-[#f2e30b] font-mono">
            KES {Number(dispute.tradeValueKes).toLocaleString()}
          </span>
        </div>
        <div className="p-2.5 rounded bg-[#0a1124] border border-[#1f2a48]">
          <span className="text-[10px] text-[#8a95b0] block">Farmer (Producer)</span>
          <span className="font-medium text-white truncate block">{dispute.farmer}</span>
        </div>
        <div className="p-2.5 rounded bg-[#0a1124] border border-[#1f2a48]">
          <span className="text-[10px] text-[#8a95b0] block">Buyer (Complainant)</span>
          <span className="font-medium text-white truncate block">{dispute.buyer}</span>
        </div>
      </div>

      {/* Side-by-Side Visual Comparison (Architecture Blueprint Spec) */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Original AI Grade Scan */}
        <div className="p-4 rounded-xl bg-[#0a1124] border border-[#39ff88]/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-mono font-bold text-[#39ff88] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              Original AI Grade Scan
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#39ff88]/15 text-[#39ff88] border border-[#39ff88]/30">
              {dispute.originalGrade} ({dispute.originalAiConfidence})
            </span>
          </div>

          <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-[#1f2a48] bg-[#111a33]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dispute.originalPhotoUrl}
              alt="Original scan"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 rounded text-[10px] font-mono text-[#39ff88]">
              DISPATCH CERTIFICATE #A-8812
            </div>
          </div>

          <div className="space-y-1 text-[11px] text-[#8a95b0] font-mono">
            <div>Harvest Timestamp: <span className="text-white">{dispute.originalTimestamp}</span></div>
            <div>Plot GPS: <span className="text-white">{dispute.farmerLocation}</span></div>
            <div>Kindwise AI Pathology: <span className="text-[#39ff88]">Zero blight / High grain density</span></div>
          </div>
        </div>

        {/* Right: Dispute Images & Buyer Complaint */}
        <div className="p-4 rounded-xl bg-[#0a1124] border border-[#e5262b]/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-mono font-bold text-[#e5262b] flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              Buyer Depot Inspection Photo
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#e5262b]/15 text-[#e5262b] border border-[#e5262b]/30">
              Claim: Damaged Goods
            </span>
          </div>

          <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-[#1f2a48] bg-[#111a33]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dispute.buyerComplaintPhotoUrl}
              alt="Buyer complaint"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 rounded text-[10px] font-mono text-[#e5262b]">
              DEPOT COMPLAINT LOG
            </div>
          </div>

          <div className="space-y-1 text-[11px] text-[#8a95b0]">
            <div className="font-semibold text-white">Complainant Claim:</div>
            <p className="italic bg-[#111a33] p-2 rounded border border-[#1f2a48] text-white/90">
              &ldquo;{dispute.buyerClaim}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Admin Ruling Decision Console */}
      {dispute.status === "OPEN" && (
        <div className="p-6 bg-[#0a1124] border-t border-[#1f2a48] space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase tracking-wider text-[#8a95b0] block">
              Administrative Ruling Audit Notes:
            </label>
            <input
              type="text"
              value={rulingNotes}
              onChange={(e) => setRulingNotes(e.target.value)}
              placeholder="e.g. Original harvest certificate verified. Transit humidity logged within normal limits."
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#111a33] border border-[#1f2a48] text-white focus:outline-none focus:border-[#f2e30b]"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              onClick={handleRuleBuyer}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-bold bg-[#e5262b] hover:bg-[#ff3b40] text-white shadow transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              {loading ? "Processing..." : "Rule in Favor of Buyer (Refund 100% Escrow)"}
            </button>

            <button
              onClick={handleRuleFarmer}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-bold bg-[#39ff88] hover:bg-[#5aff9d] text-black shadow transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {loading ? "Processing..." : "Rule in Favor of Farmer (Release Payout 97%)"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
