"use client";

import React, { useState } from "react";
import {
  Navigation,
  Clock,
  Gauge,
  Layers,
  ExternalLink,
  Compass,
  Car,
} from "lucide-react";
import { MOCK_ROUTE_STOPS } from "../data/landingData";
import { StaticMapCanvasPreview } from "./map/StaticMapCanvasPreview";

export const RouteMapSpotlight: React.FC = () => {
  const [activeDayTab, setActiveDayTab] = useState<number | "all">(2);
  const [activeStopId, setActiveStopId] = useState<string>("stop-2");

  const getStopNumber = (id: string) => {
    switch (id) {
      case "stop-1":
        return 1;
      case "stop-2":
        return 2;
      case "stop-3":
        return 3;
      case "stop-4":
        return 4;
      default:
        return 2;
    }
  };

  const handleSelectStopNumber = (num: number) => {
    setActiveStopId(`stop-${num}`);
  };

  return (
    <section id="route-map" className="py-20 md:py-32 bg-[#f7faf6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ebefeb] border border-[#bec9c3]/40 text-[#005440] text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5 text-[#005440]" />
            <span>Real Google Maps Canvas Preview</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#181d1a] tracking-tight">
            See Your Whole Route on Google Maps Before You Go
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#3f4944] leading-relaxed">
            Never guess how far the next stop is. Kafla automatically connects your
            daily activities with turn-by-turn road lines, real driving durations,
            and pacing meters on Google Maps.
          </p>
        </div>

        {/* Master Route Map Canvas Container */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-[#bec9c3]/35 shadow-xl overflow-hidden text-left">
          {/* Canvas Top Bar */}
          <div className="px-5 py-4 bg-white border-b border-[#bec9c3]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#005440]/10 text-[#005440] flex items-center justify-center shrink-0">
                <Navigation className="w-5 h-5 text-[#005440]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-sm sm:text-base text-[#181d1a]">
                    Interactive Route Map Canvas
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#c9eadb] text-[#005440] text-[10px] font-bold">
                    GPS Connected
                  </span>
                </div>
                <p className="text-xs text-[#5a6460]">
                  4 Stops · 32.4 km Route · Turn-by-Turn Road Navigation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c9eadb]/70 text-[#005440] text-xs font-bold">
                <Gauge className="w-3.5 h-3.5 text-[#0f6e56]" />
                <span>Balanced Pace (4.5h scheduled)</span>
              </span>
            </div>
          </div>

          {/* Multi-Day Circuit Filter Tabs */}
          <div className="px-5 py-3 bg-[#f7faf6] border-b border-[#bec9c3]/20 flex items-center gap-2 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveDayTab("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeDayTab === "all"
                  ? "bg-[#005440] text-white shadow-xs"
                  : "bg-white border border-[#bec9c3]/30 text-[#3f4944] hover:bg-[#ebefeb]"
              }`}
            >
              Full Circuit (12 stops)
            </button>

            {[1, 2, 3].map((d) => (
              <button
                key={d}
                onClick={() => setActiveDayTab(d)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeDayTab === d
                    ? "bg-[#181d1a] text-white shadow-xs"
                    : "bg-white border border-[#bec9c3]/30 text-[#3f4944] hover:bg-[#ebefeb]"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    d === 1 ? "bg-emerald-500" : d === 2 ? "bg-[#005440]" : "bg-teal-500"
                  }`}
                />
                <span>Day {d}</span>
                <span className="text-[10px] opacity-75">(4 stops)</span>
              </button>
            ))}
          </div>

          {/* 2-Column Split: Stops List on Left, Real Map Canvas on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#bec9c3]/30">
            {/* Left Column: Timeline Stops */}
            <div className="lg:col-span-5 p-5 space-y-3 bg-white">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6f7a74]">
                  Sequenced Day Stops
                </span>
                <span className="text-xs font-bold text-[#005440]">Click stop to focus</span>
              </div>

              <div className="space-y-2.5">
                {MOCK_ROUTE_STOPS.map((stop) => {
                  const isSelected = activeStopId === stop.id;
                  return (
                    <div
                      key={stop.id}
                      onClick={() => setActiveStopId(stop.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#c9eadb]/30 border-[#005440]/50 shadow-xs"
                          : "bg-[#f7faf6] border-[#bec9c3]/30 hover:border-[#005440]/30"
                      }`}
                    >
                      {stop.distanceFromPrev && (
                        <div className="mb-2 pb-1 border-b border-[#bec9c3]/20 flex items-center gap-1 text-[11px] font-bold text-[#005440]">
                          <Car className="w-3.5 h-3.5 text-[#005440]" />
                          <span>{stop.distanceFromPrev} · {stop.driveTimeFromPrev} driving</span>
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected ? "bg-[#005440] text-white" : "bg-[#e0e3e0] text-[#181d1a]"
                          }`}
                        >
                          {stop.number}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-[#181d1a] truncate">{stop.title}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#3f4944] border border-[#bec9c3]/30">
                              {stop.category}
                            </span>
                          </div>
                          <p className="text-xs text-[#5a6460] truncate mt-0.5">{stop.location}</p>
                          <p className="text-[11px] text-[#6f7a74] mt-1 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-[#6f7a74]" />
                            <span>{stop.time} ({stop.duration})</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Embedded Real Google Maps Canvas Preview */}
            <div className="lg:col-span-7 p-4 bg-[#f7faf6]">
              <StaticMapCanvasPreview
                activeStopNumber={getStopNumber(activeStopId)}
                onSelectStop={handleSelectStopNumber}
              />
            </div>
          </div>
        </div>

        {/* 3 Callouts Below the Canvas */}
        <div className="max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          <div className="p-5 rounded-2xl bg-white border border-[#bec9c3]/35 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-[#c9eadb]/60 text-[#005440] flex items-center justify-center mb-3">
              <Navigation className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-sm text-[#181d1a]">Turn-by-Turn Road Routing</h4>
            <p className="text-xs text-[#5a6460] mt-1.5 leading-relaxed">
              Kafla draws true road trajectories between stops, calculating real driving durations so you never under-estimate mountain travel.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#bec9c3]/35 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-[#c9eadb]/60 text-[#005440] flex items-center justify-center mb-3">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-sm text-[#181d1a]">Multi-Day Circuit Overview</h4>
            <p className="text-xs text-[#5a6460] mt-1.5 leading-relaxed">
              Switch between individual days or see your group's entire expedition circuit mapped together with color-coded day legends.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#bec9c3]/35 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-[#c9eadb]/60 text-[#005440] flex items-center justify-center mb-3">
              <ExternalLink className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-sm text-[#181d1a]">1-Click Google Maps Launch</h4>
            <p className="text-xs text-[#5a6460] mt-1.5 leading-relaxed">
              Export the whole multi-stop navigation route straight to the Google Maps app on your phone with a single tap before driving.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
