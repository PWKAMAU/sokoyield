"use client";

import { useState } from "react";
import { CheckCircle2, Lock, ArrowUpRight, Award, Shield } from "lucide-react";
import { ProofOfQualityModal, type QualityProofData } from "./proof-of-quality-modal";

export interface OrderItem {
  id: string;
  cropName: string;
  quantityKg: string;
  unitPriceKes: string;
  totalPriceKes: string;
  aiGrade: string;
  aiConfidence?: string;
  escrowStatus: string;
  farmerId: string;
  location: string;
  timestamp: string;
  photoUrl?: string;
}

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: "ord-1",
    cropName: "White Maize (Grade A)",
    quantityKg: "45000",
    unitPriceKes: "35.50",
    totalPriceKes: "1597500.00",
    aiGrade: "GRADE_A",
    aiConfidence: "0.982",
    escrowStatus: "PENDING_DEPOSIT",
    farmerId: "frm-nakuru-001",
    location: "Njoro, Nakuru County",
    timestamp: new Date().toISOString(),
  },
  {
    id: "ord-2",
    cropName: "Shangi Potatoes",
    quantityKg: "28000",
    unitPriceKes: "56.00",
    totalPriceKes: "1568000.00",
    aiGrade: "GRADE_A",
    aiConfidence: "0.954",
    escrowStatus: "HELD_IN_ESCROW",
    farmerId: "frm-nakuru-004",
    location: "Molo, Nakuru County",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "ord-3",
    cropName: "Rosecoco Beans",
    quantityKg: "12000",
    unitPriceKes: "115.00",
    totalPriceKes: "1380000.00",
    aiGrade: "GRADE_B",
    aiConfidence: "0.891",
    escrowStatus: "DELIVERED_PENDING_CONFIRMATION",
    farmerId: "frm-nakuru-008",
    location: "Subukia, Nakuru County",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "ord-4",
    cropName: "Yellow Maize",
    quantityKg: "18500",
    unitPriceKes: "33.00",
    totalPriceKes: "610500.00",
    aiGrade: "GRADE_A",
    aiConfidence: "0.970",
    escrowStatus: "RELEASED_TO_FARMER",
    farmerId: "frm-nakuru-012",
    location: "Rongai, Nakuru County",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
];

export function OrderBook() {
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [inspectingCrop, setInspectingCrop] = useState<QualityProofData | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleDepositEscrow = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      // Simulate escrow hold
      await new Promise((r) => setTimeout(r, 600));
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, escrowStatus: "HELD_IN_ESCROW" }
            : o,
        ),
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReleasePayout = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      // Simulate payout release to farmer
      await new Promise((r) => setTimeout(r, 600));
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, escrowStatus: "RELEASED_TO_FARMER" }
            : o,
        ),
      );
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_DEPOSIT":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#8a95b0]/15 text-[#8a95b0] border border-[#8a95b0]/30">
            Pending Deposit
          </span>
        );
      case "HELD_IN_ESCROW":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#f2e30b]/15 text-[#f2e30b] border border-[#f2e30b]/30">
            <Lock className="w-3 h-3" />
            Held in Escrow
          </span>
        );
      case "DELIVERED_PENDING_CONFIRMATION":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            Delivered (Pending Release)
          </span>
        );
      case "RELEASED_TO_FARMER":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#39ff88]/15 text-[#39ff88] border border-[#39ff88]/30">
            <CheckCircle2 className="w-3 h-3" />
            Released (Settled)
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="bg-[#111a33] border border-[#1f2a48] rounded-xl overflow-hidden shadow-lg font-sans">
      <div className="p-4 border-b border-[#1f2a48] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#f2e30b]" />
          <h3 className="text-sm font-semibold text-white">Live Commodity Order Book</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8a95b0] font-mono">
            {orders.length} Harvest Lots Available
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0a1124] text-[#8a95b0] uppercase font-mono tracking-wider text-[10px] border-b border-[#1f2a48]">
            <tr>
              <th className="py-3 px-4">Produce &amp; Lot</th>
              <th className="py-3 px-4">AI Quality Grade</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Price (KES)</th>
              <th className="py-3 px-4">Total Value</th>
              <th className="py-3 px-4">Escrow State</th>
              <th className="py-3 px-4 text-right">Settlement Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f2a48]">
            {orders.map((ord) => (
              <tr key={ord.id} className="hover:bg-[#15203f]/50 transition-colors">
                <td className="py-3.5 px-4 font-medium text-white">
                  <div>{ord.cropName}</div>
                  <div className="text-[10px] text-[#8a95b0] font-mono">{ord.location}</div>
                </td>
                <td className="py-3.5 px-4">
                  <button
                    onClick={() =>
                      setInspectingCrop({
                        id: ord.id,
                        cropName: ord.cropName,
                        quantityKg: ord.quantityKg,
                        aiGrade: ord.aiGrade,
                        aiConfidence: ord.aiConfidence,
                        timestamp: ord.timestamp,
                        farmerId: ord.farmerId,
                        totalPriceKes: ord.totalPriceKes,
                      })
                    }
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#39ff88]/15 text-[#39ff88] border border-[#39ff88]/30 hover:bg-[#39ff88]/25 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {ord.aiGrade}
                    <ArrowUpRight className="w-2.5 h-2.5 opacity-60" />
                  </button>
                </td>
                <td className="py-3.5 px-4 font-mono text-[#e6ebf5]">
                  {(Number(ord.quantityKg) / 1000).toFixed(1)} MT ({ord.quantityKg} kg)
                </td>
                <td className="py-3.5 px-4 font-mono text-[#e6ebf5]">
                  KES {Number(ord.unitPriceKes).toFixed(2)}/kg
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-[#f2e30b]">
                  KES {Number(ord.totalPriceKes).toLocaleString()}
                </td>
                <td className="py-3.5 px-4">{getStatusBadge(ord.escrowStatus)}</td>
                <td className="py-3.5 px-4 text-right">
                  {ord.escrowStatus === "PENDING_DEPOSIT" && (
                    <button
                      onClick={() => handleDepositEscrow(ord.id)}
                      disabled={actionLoading === ord.id}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-[#f2e30b] hover:bg-[#ffe81a] text-black shadow transition-all cursor-pointer disabled:opacity-50"
                    >
                      {actionLoading === ord.id ? "Holding..." : "Deposit Escrow"}
                    </button>
                  )}
                  {(ord.escrowStatus === "HELD_IN_ESCROW" ||
                    ord.escrowStatus === "DELIVERED_PENDING_CONFIRMATION") && (
                    <button
                      onClick={() => handleReleasePayout(ord.id)}
                      disabled={actionLoading === ord.id}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-[#39ff88] hover:bg-[#52ffa4] text-black shadow transition-all cursor-pointer disabled:opacity-50"
                    >
                      {actionLoading === ord.id ? "Releasing..." : "Confirm Delivery & Release"}
                    </button>
                  )}
                  {ord.escrowStatus === "RELEASED_TO_FARMER" && (
                    <span className="text-[11px] font-mono text-[#39ff88] flex items-center justify-end gap-1">
                      <Shield className="w-3 h-3" /> Settled (97% Farmer / 3% Fee)
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProofOfQualityModal crop={inspectingCrop} onClose={() => setInspectingCrop(null)} />
    </div>
  );
}
