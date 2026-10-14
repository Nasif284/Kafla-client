import React from "react";
import { Clock, MapPin } from "lucide-react";
import { CATEGORY_CFG } from "../utils/data";

interface TripItineraryGhostPreviewProps {
  destination?: string;
}

export default function TripItineraryGhostPreview({ destination }: TripItineraryGhostPreviewProps) {
  const destName = destination?.trim() || "City Center";

  const sampleStops = [
    {
      time: "09:00 AM",
      title: "Artisan Coffee & Morning Pastries",
      category: CATEGORY_CFG.FOOD,
      duration: "45m",
      location: `Café Central, ${destName}`,
      description: "Fuel up before exploring the historic district with fresh roast and local treats.",
    },
    {
      time: "11:30 AM",
      title: "Guided Landmark & Heritage Tour",
      category: CATEGORY_CFG.SIGHTSEEING,
      duration: "2h",
      location: `${destName} Old Town`,
      description: "Explore iconic architecture, scenic photo spots, and hidden alleys with the crew.",
    },
    {
      time: "07:30 PM",
      title: "Sunset Dinner & Rooftop Drinks",
      category: CATEGORY_CFG.FOOD,
      duration: "1h 30m",
      location: `Skyline Bistro, ${destName}`,
      description: "Celebrate day one with regional cuisine, cocktails, and sunset skyline views.",
    },
  ];

  return (
    <div className="w-full mt-8 pt-8 border-t border-[#bec9c3]/20 text-left">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6f7a74]">
            Inspiration Preview
          </span>
          <span className="text-[10px] bg-[#f1f4f1] text-[#3f4944] px-2 py-0.5 rounded-full font-medium">
            Sample Day 1
          </span>
        </div>
        <span className="text-[11px] text-[#6f7a74] italic hidden sm:inline">
          Real-time collaborative planning
        </span>
      </div>

      <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-[#0f6e56]/40 before:via-[#bec9c3]/30 before:to-transparent">
        {sampleStops.map((stop, idx) => (
          <div
            key={idx}
            className="relative bg-[#f8faf8]/70 border border-[#bec9c3]/25 rounded-xl p-3 sm:p-3.5 transition-all hover:bg-white hover:border-[#bec9c3]/50 hover:shadow-xs group"
          >
            {/* Timeline connector dot */}
            <div className="absolute -left-[19px] top-4 w-2 h-2 rounded-full border-2 border-white bg-[#0f6e56] shadow-xs" />

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-bold text-[#3f4944] tabular-nums">
                    {stop.time}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${stop.category.bg} ${stop.category.color}`}
                  >
                    {stop.category.label}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#181d1a] truncate">
                    {stop.title}
                  </h4>
                </div>
                <p className="text-[11px] text-[#3f4944]/80 leading-relaxed mb-1.5">
                  {stop.description}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-[#6f7a74]">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {stop.duration}
                  </span>
                  <span className="flex items-center gap-1 truncate max-w-[200px]">
                    <MapPin size={12} /> {stop.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
