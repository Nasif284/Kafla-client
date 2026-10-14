"use client";

import Link from "next/link";
import { useState } from "react";
import { Compass, ArrowLeft, Users, AlertCircle } from "lucide-react";
import JoinTripModal from "./JoinTripModal";

export default function TripNotFoundState() {
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  return (
    <div className="w-full max-w-xl mx-auto py-12 sm:py-20 text-center">
      <div className="bg-white rounded-3xl border border-[#bec9c3]/30 p-8 sm:p-12 shadow-sm relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-36 bg-[#c9eadb]/30 rounded-full blur-2xl pointer-events-none" />

        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#f1f4f1] border border-[#bec9c3]/30 flex items-center justify-center text-[#005440] mb-5 shadow-xs">
          <Compass className="w-8 h-8 text-[#005440]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-3">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>Trip Not Found</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-[#181d1a] font-headline mb-2">
          We Couldn't Find This Trip
        </h2>

        <p className="text-xs sm:text-sm text-[#3f4944] leading-relaxed mb-8 max-w-md mx-auto font-medium">
          This trip group may have been deleted, or you might not have joined it yet. Check the URL or return to your group trips dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/trips/groups"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#005440] hover:bg-[#0f6e56] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Trips</span>
          </Link>

          <button
            onClick={() => setJoinModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-[#f1f4f1] border border-[#bec9c3]/50 text-[#005440] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-2xs active:scale-95 transition-all cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Join with Code</span>
          </button>
        </div>
      </div>

      <JoinTripModal isOpen={joinModalOpen} onClose={() => setJoinModalOpen(false)} />
    </div>
  );
}
