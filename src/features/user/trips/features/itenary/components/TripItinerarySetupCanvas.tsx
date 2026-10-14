"use client";

import React from "react";
import { formatFullDate } from "../utils/helpers";
import TripItineraryGhostPreview from "./TripItineraryGhostPreview";
import { Sparkles, PenSquare } from "lucide-react";

interface TripItinerarySetupCanvasProps {
  destination?: string;
  dateFrom?: string | Date;
  dateTo?: string | Date;
  totalDays: number;
  isSettingUp: boolean;
  onOpenAiModal: () => void;
  onSetupManual: () => void;
}

export default function TripItinerarySetupCanvas({
  destination,
  dateFrom,
  dateTo,
  totalDays,
  isSettingUp,
  onOpenAiModal,
  onSetupManual,
}: TripItinerarySetupCanvasProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white border border-[#bec9c3]/20 rounded-3xl p-6 sm:p-10 shadow-sm text-center relative overflow-hidden">
        {/* Decorative blur circle */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#c9eadb]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-emerald-100/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="max-w-xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c9eadb] text-[#005440] text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-[#0f6e56] animate-pulse" />
            Itinerary Launchpad
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#181d1a] tracking-tight font-headline mb-3">
            Plan your journey to {destination || "your destination"}
          </h2>

          <p className="text-xs sm:text-sm text-[#3f4944] leading-relaxed">
            {dateFrom && dateTo ? (
              <>
                Trip dates: <span className="font-bold text-[#181d1a]">{formatFullDate(dateFrom)}</span> to{" "}
                <span className="font-bold text-[#181d1a]">{formatFullDate(dateTo)}</span> ({totalDays}{" "}
                {totalDays === 1 ? "day" : "days"}). Choose how you want to build your itinerary:
              </>
            ) : (
              "Choose how your group would like to start building the itinerary:"
            )}
          </p>
        </div>

        {/* 2 Path Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left">
          {/* Option 1: AI Generation */}
          <div className="relative group bg-gradient-to-br from-emerald-50/60 to-white border border-[#0f6e56]/30 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:shadow-md hover:border-[#0f6e56] transition-all">
            <div className="absolute top-4 right-4 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#0f6e56] text-white tracking-wider">
              Magic
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#c9eadb] text-[#005440] flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>

              <h3 className="text-base sm:text-lg font-bold text-[#181d1a] mb-1.5 font-headline">
                Generate with AI
              </h3>
              <p className="text-xs text-[#3f4944] leading-relaxed mb-6">
                Let Kafla AI craft a curated day-by-day plan with dining spots, highlights, and realistic timing tailored to your group.
              </p>
            </div>

            <button
              onClick={onOpenAiModal}
              disabled={isSettingUp}
              className="w-full flex items-center justify-center gap-2 bg-[#0f6e56] text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm hover:bg-[#005440] active:scale-95 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Itinerary</span>
            </button>
          </div>

          {/* Option 2: Custom Manual Setup */}
          <div className="bg-white border border-[#bec9c3]/20 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-[#3f4944]/40 hover:shadow-md transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#f1f4f1] text-[#3f4944] flex items-center justify-center mb-4">
                <PenSquare className="w-6 h-6" />
              </div>

              <h3 className="text-base sm:text-lg font-bold text-[#181d1a] mb-1.5 font-headline">
                Build Itinerary Manually
              </h3>
              <p className="text-xs text-[#3f4944] leading-relaxed mb-6">
                Start with a clean slate. Scaffolds all trip days so your group can map out trains, hotel check-ins, and stops freely.
              </p>
            </div>

            <button
              onClick={onSetupManual}
              disabled={isSettingUp}
              className="w-full flex items-center justify-center gap-2 bg-white border border-[#bec9c3] text-[#181d1a] hover:bg-[#f1f4f1] py-3 px-4 rounded-xl font-bold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSettingUp ? (
                <span className="inline-block w-4 h-4 border-2 border-[#181d1a] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <PenSquare className="w-4 h-4 text-[#3f4944]" />
                  <span>Start Custom Planning</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Ghost Preview / Inspiration */}
        <TripItineraryGhostPreview destination={destination} />
      </div>
    </div>
  );
}
