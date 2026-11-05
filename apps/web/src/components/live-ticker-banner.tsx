"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { TrendingUp, TrendingDown, Radio } from "lucide-react";

export interface CommodityTick {
  id: string;
  commodity: string;
  priceKes: string;
  changePct: string;
  volumeBags: number;
  marketLocation: string;
}

const DEFAULT_TICKS: CommodityTick[] = [
  { id: "1", commodity: "Maize", priceKes: "3200.00", changePct: "+2.10", volumeBags: 1450, marketLocation: "Nakuru Central Market" },
  { id: "2", commodity: "Potatoes", priceKes: "2800.00", changePct: "-0.50", volumeBags: 920, marketLocation: "Nakuru Central Market" },
  { id: "3", commodity: "Beans", priceKes: "6400.00", changePct: "+1.40", volumeBags: 680, marketLocation: "Nakuru Central Market" },
  { id: "4", commodity: "Wheat", priceKes: "4100.00", changePct: "+0.80", volumeBags: 1100, marketLocation: "Nakuru Central Market" },
];

export function LiveTickerBanner() {
  const [ticks, setTicks] = useState<CommodityTick[]>(DEFAULT_TICKS);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    
    // Fetch initial prices
    fetch(`${apiUrl}/api/v1/ticker/latest`)
      .then((res) => res.json())
      .then((data) => {
        if (data.prices && data.prices.length > 0) {
          setTicks(data.prices);
        }
      })
      .catch(() => {});

    // Connect to WebSocket ticker namespace
    let socket: Socket | null = null;
    try {
      socket = io(`${apiUrl}/ticker`, {
        transports: ["websocket", "polling"],
        timeout: 4000,
      });

      socket.on("connect", () => {
        setIsConnected(true);
        socket?.emit("subscribe_market");
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
      });

      socket.on("connect_error", () => {
        setIsConnected(false);
      });

      socket.on("ticker_update", (tick: CommodityTick) => {
        setTicks((prev) => {
          const index = prev.findIndex((p) => p.commodity === tick.commodity);
          if (index >= 0) {
            const next = [...prev];
            next[index] = tick;
            return next;
          }
          return [...prev, tick];
        });
      });
    } catch {
      // socket init error
    }

    return () => {
      socket?.disconnect();
    };
  }, []);

  return (
    <div className="w-full bg-[#111a33] border-y border-[#1f2a48] px-4 py-2.5 flex items-center justify-between overflow-x-auto shadow-inner text-xs">
      <div className="flex items-center gap-2 pr-4 border-r border-[#1f2a48] shrink-0 font-mono">
        <Radio className={`w-3.5 h-3.5 ${isConnected ? "text-[#39ff88] animate-pulse" : "text-[#8a95b0]"}`} />
        <span className="uppercase tracking-wider font-semibold text-[#8a95b0]">
          {isConnected ? "LIVE TICKER STREAM" : "MARKET SNAPSHOT"}
        </span>
      </div>

      <div className="flex items-center gap-6 overflow-x-auto px-4 scrollbar-none font-mono">
        {ticks.map((t) => {
          const isPositive = !t.changePct.startsWith("-");
          return (
            <div key={t.commodity} className="flex items-center gap-2 shrink-0">
              <span className="font-semibold text-white">{t.commodity}:</span>
              <span className="text-[#f2e30b] font-bold">
                KES {Number(t.priceKes).toLocaleString()}/bag
              </span>
              <span
                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  isPositive
                    ? "bg-[#39ff88]/15 text-[#39ff88] border border-[#39ff88]/30"
                    : "bg-[#e5262b]/15 text-[#e5262b] border border-[#e5262b]/30"
                }`}
              >
                {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                {t.changePct}%
              </span>
              <span className="text-[10px] text-[#8a95b0]">({t.volumeBags} bags)</span>
            </div>
          );
        })}
      </div>

      <div className="hidden lg:flex items-center gap-1.5 pl-4 border-l border-[#1f2a48] shrink-0 text-[#8a95b0] text-[11px]">
        <span>Hub:</span>
        <span className="text-white font-medium">Nakuru Central Exchange</span>
      </div>
    </div>
  );
}
