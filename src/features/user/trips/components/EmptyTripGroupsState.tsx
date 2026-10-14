"use client";

import React from "react";
import {
  Compass,
  Plus,
  Users,
  Sparkles,
  MapPin,
  Calendar,
  Receipt,
  CheckSquare,
  MessageSquare,
  ArrowRight,
  Palmtree,
  Mountain,
  Car,
  Landmark,
} from "lucide-react";

interface EmptyTripGroupsStateProps {
  onCreateClick: (suggestedName?: string) => void;
  onJoinClick: () => void;
}

export default function EmptyTripGroupsState({
  onCreateClick,
  onJoinClick,
}: EmptyTripGroupsStateProps) {
  const inspirationTrips = [
    {
      title: "Beach Retreat",
      icon: Palmtree,
      color: "bg-amber-500/10 text-amber-700 border-amber-200",
      presetName: "Goa Beach Retreat",
    },
    {
      title: "Mountain Trek",
      icon: Mountain,
      color: "bg-sky-500/10 text-sky-700 border-sky-200",
      presetName: "Manali Mountain Trek",
    },
    {
      title: "Weekend Road Trip",
      icon: Car,
      color: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
      presetName: "Coastline Road Trip",
    },
    {
      title: "City & Culture Tour",
      icon: Landmark,
      color: "bg-purple-500/10 text-purple-700 border-purple-200",
      presetName: "Heritage Cultural Tour",
    },
  ];

  const features = [
    {
      icon: Calendar,
      title: "Smart Itineraries",
      badge: "AI Powered",
      description:
        "Build daily schedules or let Kafla AI suggest stops, activities, and driving routes in seconds.",
      accent: "bg-[#0f6e56]/10 text-[#0f6e56]",
    },
    {
      icon: Receipt,
      title: "Fair Split Expenses",
      badge: "Zero Math",
      description:
        "Log shared bills, see who owes whom in real-time, and settle balances without spreadsheet chaos.",
      accent: "bg-[#c9eadb] text-[#005440]",
    },
    {
      icon: CheckSquare,
      title: "Shared Checklists",
      badge: "Collaborative",
      description:
        "Coordinate gear, documents, and packing essentials so nothing important gets left behind.",
      accent: "bg-blue-50 text-blue-700",
    },
    {
      icon: MessageSquare,
      title: "Chat & Squad Calls",
      badge: "Real-time",
      description:
        "Stay in sync with dedicated group messaging channels and instant audio/video calls.",
      accent: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="w-full space-y-10 sm:space-y-12">
      {/* ── Main Hero Card ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-white to-[#f4f7f5] border border-[#bec9c3]/30 p-6 sm:p-12 shadow-sm">
        {/* Ambient background glows */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[34rem] h-64 bg-gradient-to-r from-[#c9eadb]/40 via-[#84d6b9]/25 to-[#c9eadb]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto flex flex-col items-center text-center">
          {/* Animated Illustration Badge */}
          <div className="relative mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-[#005440] to-[#0f6e56] flex items-center justify-center text-white shadow-xl shadow-[#005440]/20 transform transition-transform hover:scale-105">
              <Compass className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-[spin_12s_linear_infinite]" />
            </div>
            {/* Small floating badges */}
            <div className="absolute -bottom-2 -left-3 bg-white p-2 rounded-2xl shadow-md border border-[#bec9c3]/20 flex items-center gap-1.5 text-xs font-bold text-[#005440]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>AI Ready</span>
            </div>
            <div className="absolute -top-2 -right-3 bg-white p-2 rounded-2xl shadow-md border border-[#bec9c3]/20 flex items-center gap-1 text-xs font-bold text-[#3f4944]">
              <MapPin className="w-3.5 h-3.5 text-[#ba1a1a]" />
              <span>Worldwide</span>
            </div>
          </div>

          {/* Headline & Description */}
          <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#c9eadb]/70 border border-[#005440]/15 text-[#005440] text-xs font-bold uppercase tracking-wider mb-4">
            <span>Plan • Split • Explore</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#181d1a] tracking-tight font-headline">
            Start Your Next Group Adventure
          </h2>

          <p className="text-sm sm:text-base text-[#3f4944] mt-3.5 sm:mt-4 max-w-2xl leading-relaxed font-medium">
            You don't have any active trip groups yet. Gather your squad to build AI-guided daily
            itineraries, split expenses smoothly, and collaborate on shared checklists all in one
            place.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-8 sm:mt-10 w-full sm:w-auto">
            <button
              onClick={() => onCreateClick()}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#005440] hover:bg-[#0f6e56] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-[#005440]/25 transition-all hover:shadow-xl active:scale-95 cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>Create New Trip</span>
            </button>

            <button
              onClick={onJoinClick}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-[#f1f4f1] border-2 border-[#005440]/25 hover:border-[#005440] text-[#005440] font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Users className="w-5 h-5" />
              <span>Join with Invite Code</span>
            </button>
          </div>

          {/* Quick Inspiration Chips */}
          <div className="mt-10 sm:mt-12 pt-8 border-t border-[#bec9c3]/20 w-full">
            <p className="text-xs font-bold text-[#6f7a74] uppercase tracking-wider mb-3">
              Need inspiration? Pick a vibe to get started:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {inspirationTrips.map((idea) => {
                const IconComponent = idea.icon;
                return (
                  <button
                    key={idea.title}
                    onClick={() => onCreateClick(idea.presetName)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-[#c9eadb]/30 border border-[#bec9c3]/40 hover:border-[#005440] text-xs sm:text-sm font-semibold text-[#181d1a] shadow-2xs hover:shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <IconComponent className="w-4 h-4 text-[#005440]" />
                    <span>{idea.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Highlights Grid ── */}
      <div>
        <div className="text-center sm:text-left mb-6">
          <h3 className="text-lg sm:text-2xl font-extrabold text-[#181d1a] font-headline">
            Everything your travel squad needs
          </h3>
          <p className="text-xs sm:text-sm text-[#3f4944] mt-1 font-medium">
            Designed to take the headache out of group travel planning.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group p-5 sm:p-6 rounded-2xl bg-white border border-[#bec9c3]/20 hover:border-[#005440]/30 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl ${feat.accent} flex items-center justify-center group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#f1f4f1] text-[#3f4944]">
                      {feat.badge}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#181d1a] mb-1.5 font-headline">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-[#3f4944] leading-relaxed font-medium">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#bec9c3]/15 flex items-center gap-1.5 text-xs font-bold text-[#005440] opacity-80 group-hover:opacity-100 transition-opacity">
                  <span>Explore in squad</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
