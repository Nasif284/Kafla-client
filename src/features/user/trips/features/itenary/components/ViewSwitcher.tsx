"use client";

import React from "react";
import { Calendar, List } from "lucide-react";

export type ItineraryViewMode = "day" | "timeline";

interface ViewSwitcherProps {
  viewMode: ItineraryViewMode;
  onViewChange: (mode: ItineraryViewMode) => void;
  totalActivities: number;
}

export default function ViewSwitcher({
  viewMode,
  onViewChange,
  totalActivities,
}: ViewSwitcherProps) {
  return (
    <div className="flex items-center gap-1 bg-[#f1f4f1] p-1 rounded-xl border border-[#bec9c3]/20 shadow-inner">
      <button
        onClick={() => onViewChange("day")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          viewMode === "day"
            ? "bg-white text-[#0f6e56] shadow-sm"
            : "text-[#3f4944] hover:text-[#181d1a] hover:bg-white/50"
        }`}
        title="View one day at a time in detail"
      >
        <Calendar className="w-3.5 h-3.5" />
        <span>Day Focus</span>
      </button>

      <button
        onClick={() => onViewChange("timeline")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          viewMode === "timeline"
            ? "bg-white text-[#0f6e56] shadow-sm"
            : "text-[#3f4944] hover:text-[#181d1a] hover:bg-white/50"
        }`}
        title="View all days in a continuous timeline"
      >
        <List className="w-3.5 h-3.5" />
        <span>Full Timeline</span>
        {totalActivities > 0 && (
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold tabular-nums ${
              viewMode === "timeline"
                ? "bg-[#c9eadb] text-[#005440]"
                : "bg-black/5 text-[#3f4944]"
            }`}
          >
            {totalActivities}
          </span>
        )}
      </button>
    </div>
  );
}
