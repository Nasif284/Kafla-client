import React from "react";
import Link from "next/link";
import Logo from "@/src/components/Logo";

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#bec9c3]/30 text-[#3f4944] pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center">
              <Logo size={36} />
            </Link>
            <p className="text-sm text-[#5a6460] max-w-sm leading-relaxed">
              The collaborative group travel app. Coordinate day-by-day itineraries,
              see your routes on Google Maps, split shared expenses without math headaches,
              and connect via built-in video calls.
            </p>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="font-heading font-bold text-sm text-[#181d1a] uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a href="#route-map" className="hover:text-[#005440] transition-colors">
                  Google Maps & Routes
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#005440] transition-colors">
                  AI Itinerary Generator
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#005440] transition-colors">
                  Simplified Debt Splits
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#005440] transition-colors">
                  Shared Packing List
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#005440] transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Account & Access */}
          <div>
            <h4 className="font-heading font-bold text-sm text-[#181d1a] uppercase tracking-wider mb-3">
              Account
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/login" className="hover:text-[#005440] transition-colors">
                  Sign In to Squad
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-[#005440] transition-colors">
                  Create Free Account
                </Link>
              </li>
              <li>
                <Link href="/trips/groups" className="hover:text-[#005440] transition-colors">
                  Active Trips Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-[#bec9c3]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6f7a74]">
          <p>© {new Date().getFullYear()} Kafla. All rights reserved.</p>
          <p>Built for road trips, weekend getaways & squad expeditions.</p>
        </div>
      </div>
    </footer>
  );
};
