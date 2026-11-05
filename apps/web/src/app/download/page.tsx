"use client";

import Link from "next/link";
import {
  Download,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Shield,
  Layers,
  Cpu,
} from "lucide-react";

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[#0a1124] text-[#e6ebf5] flex flex-col font-sans selection:bg-[#f2e30b] selection:text-black">
      {/* Top Header */}
      <header className="border-b border-[#1f2a48] bg-[#0a1124]/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <h1 className="text-xl font-black tracking-tight flex items-center">
              <span className="text-[#39ff88]">Soko</span>
              <span className="text-[#f2e30b]">Yield</span>
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#111a33] text-[#39ff88] border border-[#39ff88]/30">
              Farmer Mobile Client
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#111a33] hover:bg-[#1f2a48] text-[#8a95b0] hover:text-white border border-[#1f2a48] transition-colors"
            >
              Buyer SaaS Terminal
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#111a33] hover:bg-[#1f2a48] text-[#e5262b] border border-[#1f2a48] transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#e5262b]" />
              <span>Admin Control Room</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-[#111a33] text-[#39ff88] border border-[#39ff88]/30 mb-4">
            <Cpu className="w-3.5 h-3.5 text-[#39ff88]" />
            Cyber-Agronomy Engine · Android 16 (API 36) Ready
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
            Download <span className="text-[#39ff88]">SokoYield</span> for Android
          </h2>
          <p className="text-sm sm:text-base text-[#8a95b0]">
            The offline-first agricultural fintech app for Nakuru County farmers. Scan crops without
            internet, receive AI quality certificates, and get guaranteed escrow payouts.
          </p>
        </div>

        {/* Download Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Card 1: Direct APK Download */}
          <div className="rounded-xl border-2 border-[#39ff88] bg-[#111a33]/80 p-6 flex flex-col justify-between relative overflow-hidden shadow-lg shadow-[#39ff88]/10">
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#39ff88] text-black">
                Recommended for Testers
              </span>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#39ff88]/10 border border-[#39ff88]/30 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-[#39ff88]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Direct Android APK</h3>
                  <p className="text-xs text-[#8a95b0]">Version 1.0.0 · Release Build · 151 MB</p>
                </div>
              </div>

              <p className="text-xs text-[#8a95b0] mb-6 leading-relaxed">
                Direct manual installer package. Includes the offline Isar database, Kindwise AI
                pipeline scanner, and Nakuru GPS boundary tracker.
              </p>

              <div className="space-y-2 mb-6 text-xs text-[#e6ebf5]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39ff88]" />
                  <span>No Play Store login required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39ff88]" />
                  <span>Offline-first local image queue enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39ff88]" />
                  <span>Built for Android 16 (API 36 baseline)</span>
                </div>
              </div>
            </div>

            <a
              href="/api/download"
              download="sokoyield-v1.0.0-nakuru.apk"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg bg-[#39ff88] hover:bg-[#32e078] text-black font-bold text-sm tracking-wide transition-all shadow-md active:scale-[0.99]"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download Direct APK (.apk)</span>
            </a>
          </div>

          {/* Card 2: Google Play Closed Testing */}
          <div className="rounded-xl border border-[#1f2a48] bg-[#111a33]/60 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#f2e30b]/10 border border-[#f2e30b]/30 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-[#f2e30b]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Google Play Closed Track</h3>
                  <p className="text-xs text-[#8a95b0]">Official Alpha Track · Play Integrity Protected</p>
                </div>
              </div>

              <p className="text-xs text-[#8a95b0] mb-6 leading-relaxed">
                For registered closed testers including <span className="font-mono text-[#f2e30b]">pitakamau18@gmail.com</span>.
                Updates automatically via Google Play Store.
              </p>

              <div className="space-y-2 mb-6 text-xs text-[#e6ebf5]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#f2e30b]" />
                  <span>Play Integrity Anti-Tamper verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#f2e30b]" />
                  <span>Compliant with 14-day 20-tester testing rule</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#f2e30b]" />
                  <span>Automatic background OTA app updates</span>
                </div>
              </div>
            </div>

            <a
              href="https://play.google.com/apps/testing/com.sokoyield.sokoyield_mobile"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg bg-[#1a2649] hover:bg-[#23335e] text-white font-bold text-sm tracking-wide border border-[#1f2a48] transition-all active:scale-[0.99]"
            >
              <span>Join Play Store Closed Test</span>
              <ExternalLink className="w-4 h-4 text-[#8a95b0]" />
            </a>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="rounded-xl border border-[#1f2a48] bg-[#111a33]/40 p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#39ff88]" />
            Manual APK Installation Instructions (Android)
          </h3>
          <ol className="space-y-3 text-xs text-[#8a95b0]">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#1f2a48] text-white font-mono flex items-center justify-center shrink-0 text-[10px]">
                1
              </span>
              <span>
                Click the <strong className="text-white">Download Direct APK</strong> button above to save the installer file on your Android smartphone.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#1f2a48] text-white font-mono flex items-center justify-center shrink-0 text-[10px]">
                2
              </span>
              <span>
                When prompted by Android or Chrome, select <strong className="text-white">&quot;Install anyway&quot;</strong> or enable <strong className="text-white">&quot;Install unknown apps&quot;</strong> for your browser in Settings.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#1f2a48] text-white font-mono flex items-center justify-center shrink-0 text-[10px]">
                3
              </span>
              <span>
                Open SokoYield. Grant <strong className="text-white">Camera</strong> and <strong className="text-white">Location (GPS)</strong> permissions so the Cyber-Scanner can verify your Nakuru County farm plot coordinates.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#1f2a48] text-white font-mono flex items-center justify-center shrink-0 text-[10px]">
                4
              </span>
              <span>
                You can now scan crops even without an active data connection. Scans are saved in the offline Isar queue and automatically sync once network is restored!
              </span>
            </li>
          </ol>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1f2a48] bg-[#0a1124] py-6 text-center text-xs text-[#8a95b0]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>&copy; 2026 SokoYield Technologies. Nakuru County, Kenya.</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-white transition-colors">
              Buyer SaaS Terminal
            </Link>
            <Link href="/admin" className="hover:text-white transition-colors">
              Admin Control Room
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
