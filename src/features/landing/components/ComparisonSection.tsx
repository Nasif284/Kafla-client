import React from "react";
import { COMPARISONS } from "../data/landingData";
import { XCircle, CheckCircle2, Scale } from "lucide-react";

export const ComparisonSection: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c9eadb]/60 text-[#005440] text-xs font-bold uppercase tracking-wider mb-3">
            <Scale className="w-3.5 h-3.5 text-[#005440]" />
            <span>The Difference</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#181d1a] tracking-tight">
            Why Groups Switch to Kafla
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#3f4944] leading-relaxed">
            See how much easier group travel becomes when you replace scattered chats
            and spreadsheets with one shared workspace.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Header Row for desktop */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#6f7a74]">
            <div className="col-span-3">Trip Part</div>
            <div className="col-span-4 text-[#ba1a1a]">Without Kafla</div>
            <div className="col-span-5 text-[#005440]">With Kafla</div>
          </div>

          {/* Rows */}
          {COMPARISONS.map((row) => (
            <div
              key={row.feature}
              className="rounded-2xl border border-[#bec9c3]/35 bg-[#f7faf6] p-5 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:border-[#005440]/30 transition-all shadow-2xs"
            >
              {/* Feature Dimension */}
              <div className="md:col-span-3">
                <span className="font-heading font-bold text-base text-[#181d1a]">
                  {row.feature}
                </span>
              </div>

              {/* Without Kafla */}
              <div className="md:col-span-4 p-3.5 rounded-xl bg-white border border-[#ba1a1a]/15 text-xs text-[#5a6460] space-y-1">
                <div className="flex items-center gap-1.5 text-[#ba1a1a] font-bold text-[11px] uppercase">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>The Messy Way</span>
                </div>
                <p className="leading-relaxed">{row.withoutKafla}</p>
              </div>

              {/* With Kafla */}
              <div className="md:col-span-5 p-3.5 rounded-xl bg-[#c9eadb]/35 border border-[#005440]/25 text-xs text-[#181d1a] space-y-1">
                <div className="flex items-center gap-1.5 text-[#005440] font-bold text-[11px] uppercase">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#005440]" />
                  <span>The Kafla Way</span>
                </div>
                <p className="leading-relaxed font-semibold">{row.withKafla}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
