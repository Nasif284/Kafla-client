"use client";

import React from "react";
import {
  MapPin,
  Plus,
  MoreVertical,
  Pencil,
  ArrowLeftRight,
  Printer,
  Trash2,
  Clock,
} from "lucide-react";
import { ItineraryActivityDTO, ItineraryDayDTO } from "../interfaces/interfaces";
import { DailyWeatherForecast } from "../../../interfaces/interface";
import { formatFullDate } from "../utils/helpers";
import DayWeatherBadge from "./DayWeatherBadge";
import RouteMapCanvas from "./RouteMapCanvas";
import DayPacingBanner from "./DayPacingBanner";
import ActivityCard from "./ActivityCard";
import ActivityRouteConnector from "./ActivityRouteConnector";

interface DayFocusViewProps {
  selectedDay: ItineraryDayDTO;
  dayIndex: number;
  totalDays: number;
  isPast: boolean;
  completedCount: number;
  selectedDayForecast?: DailyWeatherForecast;
  sortedActivities: ItineraryActivityDTO[];
  routeAnalysis: ReturnType<typeof import("../utils/routeIntelligence").analyzeDayRoute>;
  dayMenuOpen: boolean;
  setDayMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onEditDayInfo: () => void;
  onDeleteDay: () => void;
  onSwapDay: () => void;
  onExportDay: () => void;
  onAddActivity: () => void;
  onEditActivity: (activity: ItineraryActivityDTO) => void;
  onDeleteActivity: (activityId: string) => void;
  onToggleComplete: (activityId: string) => void;
  onQuickShiftStartTime: (activity: ItineraryActivityDTO, newStartTime: string) => void;
}

