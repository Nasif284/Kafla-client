"use client";

import React, { useState } from "react";
import { SegmentAnalysis } from "../utils/routeIntelligence";
import {
  Footprints,
  Car,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Coffee,
  MapPin,
} from "lucide-react";

interface ActivityRouteConnectorProps {
  segment: SegmentAnalysis;
  onShiftTime?: (suggestedTime: string) => void;
}

export default function ActivityRouteConnector({
  segment,
  onShiftTime,
}: ActivityRouteConnectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { commute, severity, alertTitle, alertDetail, suggestedStartTime, googleMapsUrl } = segment;

  // Determine styling based on severity
  let badgeTheme = "bg-white border-[#bec9c3]/30 text-[#3f4944] hover:border-[#0f6e56]/40";
  let lineStyle = "border-dashed border-[#bec9c3]/40";
  let icon = <Clock className="w-3.5 h-3.5 text-[#6f7a74] shrink-0" />;
  let labelText = `${segment.timeGapFormatted} window`;
  let mapPinColor = "text-[#005440]";

  if (severity === "overlap") {
    badgeTheme = "bg-rose-50/90 border-rose-300 text-rose-900 shadow-2xs";
    lineStyle = "border-solid border-rose-300";
    icon = <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />;
    labelText = `${segment.timeGapFormatted} · Conflict`;
    mapPinColor = "text-rose-700";
  } else if (severity === "tight") {
    badgeTheme = "bg-amber-50/90 border-amber-300 text-amber-900 shadow-2xs";
    lineStyle = "border-dashed border-amber-300";
    icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
    labelText = commute?.hasCoordinates
      ? `${commute.durationFormatted} (${commute.distanceFormatted}) · ${segment.timeGapFormatted} window`
      : `${segment.timeGapFormatted} · Back-to-back`;
    mapPinColor = "text-amber-700";
  } else if (severity === "leisure") {
    badgeTheme = "bg-[#f8faf8] border-[#bec9c3]/30 text-[#3f4944]";
    lineStyle = "border-dashed border-[#bec9c3]/30";
    icon = <Coffee className="w-3.5 h-3.5 text-[#005440] shrink-0" />;
    labelText = `${segment.timeGapFormatted} free time`;
  } else if (commute?.hasCoordinates) {
    if (commute.mode === "walk") {
      badgeTheme = "bg-[#f0fdf4] border-[#bbf7d0] text-[#005440] hover:border-[#005440]/40";
      icon = <Footprints className="w-3.5 h-3.5 text-[#005440] shrink-0" />;
      labelText = `${commute.durationFormatted} (${commute.distanceFormatted})`;
    } else {
      badgeTheme = "bg-[#f0fdf4] border-[#bbf7d0] text-[#0f6e56] hover:border-[#0f6e56]/40";
      icon = <Car className="w-3.5 h-3.5 text-[#0f6e56] shrink-0" />;
      labelText = `${commute.durationFormatted} (${commute.distanceFormatted})`;
    }
  }

  return (
    <div className="relative flex flex-col items-center my-1 select-none">
      {/* Top connector line */}
      <div className={`w-0.5 h-3 border-l-2 ${lineStyle}`} />

      {/* Center Actionable Pill */}
      <div className="relative group z-10">
        <div
          onClick={() => {
            if (severity === "overlap" || severity === "tight") {
              setIsExpanded((v) => !v);
            }
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold transition-all ${
            severity === "overlap" || severity === "tight" ? "cursor-pointer" : ""
          } ${badgeTheme}`}
          title={alertDetail || "View transit details between stops"}
        >
          {icon}
          <span className="font-semibold">{labelText}</span>

          {/* Subtle separator */}
          <span className="w-px h-3 bg-current/20 shrink-0 mx-0.5" />

          {/* Classy Google Maps Directions Trigger */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full hover:bg-black/5 active:scale-95 transition-all text-current font-semibold text-[10px] group/map"
            title="Open directions in Google Maps"
            aria-label="Open directions in Google Maps"
          >
            <MapPin className={`w-3 h-3 ${mapPinColor} group-hover/map:scale-110 transition-transform shrink-0`} />
            <span className="tracking-tight">Maps</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60 shrink-0" />
          </a>

          {(severity === "overlap" || severity === "tight") && (
            <ChevronDown
              className={`w-3 h-3 text-current/60 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          )}
        </div>

        {/* Expandable Alert Box */}
        {isExpanded && (severity === "overlap" || severity === "tight") && (
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-72 sm:w-80 bg-white border border-[#bec9c3]/30 rounded-2xl p-3.5 shadow-xl z-30 text-left animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                <span>{alertTitle}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-[10px] text-[#6f7a74] hover:text-[#181d1a] cursor-pointer"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-[#3f4944] leading-relaxed mb-2">
              {alertDetail}
            </p>

            {/* Turn-by-Turn Route in Google Maps CTA */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-xl bg-[#f1f4f1] hover:bg-[#e5e9e5] text-[#005440] text-xs font-bold border border-[#bec9c3]/30 transition-all cursor-pointer group/cta shadow-2xs"
            >
              <MapPin className="w-3.5 h-3.5 text-[#005440] group-hover/cta:scale-110 transition-transform shrink-0" />
              <span>Open Directions in Google Maps</span>
              <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
            </a>

            {/* Quick-Shift Recommendation Button */}
            {suggestedStartTime && onShiftTime && severity === "overlap" && (
              <div className="mt-2.5 pt-2.5 border-t border-[#f1f4f1] flex items-center justify-between gap-2">
                <span className="text-[10px] text-[#6f7a74]">Auto-Fix:</span>
                <button
                  type="button"
                  onClick={() => {
                    onShiftTime(suggestedStartTime);
                    setIsExpanded(false);
                  }}
                  className="px-2.5 py-1 bg-[#005440] hover:bg-[#0f6e56] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span>Shift start to {suggestedStartTime}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom connector line */}
      <div className={`w-0.5 h-3 border-l-2 ${lineStyle}`} />
    </div>
  );
}
