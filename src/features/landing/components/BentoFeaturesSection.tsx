import React from "react";
import {
  Split,
  Bot,
  Video,
  CheckSquare,
  Sparkles,
  ArrowRight,
  IndianRupee,
  Layers,
  CheckCircle2,
  User,
} from "lucide-react";
import { MOCK_DEBT_TRANSFERS, MOCK_CHECKLIST } from "../data/landingData";

export const BentoFeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 md:py-32 bg-white border-t border-[#bec9c3]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ebefeb] border border-[#bec9c3]/30 text-[#005440] text-xs font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-[#005440]" />
            <span>Core Features</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#181d1a] tracking-tight">
            Built for How Groups Actually Travel
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#3f4944] leading-relaxed">
            Eliminate awkward money talks, messy packing, and lost plans. Everything
            your squad needs is synchronized in one place.
          </p>
        </div>

        {/* 12-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Card 1 (7 cols): Simplified Debt Minimizer */}
          <div className="md:col-span-7 bg-[#f7faf6] rounded-3xl p-6 sm:p-10 border border-[#bec9c3]/35 shadow-xs text-left flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#c9eadb]/70 flex items-center justify-center text-[#005440] mb-6">
                <Split className="w-6 h-6 text-[#005440]" />
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#181d1a]">
                Simplified Expense Splits & Debt Minimizer
              </h3>
              <p className="text-sm sm:text-base text-[#3f4944] mt-2.5 leading-relaxed">
                Split costs equally, by exact rupee amounts, or by percentage. Our debt
                minimizer calculates the net balance for everyone and cuts 10 confusing
                transfers down to just 2 direct payments.
              </p>
            </div>

            {/* Visual Debt Minimizer Simulation Box */}
            <div className="mt-8 pt-6 border-t border-[#bec9c3]/20 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold pb-1">
                <span className="text-[#181d1a]">Automated Debt Minimization</span>
                <span className="text-[#005440] bg-[#c9eadb]/70 px-2.5 py-0.5 rounded-full">
                  10 Debts → 2 Direct Payments
                </span>
              </div>

              {MOCK_DEBT_TRANSFERS.map((transfer, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#bec9c3]/25 text-xs shadow-2xs"
                >
                  <div className="flex items-center gap-2 text-[#181d1a] font-medium">
                    <span className="font-bold text-[#3f4944]">{transfer.from}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#6f7a74]" />
                    <span className="font-bold text-[#005440]">{transfer.to}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#181d1a]">
                      ₹{transfer.amount.toLocaleString("en-IN")}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#005440] text-white text-[11px] font-bold">
                      Settle Up
                    </span>
                  </div>
                </div>
              ))}

              <p className="text-[11px] text-[#5a6460] pt-1">
                Supports multiple payers on a single bill · Instant settle-up confirmation
              </p>
            </div>
          </div>

          {/* Card 2 (5 cols): AI Itinerary Assistant */}
          <div className="md:col-span-5 bg-[#f7faf6] rounded-3xl p-6 sm:p-10 border border-[#bec9c3]/35 shadow-xs text-left flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#c9eadb]/70 flex items-center justify-center text-[#005440] mb-6">
                <Bot className="w-6 h-6 text-[#005440]" />
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#181d1a]">
                AI Itinerary Assistant
              </h3>
              <p className="text-sm sm:text-base text-[#3f4944] mt-2.5 leading-relaxed">
                Tell our AI your destination, group budget, and travel speed. Get a full
                day-by-day plan with timings and estimated costs in seconds.
              </p>
            </div>

            {/* AI Prompt Snippet UI */}
            <div className="mt-8 pt-6 border-t border-[#bec9c3]/20 space-y-3">
              <div className="p-3.5 rounded-xl bg-white border border-[#bec9c3]/25 text-xs text-[#181d1a] font-medium text-left">
                "4-day road trip to Manali for 5 friends under ₹15,000 each with balanced pacing."
              </div>

              <div className="p-3.5 rounded-xl bg-[#c9eadb]/40 border border-[#005440]/20 text-xs text-[#005440] font-semibold text-left flex items-start gap-2">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Generated: 4-day plan with 12 stops, optimal driving routes, and estimated
                  budget of ₹12,400 per person.
                </span>
              </div>
            </div>
          </div>

          {/* Card 3 (5 cols): In-App Squad Video Calls */}
          <div className="md:col-span-5 bg-[#f7faf6] rounded-3xl p-6 sm:p-10 border border-[#bec9c3]/35 shadow-xs text-left flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#c9eadb]/70 flex items-center justify-center text-[#005440] mb-6">
                <Video className="w-6 h-6 text-[#005440]" />
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#181d1a]">
                Built-In Squad Video Calls
              </h3>
              <p className="text-sm sm:text-base text-[#3f4944] mt-2.5 leading-relaxed">
                Connect over group audio and video calls directly inside your trip room.
                Review accommodations and routes together without separate meeting links.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#bec9c3]/20">
              <div className="p-4 rounded-2xl bg-[#005440] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold">Live Squad Call · 4 Members</span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/15 text-[#a0f3d4]">
                  Join Room
                </span>
              </div>
            </div>
          </div>

          {/* Card 4 (7 cols): Shared Packing Checklist */}
          <div className="md:col-span-7 bg-[#f7faf6] rounded-3xl p-6 sm:p-10 border border-[#bec9c3]/35 shadow-xs text-left flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#c9eadb]/70 flex items-center justify-center text-[#005440] mb-6">
                <CheckSquare className="w-6 h-6 text-[#005440]" />
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#181d1a]">
                Shared Packing & Gear Checklists
              </h3>
              <p className="text-sm sm:text-base text-[#3f4944] mt-2.5 leading-relaxed">
                Assign essentials to specific friends so everyone knows who is packing
                what. Categorized by documents, gear, clothing, and medicine with priority tags.
              </p>
            </div>

            {/* Checklist Items Simulation */}
            <div className="mt-8 pt-6 border-t border-[#bec9c3]/20 space-y-2.5">
              {MOCK_CHECKLIST.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#bec9c3]/25 text-xs shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#005440]" />
                    <span className="font-bold text-[#181d1a]">{item.title}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#ebefeb] text-[11px] font-medium text-[#181d1a]">
                      <User className="w-3 h-3 text-[#005440]" />
                      {item.assignedTo}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.priority === "Urgent"
                          ? "bg-[#ffdad6] text-[#ba1a1a]"
                          : "bg-[#ffecd6] text-[#8c5200]"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
