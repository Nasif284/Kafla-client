"use client";

import React from "react";
import { formatFullDate } from "../utils/helpers";
import { X, Sparkles } from "lucide-react";

interface TripItineraryEmptyHeroProps {
  destination?: string;
  dateFrom: string | Date;
  dateTo: string | Date;
  totalDays: number;
  onOpenAiModal: () => void;
  onDismiss?: () => void;
}

export default function TripItineraryEmptyHero({
  destination,
  dateFrom,
  dateTo,
  totalDays,
  onOpenAiModal,
  onDismiss,
}: TripItineraryEmptyHeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-[#f1f4f1] border border-[#0f6e56]/20 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-sm mb-6 transition-all">
      {/* Subtle background decoration */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#c9eadb]/30 rounded-full blur-2xl pointer-events-none" />

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#3f4944]/60 hover:text-[#181d1a] hover:bg-black/5 transition-colors cursor-pointer"
          title="Dismiss banner"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c9eadb] text-[#005440] text-[11px] font-bold tracking-wide uppercase mb-3">
          <span className="w-2 h-2 rounded-full bg-[#0f6e56] animate-pulse" />
          Trip Ready To Plan
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-[#181d1a] tracking-tight font-headline mb-2">
          Build your adventure to {destination || "your destination"}
        </h2>

        <p className="text-xs sm:text-sm text-[#3f4944] leading-relaxed mb-5">
          Your dates are set for <span className="font-bold text-[#181d1a]">{totalDays} {totalDays === 1 ? "day" : "days"}</span> (
          {formatFullDate(dateFrom)} – {formatFullDate(dateTo)}). Add travel stops like flights, train departures, hotel check-ins, and sights directly to your days below, or let Kafla AI build a tailored itinerary in seconds.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-2 bg-[#0f6e56] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-[#005440] active:scale-95 transition-all shadow-md shadow-[#0f6e56]/15 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate with AI</span>
          </button>

          <span className="text-xs text-[#3f4944] font-medium hidden sm:inline">
            or click <span className="font-bold text-[#0f6e56]">+ Add activity</span> on any day below
          </span>
        </div>
      </div>
    </div>
  );
}
