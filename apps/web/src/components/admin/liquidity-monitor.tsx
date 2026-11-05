"use client";

import { Wallet, ShieldCheck, ArrowDownLeft, DollarSign, Lock } from "lucide-react";

export interface SettlementLedgerEntry {
  id: string;
  cropAsset: string;
  buyer: string;
  farmer: string;
  amountKes: string;
  feeKes: string;
  farmerPayoutKes: string;
  status: string;
  stripeTransferId: string;
  timestamp: string;
}

const DEFAULT_LEDGER_ENTRIES: SettlementLedgerEntry[] = [
  {
    id: "tx-881",
    cropAsset: "White Maize (Lot #4501)",
    buyer: "KenAgro Grain Mills Ltd",
    farmer: "Kiprono Farms (Njoro)",
    amountKes: "1597500.00",
    feeKes: "47925.00",
    farmerPayoutKes: "1549575.00",
    status: "RELEASED_TO_FARMER",
    stripeTransferId: "tr_1P8x9L2eZvKYlo2CL1984a",
    timestamp: "2026-11-05 09:42 UTC",
  },
  {
    id: "tx-880",
    cropAsset: "Shangi Potatoes (Lot #4498)",
    buyer: "Nairobi Fresh Wholesalers",
    farmer: "Mwangi Family Agro (Molo)",
    amountKes: "1568000.00",
    feeKes: "47040.00",
    farmerPayoutKes: "1520960.00",
    status: "HELD_IN_ESCROW",
    stripeTransferId: "pi_3Q9m8X4fZvKYlo2CM2041b",
    timestamp: "2026-11-05 08:15 UTC",
  },
  {
    id: "tx-879",
    cropAsset: "Rosecoco Beans (Lot #4492)",
    buyer: "Rift Valley Food Processors",
    farmer: "Achieng Produce (Subukia)",
    amountKes: "1380000.00",
    feeKes: "41400.00",
    farmerPayoutKes: "1338600.00",
    status: "RELEASED_TO_FARMER",
    stripeTransferId: "tr_1P8x1K9eZvKYlo2CK7892z",
    timestamp: "2026-11-04 17:30 UTC",
  },
];

export function LiquidityMonitor() {
  return (
    <div className="space-y-6 font-sans">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#111a33] border border-[#1f2a48] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8a95b0]">
            <span>Platform Escrow Balance</span>
            <div className="p-1 rounded bg-[#f2e30b]/10 text-[#f2e30b]">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-white">KES 4,545,500.00</div>
          <p className="text-[11px] text-[#8a95b0]">Held in Stripe balance pending delivery</p>
        </div>

        <div className="p-4 rounded-xl bg-[#111a33] border border-[#1f2a48] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8a95b0]">
            <span>Active Escrow Holds</span>
            <div className="p-1 rounded bg-cyan-400/10 text-cyan-400">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-cyan-400">18 Active Lots</div>
          <p className="text-[11px] text-[#8a95b0]">Nakuru &amp; Rift Valley transit shipments</p>
        </div>

        <div className="p-4 rounded-xl bg-[#111a33] border border-[#1f2a48] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8a95b0]">
            <span>Farmer Payouts Settled (97%)</span>
            <div className="p-1 rounded bg-[#39ff88]/10 text-[#39ff88]">
              <ArrowDownLeft className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-[#39ff88]">KES 24,850,000.00</div>
          <p className="text-[11px] text-[#8a95b0]">Automated Stripe transfers completed</p>
        </div>

        <div className="p-4 rounded-xl bg-[#111a33] border border-[#1f2a48] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8a95b0]">
            <span>SokoYield Protocol Revenue (3%)</span>
            <div className="p-1 rounded bg-[#f2e30b]/10 text-[#f2e30b]">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-[#f2e30b]">KES 768,550.00</div>
          <p className="text-[11px] text-[#8a95b0]">Platform transaction fees retained</p>
        </div>
      </div>

      {/* Double-Entry Escrow Audit Ledger Table */}
      <div className="bg-[#111a33] border border-[#1f2a48] rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-[#1f2a48] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#39ff88]" />
            <h3 className="text-sm font-semibold text-white">Stripe Connect Escrow Settlement Ledger</h3>
          </div>
          <span className="text-xs font-mono text-[#8a95b0]">Manual Payouts Enabled</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a1124] text-[#8a95b0] uppercase font-mono tracking-wider text-[10px] border-b border-[#1f2a48]">
              <tr>
                <th className="py-3 px-4">Transaction &amp; Lot</th>
                <th className="py-3 px-4">Payer (Buyer)</th>
                <th className="py-3 px-4">Payee (Farmer)</th>
                <th className="py-3 px-4">Gross Trade</th>
                <th className="py-3 px-4">Farmer Payout (97%)</th>
                <th className="py-3 px-4">Platform Fee (3%)</th>
                <th className="py-3 px-4">Stripe Reference</th>
                <th className="py-3 px-4 text-right">Escrow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2a48]">
              {DEFAULT_LEDGER_ENTRIES.map((entry) => (
                <tr key={entry.id} className="hover:bg-[#15203f]/50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-white">
                    <div>{entry.cropAsset}</div>
                    <div className="text-[10px] text-[#8a95b0] font-mono">{entry.timestamp}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[#e6ebf5]">{entry.buyer}</td>
                  <td className="py-3.5 px-4 text-[#e6ebf5]">{entry.farmer}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    KES {Number(entry.amountKes).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#39ff88]">
                    KES {Number(entry.farmerPayoutKes).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#f2e30b]">
                    KES {Number(entry.feeKes).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-[#8a95b0]">
                    {entry.stripeTransferId}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {entry.status === "RELEASED_TO_FARMER" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#39ff88]/15 text-[#39ff88] border border-[#39ff88]/30">
                        Released
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#f2e30b]/15 text-[#f2e30b] border border-[#f2e30b]/30">
                        Held in Escrow
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
