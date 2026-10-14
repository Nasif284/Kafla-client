import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export const LandingCTA: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#005440] text-white p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl shadow-[#005440]/25 text-center">
          {/* Subtle background glow accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0f6e56] rounded-full blur-3xl opacity-50 pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#a0f3d4] rounded-full blur-3xl opacity-20 pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#a0f3d4] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ready for your next journey?</span>
            </div>

            <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
              Start Planning Your Next Group Trip in Minutes
            </h2>

            <p className="text-base sm:text-lg text-[#c9eadb]/90 max-w-2xl mx-auto font-normal leading-relaxed">
              Create your trip room, invite your friends with a single link, and experience
              what stress-free group travel feels like.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-[#005440] text-base font-bold shadow-lg hover:bg-[#c9eadb] hover:translate-y-[-1px] transition-all active:scale-95"
              >
                <span>Create Your Free Trip</span>
                <ArrowRight className="w-4 h-4 text-[#005440]" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/10 text-white border border-white/20 text-base font-semibold hover:bg-white/20 transition-all active:scale-95"
              >
                <span>Sign In to Existing Trip</span>
              </Link>
            </div>

            <div className="pt-4 flex items-center justify-center gap-2 text-xs text-[#c9eadb]/70 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#a0f3d4]" />
              <span>100% free for groups · Instant invite links · PDF exports included</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
