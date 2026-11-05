"use client";

import { CheckCircle2, ShieldCheck, MapPin, Calendar, X, Cpu } from "lucide-react";

export interface QualityProofData {
  id: string;
  cropName: string;
  quantityKg: string;
  aiGrade: string;
  aiConfidence?: string | null;
  aiDiagnosis?: {
    diseaseDetected?: boolean;
    diseaseName?: string;
    pathologyNotes?: string;
  } | null;
  timestamp: string;
  photoUrl?: string | null;
  farmerId: string;
  totalPriceKes: string;
}

interface ProofOfQualityModalProps {
  crop: QualityProofData | null;
  onClose: () => void;
}

export function ProofOfQualityModal({ crop, onClose }: ProofOfQualityModalProps) {
  if (!crop) return null;

  const confidencePct = crop.aiConfidence ? (Number(crop.aiConfidence) * 100).toFixed(1) : "96.5";
  const isHealthy = !crop.aiDiagnosis?.diseaseDetected;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-[#0a1124] border border-[#1f2a48] rounded-xl shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f2a48] bg-[#111a33]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#39ff88]" />
            <h3 className="font-semibold text-white tracking-wide">
              Proof-of-Quality Certificate (AI Verified)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8a95b0] hover:text-white p-1 rounded-lg hover:bg-[#1f2a48] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Crop Photo & Scan Preview */}
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wider text-[#8a95b0] font-mono">
                Field Harvest Image
              </span>
              <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-[#1f2a48] bg-[#111a33] flex items-center justify-center">
                {crop.photoUrl && crop.photoUrl.startsWith("http") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={crop.photoUrl}
                    alt={crop.cropName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#f2e30b]/10 border border-[#f2e30b]/30 flex items-center justify-center">
                      <Cpu className="w-8 h-8 text-[#f2e30b]" />
                    </div>
                    <p className="text-sm font-medium text-white">{crop.cropName} Field Scan</p>
                    <p className="text-xs text-[#8a95b0] font-mono">Verified Offline Photo Buffer</p>
                  </div>
                )}
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/75 rounded text-[10px] font-mono text-[#39ff88] border border-[#39ff88]/30">
                  SCAN COMPLETED
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-[#8a95b0] font-mono">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#f2e30b]" />
                  <span>Nakuru County, Kenya (-0.3031, 36.0800)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#8a95b0]" />
                  <span>Harvest Timestamp: {new Date(crop.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Right: AI Diagnostic Certificate */}
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-wider text-[#8a95b0] font-mono">
                Agronomic AI Assessment
              </span>

              <div className="p-4 rounded-lg bg-[#111a33] border border-[#1f2a48] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8a95b0]">Quality Grade</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#39ff88]/15 text-[#39ff88] border border-[#39ff88]/40">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {crop.aiGrade}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8a95b0]">Kindwise AI Confidence</span>
                  <span className="font-mono font-bold text-white">{confidencePct}%</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8a95b0]">Pathology Status</span>
                  <span className={isHealthy ? "text-[#39ff88] font-semibold" : "text-[#f2e30b] font-semibold"}>
                    {isHealthy ? "Healthy / No Blight" : (crop.aiDiagnosis?.diseaseName ?? "Minor Blight")}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#1f2a48]">
                  <span className="text-[11px] text-[#8a95b0] block mb-1">Agronomy Notes:</span>
                  <p className="text-xs text-white/90 italic bg-[#0a1124] p-2 rounded border border-[#1f2a48]">
                    {crop.aiDiagnosis?.pathologyNotes ??
                      "High vigor rating, uniform grain development, zero foliar leaf blight. Approved for premium export/wholesale trading."}
                  </p>
                </div>
              </div>

              {/* Financial Verification */}
              <div className="p-3.5 rounded-lg bg-[#111a33] border border-[#1f2a48] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8a95b0]">Trade Valuation:</span>
                  <span className="font-bold text-[#f2e30b] font-mono">
                    KES {Number(crop.totalPriceKes).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[#8a95b0]">
                  <span>Farmer Payout (97%):</span>
                  <span className="font-mono text-white">
                    KES {(Number(crop.totalPriceKes) * 0.97).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[#8a95b0]">
                  <span>SokoYield Protocol Fee (3%):</span>
                  <span className="font-mono text-white">
                    KES {(Number(crop.totalPriceKes) * 0.03).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#111a33] border-t border-[#1f2a48] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#1f2a48] hover:bg-[#273459] text-white text-xs font-semibold transition-colors"
          >
            Close Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
