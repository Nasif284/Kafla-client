"use client";

import React, { useState } from "react";
import {
  Layers,
  ExternalLink,
  CheckCircle2,
  Navigation,
  Plus,
  Minus,
  Compass,
} from "lucide-react";

interface StaticMapCanvasPreviewProps {
  activeStopNumber?: number;
  onSelectStop?: (stopNumber: number) => void;
}

export const StaticMapCanvasPreview: React.FC<StaticMapCanvasPreviewProps> = ({
  activeStopNumber = 2,
  onSelectStop,
}) => {
  const [isSatellite, setIsSatellite] = useState(false);

  return (
    <div className="relative w-full h-[420px] sm:h-[480px] rounded-2xl overflow-hidden border border-[#bec9c3]/35 shadow-inner select-none">
      {/* Background: Satellite Photo vs Realistic Vector Roadmap */}
      {isSatellite ? (
        <div className="absolute inset-0 bg-[#16221c]">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
            alt="Satellite Mountain Terrain"
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px]" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[#eef2ee]">
          {/* Subtle Google Maps Grid Texture */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8e2_1px,transparent_1px),linear-gradient(to_bottom,#e2e8e2_1px,transparent_1px)] bg-[size:32px_32px] opacity-70" />
        </div>
      )}

      {/* SVG Map Canvas with Real Road Networks, River, and Elevation Contours */}
      <svg
        viewBox="0 0 600 420"
        className="absolute inset-0 w-full h-full pointer-events-auto"
        preserveAspectRatio="xMidYMid slice"
      >
        {!isSatellite && (
          <>
            {/* Mountain Contour Zones */}
            <path
              d="M 0,0 Q 150,80 300,40 T 600,60 L 600,0 Z"
              fill="#e3ebe4"
              opacity="0.8"
            />
            <path
              d="M 350,180 Q 450,100 600,140 L 600,350 Q 480,280 350,180 Z"
              fill="#e1eae2"
              opacity="0.85"
            />
            <path
              d="M 0,220 Q 120,260 200,380 L 0,420 Z"
              fill="#e4ece5"
              opacity="0.75"
            />

            {/* Beas River (Blue winding river) */}
            <path
              d="M 50,420 C 100,350 140,290 180,240 C 230,180 270,160 330,120 C 390,80 440,60 520,30"
              fill="none"
              stroke="#b5d9ee"
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0.9"
            />
            <text x="70" y="380" fill="#7ba8c2" fontSize="9" fontWeight="600" transform="rotate(-40 70 380)">
              Beas River
            </text>

            {/* Secondary Road Network */}
            <path
              d="M 20,290 Q 110,280 180,240 Q 220,280 280,360"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.9"
            />
            <path
              d="M 270,170 Q 320,230 420,260"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.9"
            />
            <path
              d="M 430,95 Q 490,160 580,200"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* Highway NH-3 Base Road Layer */}
            <path
              d="M 120,320 Q 180,260 270,170 Q 340,135 390,115 L 430,95 Q 470,80 500,70"
              fill="none"
              stroke="#ffffff"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}

        {/* Driving Route Polyline (White Border + Rich Emerald Driving Line) */}
        <path
          d="M 120,320 Q 180,260 270,170 Q 340,135 390,115"
          fill="none"
          stroke="#005440"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Atal Tunnel Section (Dashed Highway Passage) */}
        <path
          d="M 390,115 L 430,95"
          fill="none"
          stroke="#0f6e56"
          strokeWidth="5"
          strokeDasharray="6 4"
          strokeLinecap="round"
        />

        {/* Post-Tunnel Route to Sissu */}
        <path
          d="M 430,95 Q 470,80 500,70"
          fill="none"
          stroke="#005440"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Highway Badge */}
        <rect x="200" y="222" width="28" height="14" rx="3" fill="#ffffff" stroke="#6f7a74" strokeWidth="1" />
        <text x="205" y="233" fill="#181d1a" fontSize="8" fontWeight="bold">NH 3</text>

        {/* Town / Mountain Area Labels */}
        <text x="65" y="335" fill={isSatellite ? "#e0e3e0" : "#476459"} fontSize="11" fontWeight="700">Old Manali</text>
        <text x="210" y="165" fill={isSatellite ? "#e0e3e0" : "#476459"} fontSize="11" fontWeight="700">Solang Valley</text>
        <text x="350" y="98" fill={isSatellite ? "#e0e3e0" : "#476459"} fontSize="10" fontWeight="700">Atal Tunnel (9.02 km)</text>
        <text x="495" y="55" fill={isSatellite ? "#e0e3e0" : "#476459"} fontSize="11" fontWeight="700">Sissu Valley</text>

        {/* STOP 1 PIN: Old Manali */}
        <g
          className="cursor-pointer group"
          onClick={() => onSelectStop && onSelectStop(1)}
          transform="translate(120, 320)"
        >
          <ellipse cx="0" cy="4" rx="8" ry="4" fill="rgba(0,0,0,0.25)" />
          <path d="M 0,-24 C -8,-24 -12,-18 -12,-11 C -12,-2 0,4 0,4 C 0,4 12,-2 12,-11 C 12,-18 8,-24 0,-24 Z" fill="#005440" />
          <circle cx="0" cy="-13" r="5" fill="#ffffff" />
          <text x="0" y="-10" textAnchor="middle" fill="#005440" fontSize="8" fontWeight="bold">1</text>
        </g>

        {/* STOP 3 PIN: Atal Tunnel */}
        <g
          className="cursor-pointer group"
          onClick={() => onSelectStop && onSelectStop(3)}
          transform="translate(390, 115)"
        >
          <ellipse cx="0" cy="4" rx="8" ry="4" fill="rgba(0,0,0,0.25)" />
          <path d="M 0,-24 C -8,-24 -12,-18 -12,-11 C -12,-2 0,4 0,4 C 0,4 12,-2 12,-11 C 12,-18 8,-24 0,-24 Z" fill="#005440" />
          <circle cx="0" cy="-13" r="5" fill="#ffffff" />
          <text x="0" y="-10" textAnchor="middle" fill="#005440" fontSize="8" fontWeight="bold">3</text>
        </g>

        {/* STOP 4 PIN: Sissu Waterfall */}
        <g
          className="cursor-pointer group"
          onClick={() => onSelectStop && onSelectStop(4)}
          transform="translate(500, 70)"
        >
          <ellipse cx="0" cy="4" rx="8" ry="4" fill="rgba(0,0,0,0.25)" />
          <path d="M 0,-24 C -8,-24 -12,-18 -12,-11 C -12,-2 0,4 0,4 C 0,4 12,-2 12,-11 C 12,-18 8,-24 0,-24 Z" fill="#005440" />
          <circle cx="0" cy="-13" r="5" fill="#ffffff" />
          <text x="0" y="-10" textAnchor="middle" fill="#005440" fontSize="8" fontWeight="bold">4</text>
        </g>

        {/* STOP 2 PIN (ACTIVE): Solang Valley with Pulsing Ring */}
        <g
          className="cursor-pointer"
          onClick={() => onSelectStop && onSelectStop(2)}
          transform="translate(270, 170)"
        >
          <circle cx="0" cy="0" r="14" fill="#a0f3d4" opacity="0.6" className="animate-ping" />
          <circle cx="0" cy="0" r="8" fill="#005440" opacity="0.3" />
          <ellipse cx="0" cy="6" rx="10" ry="5" fill="rgba(0,0,0,0.3)" />
          <path d="M 0,-28 C -10,-28 -15,-21 -15,-13 C -15,-3 0,6 0,6 C 0,6 15,-3 15,-13 C 15,-21 10,-28 0,-28 Z" fill="#005440" stroke="#ffffff" strokeWidth="2" />
          <circle cx="0" cy="-15" r="6" fill="#ffffff" />
          <text x="0" y="-12" textAnchor="middle" fill="#005440" fontSize="9" fontWeight="900">2</text>
        </g>
      </svg>

      {/* Real Google Maps Infowindow (Anchored over Pin 2) */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 sm:left-[38%] sm:-translate-x-1/2 z-20 pointer-events-auto">
        <div className="relative bg-white/98 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-[#bec9c3]/30 min-w-[240px] sm:min-w-[270px]">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#005440] bg-[#c9eadb]/70 px-2 py-0.5 rounded-md">
                Stop 2 of 4 · Activity
              </span>
              <h4 className="font-heading font-black text-sm text-[#181d1a] mt-1">
                Solang Valley Ridge
              </h4>
              <p className="text-[11px] text-[#5a6460]">Paragliding & Glacier Trail</p>
            </div>
            <div className="w-6 h-6 rounded-lg bg-[#005440] text-white flex items-center justify-center font-bold text-xs shrink-0">
              2
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-[#bec9c3]/20 flex items-center justify-between text-[11px] text-[#005440] font-bold">
            <span className="flex items-center gap-1">
              <Navigation className="w-3 h-3" />
              14.2 km · 35 min driving
            </span>
            <span className="text-[10px] text-[#5a6460] font-medium">via NH-3</span>
          </div>

          {/* Infowindow Pointer Arrow Triangle */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-[#bec9c3]/30" />
        </div>
      </div>

      {/* Top Floating Map Controls */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        {/* Route status */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#005440] text-xs font-bold shadow-md border border-[#bec9c3]/30">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Google Route Mapped · 32.4 km</span>
        </div>

        {/* Map / Satellite & Open in Maps */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSatellite(!isSatellite)}
            className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-[#181d1a] shadow-md border border-[#bec9c3]/30 hover:bg-[#f1f4f1] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#005440]" />
            <span className="hidden sm:inline">{isSatellite ? "Vector Map" : "Satellite"}</span>
          </button>

          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-full bg-[#005440] text-white text-xs font-bold shadow-md hover:bg-[#0f6e56] flex items-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#a0f3d4]" />
            <span>Open in Maps ↗</span>
          </a>
        </div>
      </div>

      {/* Bottom Floating Map Controls (Zoom buttons & Live GPS Turn) */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex items-end justify-between pointer-events-none">
        {/* Next Turn Instruction */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-xs font-medium text-[#181d1a] shadow-md border border-[#bec9c3]/30">
          <Navigation className="w-3.5 h-3.5 text-[#005440]" />
          <span>Next turn: Atal Tunnel North Portal in 11.8 km</span>
        </div>

        {/* Authentic Zoom In / Out Buttons */}
        <div className="pointer-events-auto flex flex-col rounded-xl overflow-hidden bg-white/95 backdrop-blur-md shadow-md border border-[#bec9c3]/30">
          <button
            type="button"
            className="p-2 hover:bg-[#f1f4f1] text-[#3f4944] border-b border-[#bec9c3]/20 transition-colors"
            aria-label="Zoom in"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 hover:bg-[#f1f4f1] text-[#3f4944] transition-colors"
            aria-label="Zoom out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Google Maps Attribution Mark */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] text-[#6f7a74]/80 pointer-events-none">
        Map preview data ©2026 Google
      </div>
    </div>
  );
};