export default function DayFocusView({
  selectedDay,
  dayIndex,
  totalDays,
  isPast,
  completedCount,
  selectedDayForecast,
  sortedActivities,
  routeAnalysis,
  dayMenuOpen,
  setDayMenuOpen,
  onEditDayInfo,
  onDeleteDay,
  onSwapDay,
  onExportDay,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  onToggleComplete,
  onQuickShiftStartTime,
}: DayFocusViewProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Day header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#bec9c3] mb-1">
            Day {dayIndex + 1} · {formatFullDate(selectedDay.date)}
          </p>
          {selectedDay.location ? (
            <div className="flex items-center gap-1.5 text-[#0f6e56] font-bold text-sm mb-1">
              <MapPin size={14} /> {selectedDay.location}
            </div>
          ) : (
            <button
              onClick={onEditDayInfo}
              className="text-xs font-semibold text-[#6f7a74] hover:text-[#0f6e56] transition-colors mb-1 inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus size={13} /> Add city / area label
            </button>
          )}
          {selectedDay.summary && (
            <p className="text-[#3f4944] text-sm leading-relaxed">{selectedDay.summary}</p>
          )}
          {selectedDay.activities && selectedDay.activities.length > 0 && (
            <p className="text-[10px] text-[#bec9c3] mt-1 font-medium">
              {completedCount}/{selectedDay.activities.length} completed
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
          {/* Day 3-dot menu */}
          {!isPast && (
            <div className="relative">
              <button
                onClick={() => setDayMenuOpen((v) => !v)}
                className="p-2 rounded-lg text-[#3f4944] hover:bg-[#f1f4f1] transition-colors cursor-pointer"
                aria-label="Day options"
              >
                <MoreVertical size={16} />
              </button>
              {dayMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDayMenuOpen(false)} />
                  <div className="absolute right-0 top-10 z-20 bg-white border border-[#bec9c3]/20 rounded-xl shadow-lg overflow-hidden w-44">
                    <button
                      onClick={() => {
                        setDayMenuOpen(false);
                        onEditDayInfo();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-[#181d1a] hover:bg-[#f1f4f1] transition-colors cursor-pointer"
                    >
                      <Pencil size={13} /> Edit day info
                    </button>
                    {totalDays > 1 && (
                      <button
                        onClick={() => {
                          setDayMenuOpen(false);
                          onSwapDay();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-[#181d1a] hover:bg-[#f1f4f1] transition-colors border-t border-[#f6f3ef] cursor-pointer"
                      >
                        <ArrowLeftRight size={13} /> Swap with another day
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setDayMenuOpen(false);
                        onExportDay();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-[#181d1a] hover:bg-[#f1f4f1] transition-colors border-t border-[#f6f3ef] cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#005440]" />
                      <span>Export Day PDF</span>
                    </button>
                    <button
                      onClick={onDeleteDay}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/20 transition-colors border-t border-[#f6f3ef] cursor-pointer"
                    >
                      <Trash2 size={13} /> Delete day
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Export Day button */}
          <button
            onClick={onExportDay}
            className="flex items-center gap-1.5 bg-white border border-[#bec9c3]/50 text-[#181d1a] hover:bg-[#f1f4f1] px-3 py-2.5 rounded-xl font-bold text-xs transition-all shadow-2xs cursor-pointer"
            title="Export this day as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-[#005440]" />
            <span className="hidden sm:inline">Export Day</span>
          </button>

          {/* Add activity button */}
          {!isPast && (
            <button
              onClick={onAddActivity}
              className="flex items-center gap-1.5 bg-[#0f6e56] text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-[#005440] active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <Plus size={13} /> Add activity
            </button>
          )}
        </div>
      </div>

      {/* Day Weather Card Banner */}
      {selectedDayForecast && <DayWeatherBadge forecast={selectedDayForecast} variant="card" />}

      {/* Progress bar */}
      {selectedDay.activities && selectedDay.activities.length > 0 && (
        <div className="w-full h-1.5 bg-[#e0e3e0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0f6e56] rounded-full transition-all duration-500"
            style={{
              width: `${(completedCount / selectedDay.activities.length) * 100}%`,
            }}
          />
        </div>
      )}

      {/* Day Route Map Canvas */}
      {sortedActivities.length > 0 && (
        <RouteMapCanvas
          dayNumber={dayIndex + 1}
          dayDate={selectedDay.date}
          activities={sortedActivities}
          daySummary={selectedDay.summary}
          dayLocation={selectedDay.location}
        />
      )}

      {/* Day Route & Pacing Health Banner */}
      <DayPacingBanner
        analysis={routeAnalysis}
        totalActivitiesCount={sortedActivities.length}
      />

      {/* Activities list */}
      {!selectedDay.activities || selectedDay.activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 sm:py-18 text-center bg-[#fafbfa] border-2 border-dashed border-[#bec9c3]/30 rounded-2xl sm:rounded-3xl p-6">
          <div className="w-14 h-14 bg-white shadow-sm border border-[#bec9c3]/20 rounded-2xl flex items-center justify-center mb-3.5 text-[#0f6e56]">
            <Clock size={24} />
          </div>
          <h4 className="text-base font-bold text-[#181d1a] mb-1 font-headline">
            No activities for Day {dayIndex + 1}
          </h4>
          <p className="text-[#6f7a74] text-xs mb-5 max-w-xs leading-relaxed">
            Map out your travel stops, check-ins, dining spots, or sightseeing for this day.
          </p>
          {!isPast && (
            <button
              onClick={onAddActivity}
              className="flex items-center gap-1.5 bg-[#0f6e56] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-[#005440] transition-all shadow-sm cursor-pointer"
            >
              <Plus size={13} /> Add first stop for Day {dayIndex + 1}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-0">
          {sortedActivities.map((activity, aIdx) => (
            <div key={activity.id}>
              <ActivityCard
                activity={activity}
                isReadOnly={isPast}
                onEdit={() => onEditActivity(activity)}
                onDelete={() => onDeleteActivity(activity.id)}
                onToggleComplete={() => onToggleComplete(activity.id)}
              />

              {/* Route Intelligence Connector */}
              {aIdx < sortedActivities.length - 1 && routeAnalysis.segments[aIdx] && (
                <ActivityRouteConnector
                  segment={routeAnalysis.segments[aIdx]}
                  onShiftTime={(suggestedTime) =>
                    onQuickShiftStartTime(sortedActivities[aIdx + 1], suggestedTime)
                  }
                />
              )}
            </div>
          ))}

          {/* Add more activity button */}
          {!isPast && (
            <div className="pt-3">
              <button
                onClick={onAddActivity}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#bec9c3]/40 text-[#3f4944] py-3.5 rounded-xl font-bold text-xs hover:border-[#0f6e56]/40 hover:text-[#0f6e56] hover:bg-[#c9eadb]/10 transition-all cursor-pointer"
              >
                <Plus size={13} /> Add another stop to Day {dayIndex + 1}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
