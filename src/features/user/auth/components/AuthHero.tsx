"use client";

import React, { useState } from "react";
import {
  Compass,
  Sparkles,
  Calendar,
  Receipt,
  MessageSquare,
  Check,
  MapPin,
  Users,
  Mountain,
  Car,
  Star,
} from "lucide-react";

const SCENES = [
  {
    name: "Road Trip",
    image: "/auth-hero.jpg",
    icon: Car,
    tagline: "Iconic canyon road trip across the wild west",
  },
  {
    name: "Alpine Peaks",
    image: "/auth-hero-mountains.jpg",
    icon: Mountain,
    tagline: "Evergreen pine valleys and glacial peaks",
  },
];

export default function AuthHero() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const currentScene = SCENES[sceneIndex];

  const handleToggleScene = () => {
    setSceneIndex((prev) => (prev + 1) % SCENES.length);
  };

  return (
    <section className="hidden fixed lg:flex lg:w-[55%] h-screen flex-col justify-between p-8 xl:p-12 overflow-hidden select-none">
      {/* ── Background Imagery with Crossfade ── */}
      {SCENES.map((scene, idx) => (
        <div
          key={scene.name}
          className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-700 ease-in-out ${
            idx === sceneIndex ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
          }`}
          style={{
            backgroundImage: `url('${scene.image}')`,
          }}
          aria-label={scene.tagline}
          role="img"
        />
      ))}

      {/* ── Layered Gradient Overlays ── */}
      {/* Dark emerald base vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#021812]/95 via-[#005440]/60 to-black/35 z-10" />
      {/* Radial depth light */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#021812]/20 to-[#021812]/80 z-10" />

      {/* ── Top Bar: Logo & Scene Switcher ── */}
      <div className="relative z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#005440] to-[#0f6e56] border border-white/25 flex items-center justify-center text-white shadow-lg shadow-black/20">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white tracking-tight font-headline drop-shadow-sm leading-none">
              Kafla
            </span>
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-widest mt-1">
              Group Travel Workspace
            </span>
          </div>
        </div>

        {/* Scene Toggle Button */}
        <button
          onClick={handleToggleScene}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/35 hover:bg-black/50 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
          title="Switch background photo"
        >
          {React.createElement(currentScene.icon, { className: "w-3.5 h-3.5 text-emerald-300" })}
          <span>Scene: {currentScene.name}</span>
        </button>
      </div>

      {/* ── Center Content: Floating Widgets & Hero Copy ── */}
      <div className="relative z-20 max-w-2xl my-auto py-4">
        {/* Floating UI Artifacts (Showcase what Kafla does) */}
        <div className="flex flex-wrap items-center gap-3 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Widget 1: Live Trip Banner */}
          <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-3.5 py-2.5 text-white shadow-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/25 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">Dolomites Road Trip</p>
              <p className="text-[10px] text-emerald-200 font-medium">Day 3: Lake Braies & Pass Trek</p>
            </div>
            <div className="flex -space-x-1.5 ml-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-[9px] font-bold flex items-center justify-center border border-white/60">
                AK
              </span>
              <span className="w-5 h-5 rounded-full bg-amber-600 text-[9px] font-bold flex items-center justify-center border border-white/60">
                MR
              </span>
              <span className="w-5 h-5 rounded-full bg-sky-600 text-[9px] font-bold flex items-center justify-center border border-white/60">
                +3
              </span>
            </div>
          </div>

          {/* Widget 2: Expense Settled Pill */}
          <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-3.5 py-2.5 text-white shadow-xl flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-400/25 flex items-center justify-center text-emerald-300">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">Cabin Split Settled</p>
              <p className="text-[10px] text-white/80">Equal 5-way split • ₹0 balance</p>
            </div>
          </div>
        </div>

        {/* Main Headline */}
        <h2 className="text-3xl xl:text-5xl font-black text-white mb-4 leading-[1.15] font-headline tracking-tight drop-shadow-md">
          Turn group trip chaos into unforgettable journeys.
        </h2>

        {/* Subtitle */}
        <p className="text-sm xl:text-base text-white/90 mb-6 leading-relaxed font-medium drop-shadow-xs max-w-xl">
          The collaborative workspace where squads map out AI-powered daily itineraries, split shared
          costs without spreadsheets, and coordinate in real-time.
        </p>

        {/* 3-Pillar Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 transition-all text-white">
            <div className="w-8 h-8 rounded-xl bg-emerald-400/20 flex items-center justify-center text-emerald-300 mb-2">
              <Calendar className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold font-headline mb-0.5">AI Itineraries</h4>
            <p className="text-[11px] text-white/75 leading-snug">
              Multi-day stop schedules and optimal routes.
            </p>
          </div>

          <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 transition-all text-white">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-300 mb-2">
              <Receipt className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold font-headline mb-0.5">Fair Splits</h4>
            <p className="text-[11px] text-white/75 leading-snug">
              Real-time shared balances with zero math chaos.
            </p>
          </div>

          <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 transition-all text-white">
            <div className="w-8 h-8 rounded-xl bg-sky-400/20 flex items-center justify-center text-sky-300 mb-2">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold font-headline mb-0.5">Live Squad Chat</h4>
            <p className="text-[11px] text-white/75 leading-snug">
              Instant group messaging & WebRTC video calls.
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar: Social Proof & Copyright ── */}
      <div className="relative z-20 flex items-center justify-between pt-4 border-t border-white/15 text-xs text-white/80">
        <div className="flex items-center gap-2">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
            ))}
          </div>
          <span className="font-semibold text-white/90">Loved by 2,500+ squads worldwide</span>
        </div>

        <span className="text-white/60 tracking-wider">© 2026 Kafla</span>
      </div>
    </section>
  );
}
