import React from "react";
import { Navigation, Bot, Split, CheckSquare } from "lucide-react";

const VALUE_PILLARS = [
  {
    icon: Navigation,
    title: "Google Maps Routes & Pacing",
    description: "Connect your daily stops on the map to see real driving distance, travel times, and pace.",
  },
  {
    icon: Bot,
    title: "AI Itinerary Generator",
    description: "Get a full day-by-day trip plan with places, timings, and estimated costs in seconds.",
  },
  {
    icon: Split,
    title: "Simplified Debt Splitting",
    description: "Split bills equally or by exact amounts. Automatically cut 10 debts down to 2 simple payments.",
  },
  {
    icon: CheckSquare,
    title: "Shared Packing List",
    description: "Assign gear and luggage to members so nobody forgets essentials or brings duplicate items.",
  },
];

export const ValueMetricsBar: React.FC = () => {
  return (
    <section className="py-12 bg-white border-y border-[#bec9c3]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {VALUE_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="flex items-start gap-4 p-4 rounded-2xl hover:bg-[#f7faf6] transition-colors text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#c9eadb]/60 flex items-center justify-center text-[#005440] shrink-0">
                  <Icon className="w-6 h-6 text-[#005440]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#181d1a]">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#3f4944] mt-1 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
