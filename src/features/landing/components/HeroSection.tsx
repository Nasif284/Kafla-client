"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Navigation,
  Sparkles,
  ArrowRight,
  Split,
  Video,
  CheckCircle2,
  Calendar,
  IndianRupee,
  MapPin,
  Clock,
  CheckSquare,
  Compass,
  Layers,
  ShieldCheck,
} from "lucide-react";

export const HeroSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"route" | "split" | "gear">("route");

  return (
    <section className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28">
      {/* Background Soft Ambient Glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-[#c9eadb]/40 via-[#a0f3d4]/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ebefeb] border border-[#bec9c3]/40 text-[#005440] text-xs sm:text-sm font-bold tracking-tight mb-6 shadow-2xs">
          <Sparkles className="w-4 h-4 text-[#005440]" />
          <span>The All-In-One Collaborative Trip Hub</span>
        </div>

        {/* Expansive Headline */}
        <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black text-[#181d1a] tracking-tight leading-[1.08] max-w-4xl mx-auto">
          Plan the route. Split the bills.{" "}
          <span className="text-[#005440] underline decoration-[#c9eadb] decoration-wavy decoration-2 underline-offset-8">
            Travel together without the friction.
          </span>
        </h1>

        {/* Clear, Relatable Subhead */}
        <p className="mt-6 text-base sm:text-xl text-[#3f4944] max-w-2xl mx-auto font-normal leading-relaxed">
          No more 500-message WhatsApp groups, lost spreadsheets, or awkward payment
          reminders. Kafla connects your daily Google Maps route, AI schedule, and
          debt-minimized balances in a single shared room.
        </p>

        {/* Dual High-Contrast CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#005440] text-white text-base font-bold shadow-lg shadow-[#005440]/25 hover:bg-[#0f6e56] hover:translate-y-[-1px] transition-all active:scale-95"
          >
            <span>Create a Free Trip</span>
            <ArrowRight className="w-4 h-4 text-[#a0f3d4]" />
          </Link>
          <a
            href="#route-map"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-[#181d1a] border border-[#bec9c3]/50 text-base font-bold hover:bg-[#f1f4f1] transition-all active:scale-95 shadow-2xs"
          >
            <Navigation className="w-4 h-4 text-[#005440]" />
            <span>See Route Map Demo</span>
          </a>
        </div>

        {/* Social Proof & Quick Highlights */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-[#476459] font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#005440]" />
            100% Free for Squads
          </span>
          <span className="hidden sm:inline text-[#bec9c3]">•</span>
          <span className="flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-[#005440]" />
            Google Maps Route Pacing
          </span>
          <span className="hidden sm:inline text-[#bec9c3]">•</span>
          <span className="flex items-center gap-1.5">
            <Split className="w-4 h-4 text-[#005440]" />
            10 Debts → 2 Direct Transfers
          </span>
          <span className="hidden sm:inline text-[#bec9c3]">•</span>
          <span className="flex items-center gap-1.5">
            <Video className="w-4 h-4 text-[#005440]" />
            Built-In Group Video Sync
          </span>
        </div>

        {/* Centerpiece: Panoramic Expedition Workspace Command Center */}
        <div className="mt-14 max-w-5xl mx-auto rounded-3xl bg-white border border-[#bec9c3]/40 shadow-2xl shadow-[#005440]/10 overflow-hidden text-left transition-all">
          
          {/* Workspace App Header Bar */}
          <div className="px-5 py-4 bg-[#f7faf6] border-b border-[#bec9c3]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Trip Identity */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#005440] text-white flex items-center justify-center font-bold font-heading text-sm shadow-xs">
                M
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-sm sm:text-base text-[#181d1a]">
                    Manali & Spiti Valley Expedition
                  </h3>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#c9eadb] text-[#005440] text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#005440] animate-pulse" />
                    Live Room
                  </span>
                </div>
                <p className="text-[11px] text-[#5a6460]">Day 2 of 4 · Oct 18 - 22 · 5 Friends</p>
              </div>
            </div>

            {/* Squad Avatars & Live Call Pill */}
            <div className="flex items-center gap-3 self-start md:self-auto">
              <div className="flex items-center -space-x-1.5">
                {["Rohan", "Priya", "Arjun", "Sneha", "Dev"].map((name, i) => (
                  <div
                    key={name}
                    title={name}
                    className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-2xs ${
                      i === 0
                        ? "bg-[#005440]"
                        : i === 1
                        ? "bg-[#0f6e56]"
                        : i === 2
                        ? "bg-[#476459]"
                        : i === 3
                        ? "bg-[#78352b]"
                        : "bg-[#6f7a74]"
                    }`}
                  >
                    {name[0]}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#005440] text-white text-[11px] font-bold shadow-xs">
                <Video className="w-3 h-3 text-[#a0f3d4]" />
                <span>Call (4 active)</span>
              </div>
            </div>
          </div>

          {/* 3 Synchronized Panels */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#bec9c3]/30">
            
            {/* Panel 1: Day Timeline (4 cols) */}
            <div className="md:col-span-4 p-5 space-y-3 bg-white">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-[#181d1a] uppercase tracking-wider">
                  Day 2 Itinerary
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c9eadb] text-[#005440]">
                  Balanced Pace
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#f7faf6] border border-[#bec9c3]/20 flex items-start gap-2.5">
                  <span className="font-bold text-[#005440] shrink-0">08:30</span>
                  <div className="min-w-0">
                    <p className="font-bold text-[#181d1a] truncate">Cafe 1947 Breakfast</p>
                    <p className="text-[10px] text-[#5a6460]">Old Manali · 1 hour</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#c9eadb]/30 border border-[#005440]/25 flex items-start gap-2.5">
                  <span className="font-bold text-[#005440] shrink-0">10:15</span>
                  <div className="min-w-0">
                    <p className="font-bold text-[#181d1a] truncate">Solang Valley Paragliding</p>
                    <p className="text-[10px] text-[#005440] font-semibold">14.2 km · 35 min drive</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#f7faf6] border border-[#bec9c3]/20 flex items-start gap-2.5">
                  <span className="font-bold text-[#005440] shrink-0">01:30</span>
                  <div className="min-w-0">
                    <p className="font-bold text-[#181d1a] truncate">Atal Tunnel Scenic Pass</p>
                    <p className="text-[10px] text-[#5a6460]">11.8 km · 25 min drive</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#f7faf6] border border-[#bec9c3]/20 flex items-start gap-2.5">
                  <span className="font-bold text-[#005440] shrink-0">03:15</span>
                  <div className="min-w-0">
                    <p className="font-bold text-[#181d1a] truncate">Sissu Waterfall Hike</p>
                    <p className="text-[10px] text-[#5a6460]">6.4 km · 15 min drive</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 2: Google Maps Driving Route (4 cols) */}
            <div className="md:col-span-4 p-5 space-y-3 bg-[#f7faf6] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold text-[#181d1a] uppercase tracking-wider flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-[#005440]" />
                    <span>Google Maps Route</span>
                  </span>
                  <span className="text-[10px] font-bold text-[#005440]">
                    Auto-Tracked
                  </span>
                </div>

                {/* Simulated Map Visual Card */}
                <div className="mt-3 p-4 rounded-2xl bg-white border border-[#bec9c3]/30 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold border-b border-[#bec9c3]/20 pb-2">
                    <span className="text-[#181d1a]">Today's Route</span>
                    <span className="text-[#005440]">32.4 km · 1h 15m</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#005440] text-white text-[10px] font-bold flex items-center justify-center">1</span>
                      <span className="font-medium text-[#181d1a] truncate">Old Manali Cafe</span>
                    </div>
                    <div className="ml-2.5 pl-2 border-l border-dashed border-[#005440] text-[10px] text-[#5a6460]">
                      14.2 km · 35 min drive
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#005440] text-white text-[10px] font-bold flex items-center justify-center">2</span>
                      <span className="font-medium text-[#181d1a] truncate">Solang Valley</span>
                    </div>
                    <div className="ml-2.5 pl-2 border-l border-dashed border-[#005440] text-[10px] text-[#5a6460]">
                      11.8 km · 25 min drive
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#005440] text-white text-[10px] font-bold flex items-center justify-center">3</span>
                      <span className="font-medium text-[#181d1a] truncate">Atal Tunnel North</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#c9eadb]/40 text-center text-[11px] text-[#005440] font-bold">
                Driving times calculated between each stop
              </div>
            </div>

            {/* Panel 3: Debt Minimizer & Shared Luggage (4 cols) */}
            <div className="md:col-span-4 p-5 space-y-4 bg-white flex flex-col justify-between">
              {/* Debt Minimizer Box */}
              <div>
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold text-[#181d1a] uppercase tracking-wider flex items-center gap-1.5">
                    <Split className="w-3.5 h-3.5 text-[#005440]" />
                    <span>Debt Minimizer</span>
                  </span>
                  <span className="text-[10px] font-bold text-[#005440] bg-[#c9eadb] px-2 py-0.5 rounded-full">
                    10 Debts → 2 Payments
                  </span>
                </div>

                <div className="mt-2 space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#f7faf6] border border-[#bec9c3]/20 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#181d1a]">Dev pays Rohan</p>
                      <p className="text-[10px] text-[#5a6460]">Solang & Fuel split</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#005440]">₹4,350</span>
                      <span className="block text-[9px] font-bold text-[#0f6e56]">Settle Up</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#f7faf6] border border-[#bec9c3]/20 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#181d1a]">Sneha pays Arjun</p>
                      <p className="text-[10px] text-[#5a6460]">Cottage stay split</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#005440]">₹2,100</span>
                      <span className="block text-[9px] font-bold text-[#0f6e56]">Settle Up</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Luggage Progress */}
              <div className="p-3 rounded-2xl bg-[#ebefeb] border border-[#bec9c3]/30">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-[#181d1a]">Luggage & Gear</span>
                  <span className="font-bold text-[#005440]">82% Packed</span>
                </div>
                <div className="w-full h-1.5 bg-[#d7dbd7] rounded-full overflow-hidden">
                  <div className="h-full bg-[#005440] rounded-full w-[82%]" />
                </div>
                <p className="text-[10px] text-[#5a6460] mt-1.5">
                  Permits (Priya) · Drone kit (Arjun) · Meds (Sneha)
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
