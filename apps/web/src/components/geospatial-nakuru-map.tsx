"use client";

import { Satellite, ShieldAlert } from "lucide-react";
import { useState } from "react";

interface SubCountyPlot {
  name: string;
  majorCrops: string;
  activePlots: number;
  estYieldTons: number;
  weatherRisk: "NORMAL" | "ALERT";
  coordinates: [number, number];
}

const NAKURU_SUB_COUNTIES: SubCountyPlot[] = [
  { name: "Njoro Sub-County", majorCrops: "Maize, Wheat, Beans", activePlots: 142, estYieldTons: 3850, weatherRisk: "NORMAL", coordinates: [-0.34, 35.94] },
  { name: "Molo Sub-County", majorCrops: "Potatoes, Pyrethrum, Peas", activePlots: 188, estYieldTons: 4200, weatherRisk: "ALERT", coordinates: [-0.25, 35.73] },
  { name: "Rongai Sub-County", majorCrops: "Maize, Sorghum", activePlots: 95, estYieldTons: 2100, weatherRisk: "ALERT", coordinates: [-0.17, 35.86] },
  { name: "Naivasha Sub-County", majorCrops: "Horticulture, Vegetables", activePlots: 110, estYieldTons: 2900, weatherRisk: "NORMAL", coordinates: [-0.71, 36.43] },
  { name: "Subukia Sub-County", majorCrops: "Coffee, Maize, Beans", activePlots: 74, estYieldTons: 1650, weatherRisk: "NORMAL", coordinates: [0.01, 36.24] },
];

export function GeospatialNakuruMap() {
  const [selectedSubCounty, setSelectedSubCounty] = useState<SubCountyPlot>(NAKURU_SUB_COUNTIES[0]);

  return (
    <div className="bg-[#111a33] border border-[#1f2a48] rounded-xl overflow-hidden shadow-lg font-sans">
      <div className="p-4 border-b border-[#1f2a48] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Satellite className="w-4 h-4 text-[#39ff88]" />
          <h3 className="text-sm font-semibold text-white">Nakuru County Geospatial Harvest Grid</h3>
        </div>
        <span className="text-[11px] font-mono text-[#8a95b0] bg-[#0a1124] px-2 py-0.5 rounded border border-[#1f2a48]">
          EPSG:4326 | WGS84
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Interactive SVG stylized county plot map */}
        <div className="relative aspect-16/9 bg-[#0a1124] rounded-lg border border-[#1f2a48] overflow-hidden flex items-center justify-center p-4">
          {/* Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2a4815_1px,transparent_1px),linear-gradient(to_bottom,#1f2a4815_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* Nakuru County Boundary Outline Stylization */}
          <svg className="w-full h-full max-w-sm" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* County Boundary Polygon */}
            <polygon
              points="120,40 260,30 340,90 370,210 290,270 170,260 70,190 60,110"
              fill="#111a33"
              stroke="#39ff88"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              className="opacity-75"
            />
            {/* Lake Nakuru marker */}
            <ellipse cx="210" cy="155" rx="22" ry="38" fill="#1f2a48" stroke="#39ff88" strokeWidth="0.8" opacity="0.6" />
            <text x="180" y="160" fill="#8a95b0" fontSize="10" fontFamily="monospace">Lake Nakuru</text>

            {/* Sub-county plot pins */}
            {NAKURU_SUB_COUNTIES.map((sub, idx) => {
              const coords = [
                { x: 170, y: 175 }, // Njoro
                { x: 105, y: 140 }, // Molo
                { x: 150, y: 95 },  // Rongai
                { x: 310, y: 220 }, // Naivasha
                { x: 260, y: 65 },  // Subukia
              ][idx];

              const isSelected = selectedSubCounty.name === sub.name;

              return (
                <g
                  key={sub.name}
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setSelectedSubCounty(sub)}
                >
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={isSelected ? "9" : "6"}
                    fill={isSelected ? "#f2e30b" : sub.weatherRisk === "ALERT" ? "#e5262b" : "#39ff88"}
                    stroke="#0a1124"
                    strokeWidth="2"
                  />
                  {isSelected && (
                    <circle cx={coords.x} cy={coords.y} r="14" stroke="#f2e30b" strokeWidth="1" strokeDasharray="2 2" className="animate-spin" />
                  )}
                  <text
                    x={coords.x + 12}
                    y={coords.y + 4}
                    fill={isSelected ? "#f2e30b" : "#e6ebf5"}
                    fontSize="11"
                    fontFamily="sans-serif"
                    fontWeight={isSelected ? "bold" : "normal"}
                  >
                    {sub.name.replace(" Sub-County", "")}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Active Alert Flag Overlay */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-[#e5262b]/20 border border-[#e5262b]/40 rounded text-[10px] text-[#e5262b] font-mono">
            <ShieldAlert className="w-3 h-3" />
            <span>Pest Alert: Desert Locust active in Rongai &amp; Molo</span>
          </div>
        </div>

        {/* Selected Area Details Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded bg-[#0a1124] border border-[#1f2a48]">
            <span className="text-[10px] text-[#8a95b0] block">Selected Zone</span>
            <span className="font-semibold text-white text-xs truncate block">{selectedSubCounty.name}</span>
          </div>
          <div className="p-2.5 rounded bg-[#0a1124] border border-[#1f2a48]">
            <span className="text-[10px] text-[#8a95b0] block">Active Plots</span>
            <span className="font-bold text-[#f2e30b] font-mono">{selectedSubCounty.activePlots} verified farms</span>
          </div>
          <div className="p-2.5 rounded bg-[#0a1124] border border-[#1f2a48]">
            <span className="text-[10px] text-[#8a95b0] block">Est. Yield</span>
            <span className="font-bold text-[#39ff88] font-mono">{selectedSubCounty.estYieldTons.toLocaleString()} tons</span>
          </div>
          <div className="p-2.5 rounded bg-[#0a1124] border border-[#1f2a48]">
            <span className="text-[10px] text-[#8a95b0] block">Primary Crops</span>
            <span className="font-medium text-white truncate block">{selectedSubCounty.majorCrops}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
