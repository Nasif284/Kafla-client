import React from "react";
import { GeneratedItinerary } from "./types";
import {
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Save,
  Shuffle,
  Trash2,
  MapPin,
  Loader2,
} from "lucide-react";
import { ItineraryGenerationLoader } from "./ItineraryGenerationLoader";
import ActivityRouteConnector from "../ActivityRouteConnector";
import DayPacingBanner from "../DayPacingBanner";
import { analyzeDayRoute } from "../../utils/routeIntelligence";

function dayLabel(index: number) {
  return `Day ${index + 1}`;
}

interface Props {
  itinerary: GeneratedItinerary | null;
  generating: boolean;
  saving: boolean;
  onDeleteActivity: (dayIndex: number, actIndex: number) => void;
  onSwapActivity: (dayIndex: number, actIndex: number) => void;
  onRegenerateDay: (dayIndex: number) => void;
  swappingKey: string | null;
  regeneratingDayIdx: number | null;
  onBack: () => void;
  onRegenerate: () => void;
  onSave: () => void;
  onClose: () => void;
}

export function GeneratedItineraryView({
  itinerary,
  generating,
  saving,
  onDeleteActivity,
  onSwapActivity,
  onRegenerateDay,
  swappingKey,
  regeneratingDayIdx,
  onBack,
  onRegenerate,
  onSave,
  onClose,
}: Props) {
  // Loading Screen
  if (generating) {
    return <ItineraryGenerationLoader onCancel={onBack} />;
  }

  // No Itinerary or Error
  if (!itinerary) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4 min-h-[350px]">
        <p className="text-sm font-bold text-[#181d1a]">No itinerary generated yet</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-[#005440] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Settings
        </button>
      </div>
    );
  }

  // Render Generated Itinerary
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Subheader bar */}
      <div className="px-6 py-3.5 bg-[#f1f4f1] border-b border-[#bec9c3]/20 flex items-center justify-between flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#3f4944] hover:text-[#005440] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Edit Preferences</span>
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-[#181d1a]">
            {itinerary.days.length}-Day Itinerary Generated
          </span>
          <CheckCircle2 size={18} className="text-[#005440]" />
        </div>
      </div>

      {/* Scrollable Day-by-Day List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6">
        {itinerary.days.map((day, i) => {
          const dayRouteAnalysis = analyzeDayRoute(day.activities);
          return (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#bec9c3]/30 p-4 sm:p-5 shadow-xs space-y-3"
            >
              {/* Day Header */}
              <div className="flex items-start justify-between border-b border-[#bec9c3]/20 pb-3 gap-2">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#005440]">
                    {dayLabel(i)} — {day.date}
                  </span>
                  <h4 className="text-sm font-bold text-[#181d1a] mt-0.5">
                    {day.summary ?? day.location ?? "Sightseeing & Exploration"}
                  </h4>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {day.location && (
                    <span className="hidden sm:inline-block text-[11px] font-medium text-[#6f7a74] bg-[#f1f4f1] px-2.5 py-1 rounded-full">
                      {day.location}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onRegenerateDay(i)}
                    disabled={regeneratingDayIdx === i || generating || saving}
                    className="text-[11px] font-semibold text-[#005440] hover:bg-[#c9eadb] bg-[#f1f4f1] border border-[#bec9c3]/40 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    title="Regenerate this specific day"
                  >
                    {regeneratingDayIdx === i ? (
                      <>
                        <Loader2 className="animate-spin w-3 h-3 text-[#005440]" />
                        <span>Refreshing…</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw size={14} />
                        <span className="hidden sm:inline">Regenerate Day</span>
                        <span className="sm:hidden">Day</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Day Route & Pacing Health Banner */}
              {day.activities.length > 1 && (
                <div className="pt-1">
                  <DayPacingBanner
                    analysis={dayRouteAnalysis}
                    totalActivitiesCount={day.activities.length}
                  />
                </div>
              )}

              {/* Activities list */}
              {day.activities.length > 0 ? (
                <div className="space-y-0 pt-1">
                  {day.activities.map((act, j) => {
                    const isSwapping = swappingKey === `${i}-${j}`;
                    return (
                      <React.Fragment key={j}>
                        <div
                          className={`flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-[#bec9c3]/30 hover:bg-[#f7f9f7] transition-all group ${
                            isSwapping ? "opacity-60 bg-[#f7f9f7]" : ""
                          }`}
                        >
                          <span className="text-[11px] font-bold text-[#005440] bg-[#c9eadb]/50 px-2 py-0.5 rounded-md shrink-0 mt-0.5">
                            {act.startTime ?? "—"}
                          </span>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-xs font-bold text-[#181d1a]">{act.title}</p>
                              <span className="text-[9px] uppercase font-bold tracking-wider text-[#6f7a74] bg-[#e5e9e5] px-1.5 py-0.5 rounded">
                                {act.category}
                              </span>
                              {act.durationMinutes && (
                                <span className="text-[10px] text-[#6f7a74]">
                                  {act.durationMinutes} min
                                </span>
                              )}
                            </div>
                            {act.location && (
                              <p className="text-[11px] text-[#6f7a74] mt-0.5 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#005440] shrink-0" />
                                <span>{act.location}</span>
                              </p>
                            )}
                            {act.description && (
                              <p className="text-[11px] text-[#3f4944] mt-1">{act.description}</p>
                            )}
                          </div>

                          {/* Card Action Controls: Swap & Delete */}
                          <div className="flex items-center gap-1 shrink-0 self-center">
                            <button
                              type="button"
                              onClick={() => onSwapActivity(i, j)}
                              disabled={isSwapping || generating || saving}
                              className="px-2 py-1 rounded-lg text-[11px] font-semibold text-[#005440] hover:bg-[#c9eadb] bg-[#f1f4f1] border border-[#bec9c3]/30 flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                              title="Swap with another nearby place"
                            >
                              {isSwapping ? (
                                <Loader2 className="animate-spin w-3 h-3 text-[#005440]" />
                              ) : (
                                <Shuffle size={14} />
                              )}
                              <span className="hidden sm:inline">Swap</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onDeleteActivity(i, j)}
                              disabled={generating || saving}
                              className="p-1.5 rounded-lg text-[#6f7a74] hover:text-[#ba1a1a] hover:bg-red-50 transition-colors cursor-pointer"
                              title="Remove activity from preview"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {j < day.activities.length - 1 && dayRouteAnalysis.segments[j] && (
                          <ActivityRouteConnector segment={dayRouteAnalysis.segments[j]} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-[#6f7a74] italic">No activities planned for this day.</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Action Footer */}
      <div className="p-4 sm:p-5 bg-white border-t border-[#bec9c3]/20 flex items-center justify-between gap-3 flex-shrink-0">
        <button
          onClick={onClose}
          className="px-4 h-11 border border-[#bec9c3]/50 text-[#3f4944] hover:bg-[#e5e9e5] font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          Discard / Close
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRegenerate}
            disabled={generating || saving}
            className="h-11 px-4 bg-[#e5e9e5] text-[#005440] font-bold text-xs rounded-xl hover:bg-[#e0e3e0] transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={14} /> Regenerate All
          </button>

          <button
            onClick={onSave}
            disabled={saving}
            className="h-11 px-6 bg-[#0f6e56] hover:bg-[#005440] text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-70 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin w-3.5 h-3.5" />
                Saving Itinerary…
              </>
            ) : (
              <>
                <Save size={14} /> Save Itinerary to Trip
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
