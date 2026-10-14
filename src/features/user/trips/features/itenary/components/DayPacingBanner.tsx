"use client";

import React from "react";
import { DayRouteAnalysis } from "../utils/routeIntelligence";
import { AlertTriangle, Compass, Route } from "lucide-react";

interface DayPacingBannerProps {
  analysis: DayRouteAnalysis;
  totalActivitiesCount: number;
}

export default function DayPacingBanner({
  analysis,
  totalActivitiesCount,
}: DayPacingBannerProps) {
  if (totalActivitiesCount <= 1) return null;

  const { overlapCount, tightTransitCount, totalDistanceKm, totalDistanceFormatted, pacingLevel, pacingSummary } = analysis;

  // If there are overlaps, highlight with amber/rose alert
  if (overlapCount > 0) {
    return (
      <div className="bg-rose-50/80 border border-rose-200/80 rounded-2xl p-3 sm:px-4 sm:py-3 flex items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-rose-700" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-rose-950 block">
              {overlapCount} Schedule Overlap{overlapCount > 1 ? "s" : ""}
            </span>
            <span className="text-[11px] text-rose-800/90 truncate block">
              {pacingSummary}
            </span>
          </div>
        </div>

        <span className="text-[10px] font-bold text-rose-800 bg-rose-100/90 px-2 py-0.5 rounded-full shrink-0">
          Action Needed
        </span>
      </div>
    );
  }

  // If there are tight transitions
  if (tightTransitCount > 0) {
    return (
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 sm:px-4 sm:py-3 flex items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-amber-950 block">
              {tightTransitCount} Tight Transition{tightTransitCount > 1 ? "s" : ""}
            </span>
            <span className="text-[11px] text-amber-800/90 truncate block">
              Estimated travel time is close to or exceeds scheduled buffer.
            </span>
          </div>
        </div>

        {totalDistanceKm > 0 && (
          <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
            ~{totalDistanceFormatted} transit
          </span>
        )}
      </div>
    );
  }

  // Healthy pacing banner (Emerald theme)
  return (
    <div className="bg-[#f0fdf4]/70 border border-[#bbf7d0]/60 rounded-2xl p-3 sm:px-4 sm:py-2.5 flex items-center justify-between gap-3 text-xs shadow-2xs">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-6 h-6 rounded-lg bg-[#c9eadb]/60 flex items-center justify-center shrink-0">
          {pacingLevel === "active" ? (
            <Route className="w-3.5 h-3.5 text-[#005440]" />
          ) : (
            <Compass className="w-3.5 h-3.5 text-[#005440]" />
          )}
        </div>
        <div className="min-w-0">
          <span className="font-bold text-[#005440]">
            {pacingLevel === "active" ? "Active Day Pace" : "Balanced Pacing"}
          </span>
          <span className="text-[11px] text-[#3f4944] ml-2 hidden sm:inline">
            · {totalActivitiesCount} scheduled stops
            {totalDistanceKm > 0 ? ` covering ~${totalDistanceFormatted} transit` : ""}
          </span>
        </div>
      </div>

      {totalDistanceKm > 0 && (
        <span className="text-[10px] font-bold text-[#005440] bg-[#c9eadb]/50 px-2.5 py-0.5 rounded-full shrink-0">
          ~{totalDistanceFormatted} total
        </span>
      )}
    </div>
  );
}
