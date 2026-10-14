import React from "react";
import Link from "next/link";
import { ArrowRight, UserPlus, MapPin, IndianRupee } from "lucide-react";
import { HOW_IT_WORKS_STEPS } from "../data/landingData";

export const HowItWorksSection: React.FC = () => {
  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <UserPlus className="w-6 h-6 text-[#005440]" />;
      case 1:
        return <MapPin className="w-6 h-6 text-[#005440]" />;
      case 2:
        return <IndianRupee className="w-6 h-6 text-[#005440]" />;
      default:
        return <MapPin className="w-6 h-6 text-[#005440]" />;
    }
  };

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-[#f7faf6] border-y border-[#bec9c3]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-bold uppercase tracking-wider text-[#005440] bg-[#c9eadb]/60 px-3.5 py-1.5 rounded-full inline-block">
            Simple 3-Step Flow
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#181d1a] tracking-tight mt-3">
            How Kafla Works
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#3f4944]">
            From planning the first idea to the final expense settlement in three simple steps.
          </p>
        </div>

        {/* Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <div
              key={step.number}
              className="relative bg-white rounded-3xl p-8 sm:p-10 border border-[#bec9c3]/35 text-left flex flex-col justify-between hover:border-[#005440]/40 transition-all hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-heading font-black text-3xl text-[#005440]/30">
                    {step.number}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#ebefeb] flex items-center justify-center">
                    {getStepIcon(idx)}
                  </div>
                </div>

                <h3 className="font-heading text-xl font-bold text-[#181d1a] mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-[#3f4944] leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#bec9c3]/20 flex items-center justify-between">
                <span className="text-xs font-bold text-[#005440] tracking-wider uppercase">
                  Step {idx + 1} of 3
                </span>
                <span className="text-xs font-semibold text-[#5a6460]">
                  {step.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-14 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-[#005440] hover:bg-[#0f6e56] text-white font-bold text-sm px-8 py-4 rounded-full shadow-md shadow-[#005440]/20 transition-all active:scale-95"
          >
            <span>Start Your Free Trip</span>
            <ArrowRight className="w-4 h-4 text-[#a0f3d4]" />
          </Link>
        </div>
      </div>
    </section>
  );
};
