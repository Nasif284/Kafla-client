"use client";

import { useState } from "react";
import {
  APIProvider,
  Map as GoogleMap,
} from "@vis.gl/react-google-maps";
import {
  MapPin,
  ChevronDown,
  Layers,
  ExternalLink,
  Navigation,
  Compass,
  CheckCircle2,
} from "lucide-react";
import {
  RouteMapCanvasProps,
  ValidMarkerPoint,
  getDayColor,
} from "./map/mapTypes";
import MapContent from "./map/MapContent";
import { useRouteMapCanvas } from "./map/useRouteMapCanvas";

export { getDayColor };
export type { RouteMapCanvasProps };

export default function RouteMapCanvas({
  dayNumber,
  activities = [],
  dayLocation,
  days,
  defaultExpanded = false,
  className = "",
  title,
}: RouteMapCanvasProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isSatellite, setIsSatellite] = useState(false);
  const [activeStop, setActiveStop] = useState<ValidMarkerPoint | null>(null);
  const [activeDayTab, setActiveDayTab] = useState<number | "all">("all");
  const [roadRouteActive, setRoadRouteActive] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || "";

  const {
    isMultiDay,
    validStops,
    pointsForGoogleMaps,
    googleMapsUrl,
    headerTitle,
    headerSummary,
    defaultCenter,
    routeColor,
  } = useRouteMapCanvas({
    dayNumber,
    activities,
    days,
    title,
    activeDayTab,
  });

  return (
    <div
      className={`bg-white border border-[#bec9c3]/25 rounded-2xl sm:rounded-3xl shadow-xs transition-all overflow-hidden ${className}`}
    >
      {/* Collapsed / Header Bar */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between gap-3 text-left hover:bg-[#fafbfa] transition-colors cursor-pointer select-none group"
        aria-expanded={isExpanded}
        aria-label="Toggle Route Map Canvas"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#0f6e56]/10 text-[#0f6e56] flex items-center justify-center shrink-0 group-hover:bg-[#0f6e56] group-hover:text-white transition-all">
            {isMultiDay ? <Compass className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-[#181d1a] font-headline">
                {headerTitle}
              </span>
              <span className="text-[11px] font-medium text-[#6f7a74] hidden sm:inline">
                · {headerSummary}
              </span>
            </div>
            <p className="text-[11px] font-medium text-[#6f7a74] sm:hidden truncate">
              {headerSummary}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold text-[#0f6e56] bg-[#0f6e56]/10 px-2.5 py-1 rounded-lg group-hover:bg-[#0f6e56] group-hover:text-white transition-all">
            {isExpanded ? "Hide Map" : "Explore Map"}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-[#6f7a74] transition-transform duration-300 ease-out ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Expanded Map Canvas */}
      {isExpanded && (
        <div className="border-t border-[#f1f4f1] p-3 sm:p-4 bg-[#fafbfa] space-y-3">
          {/* Multi-day filter tabs */}
          {isMultiDay && days && days.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveDayTab("all")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeDayTab === "all"
                    ? "bg-[#0f6e56] text-white shadow-xs"
                    : "bg-white border border-[#bec9c3]/30 text-[#3f4944] hover:bg-[#f1f4f1]"
                }`}
              >
                All Days ({validStops.length} stops)
              </button>
              {days.map((day, dIdx) => {
                const count = validStops.filter((s) => s.dayIndex === dIdx).length;
                const isSelected = activeDayTab === dIdx;
                const dotColor = getDayColor(dIdx);
                return (
                  <button
                    key={day.id || dIdx}
                    type="button"
                    onClick={() => setActiveDayTab(dIdx)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? "bg-[#181d1a] text-white shadow-xs"
                        : "bg-white border border-[#bec9c3]/30 text-[#3f4944] hover:bg-[#f1f4f1]"
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: dotColor }}
                    />
                    <span>Day {dIdx + 1}</span>
                    <span className="text-[10px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Map Viewport Container */}
          <div className="relative w-full h-[350px] sm:h-[400px] rounded-2xl overflow-hidden border border-[#bec9c3]/20 shadow-xs bg-[#f1f4f1]">
            {validStops.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#fafbfa]">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#bec9c3]/25 flex items-center justify-center text-[#6f7a74] mb-3 shadow-2xs">
                  <Navigation className="w-5 h-5 text-[#0f6e56]" />
                </div>
                <h4 className="text-sm font-bold text-[#181d1a] mb-1 font-headline">
                  No GPS Coordinates Available
                </h4>
                <p className="text-xs text-[#6f7a74] max-w-sm mb-4 leading-relaxed">
                  Add places or edit activity locations to unlock turn-by-turn road
                  routing and sequenced navigation for this day.
                </p>
                {dayLocation && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      dayLocation
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#bec9c3]/30 text-xs font-bold text-[#0f6e56] hover:bg-[#f1f4f1] transition-all"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Search &quot;{dayLocation}&quot; on Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ) : !apiKey ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#fafbfa]">
                <p className="text-xs font-bold text-amber-700 mb-1">
                  Google Maps API Key Not Configured
                </p>
                <p className="text-[11px] text-[#6f7a74]">
                  Please ensure NEXT_PUBLIC_GOOGLE_PLACES_API_KEY is defined in your
                  environment file.
                </p>
              </div>
            ) : (
              <APIProvider apiKey={apiKey} libraries={["places", "geometry"]}>
                <GoogleMap
                  defaultCenter={defaultCenter}
                  defaultZoom={13}
                  gestureHandling="cooperative"
                  disableDefaultUI={true}
                  mapTypeId={isSatellite ? "hybrid" : "roadmap"}
                  className="w-full h-full"
                >
                  <MapContent
                    stops={validStops}
                    activeStop={activeStop}
                    onSelectStop={setActiveStop}
                    dayMode={isMultiDay ? "multi" : "single"}
                    activeDayTab={activeDayTab}
                    routeColor={routeColor}
                    onRoadRouteLoaded={(hasRoad) => setRoadRouteActive(hasRoad)}
                  />
                </GoogleMap>

                {/* Floating Toolbar */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSatellite((prev) => !prev)}
                    className="px-2.5 py-1.5 bg-white/95 backdrop-blur-md rounded-xl text-xs font-bold text-[#181d1a] shadow-sm border border-[#bec9c3]/30 hover:bg-[#f1f4f1] flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Toggle Map / Satellite imagery"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#0f6e56]" />
                    <span className="hidden sm:inline">
                      {isSatellite ? "Vector Map" : "Satellite"}
                    </span>
                  </button>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#0f6e56] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#005440] flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Open full turn-by-turn route in Google Maps"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Maps ↗</span>
                  </a>
                </div>

                {/* Floating Route Status Bar */}
                <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
                  <div className="px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-xl text-[11px] font-semibold text-[#181d1a] shadow-sm border border-[#bec9c3]/30 flex items-center gap-1.5">
                    {roadRouteActive ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0f6e56]" />
                        <span>Road connected</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-3.5 h-3.5 text-[#0f6e56]" />
                        <span>
                          {isMultiDay && activeDayTab === "all"
                            ? "Full circuit route"
                            : "Route mapped"}
                        </span>
                      </>
                    )}
                    <span className="text-[#bec9c3]">|</span>
                    <span className="text-[#6f7a74]">
                      {pointsForGoogleMaps.length} Stops
                    </span>
                  </div>
                </div>

                {/* Multi-Day Color Legend */}
                {isMultiDay && activeDayTab === "all" && days && days.length > 1 && (
                  <div className="absolute bottom-3 right-3 z-10 hidden sm:flex items-center gap-2 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-xl text-[10px] font-bold text-[#3f4944] shadow-sm border border-[#bec9c3]/30">
                    {days.slice(0, 5).map((_, dIdx) => (
                      <span key={dIdx} className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getDayColor(dIdx) }}
                        />
                        Day {dIdx + 1}
                      </span>
                    ))}
                    {days.length > 5 && (
                      <span className="text-[#6f7a74]">+{days.length - 5}</span>
                    )}
                  </div>
                )}
              </APIProvider>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
