"use client";

import React, { useState } from "react";
import { ItineraryActivityDTO, ItineraryDayDTO } from "../interfaces/interfaces";
import { formatDayLabel, formatDayNum, formatFullDate, formatDateOnly } from "../utils/helpers";
import ActivityCard from "./ActivityCard";
import SwapDaysModal from "./SwapDaysModal";
import DayWeatherBadge from "./DayWeatherBadge";
import ActivityRouteConnector from "./ActivityRouteConnector";
import DayPacingBanner from "./DayPacingBanner";
import RouteMapCanvas from "./RouteMapCanvas";
import { analyzeDayRoute } from "../utils/routeIntelligence";
import { DailyWeatherForecast } from "../../../interfaces/interface";
import { Printer, MapPin, Pencil, Plus, ArrowRight, ArrowLeftRight } from "lucide-react";

interface FullTripTimelineProps {
  groupId: string;
  days: ItineraryDayDTO[];
  forecasts?: DailyWeatherForecast[];
  onAddActivity: (day: ItineraryDayDTO, dayIndex: number) => void;
  onEditActivity: (day: ItineraryDayDTO, activity: ItineraryActivityDTO) => void;
  onDeleteActivity: (dayId: string, activityId: string) => void;
  onToggleComplete: (dayId: string, activityId: string) => void;
  onEditDayInfo: (day: ItineraryDayDTO, dayIndex: number) => void;
  onFocusDay: (date: Date) => void;
  onExportDay?: (day: ItineraryDayDTO, dayNumber: number) => void;
  onExportFull?: () => void;
  isReadOnly?: boolean;
}

export default function FullTripTimeline({
  groupId,
  days,
  forecasts,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  onToggleComplete,
  onEditDayInfo,
  onFocusDay,
  onExportDay,
  onExportFull,
  isReadOnly = false,
}: FullTripTimelineProps) {
  const [swapSourceDay, setSwapSourceDay] = useState<ItineraryDayDTO | null>(null);

  if (days.length === 0) {
    return null;
  }

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6 pb-16">
        {/* Full Timeline Header Row */}
        <div className="flex items-center justify-between gap-3 px-1 pt-1">
          <div>
            <h2 className="text-base sm:text-lg font-headline font-bold text-[#181d1a]">
              Full Trip Timeline
            </h2>
            <p className="text-xs text-[#6f7a74]">
              {days.length} Days · {days.reduce((sum, d) => sum + (d.activities?.length || 0), 0)} Scheduled Activities
            </p>
          </div>

          {onExportFull && (
            <button
              onClick={onExportFull}
              className="flex items-center gap-1.5 bg-white border border-[#bec9c3]/50 text-[#181d1a] hover:bg-[#f1f4f1] px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all shadow-2xs cursor-pointer"
              title="Export complete trip itinerary as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[#005440]" />
              <span className="hidden sm:inline">Export Full PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
          )}
        </div>

        {/* Master Full Trip Route Map (Option B: Collapsible Header) */}
        <RouteMapCanvas
          days={days}
          title="Complete Trip Journey Route Map"
          defaultExpanded={false}
        />

        {days.map((day, idx) => {
          const dayDate = new Date(day.date);
          const dayNumber = idx + 1;
          const dayDateStr = formatDateOnly(dayDate);
          const dayForecast = forecasts?.find((f) => f.date === dayDateStr);
          const sortedActivities = [...(day.activities || [])].sort((a, b) => {
            if (!a.startTime) return 1;
            if (!b.startTime) return -1;
            return a.startTime.localeCompare(b.startTime);
          });
          const dayRouteAnalysis = analyzeDayRoute(sortedActivities);
          const completedCount = sortedActivities.filter((a) => a.isCompleted).length;

          return (
            <div
              key={day.id || day.date.toString()}
              className="relative bg-white border border-[#bec9c3]/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm hover:border-[#0f6e56]/30 transition-all"
            >
              {/* Day Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#f1f4f1]">
                <div className="flex items-center gap-3">
                  {/* Date Badge */}
                  <div className="w-12 h-12 rounded-2xl bg-[#f1f4f1] flex flex-col items-center justify-center text-[#181d1a] shrink-0 font-headline">
                    <span className="text-[10px] font-bold uppercase text-[#6f7a74] leading-tight">
                      {formatDayLabel(dayDate)}
                    </span>
                    <span className="text-base font-black leading-tight">
                      {formatDayNum(dayDate)}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-black text-[#181d1a] tracking-tight font-headline">
                        Day {dayNumber}
                      </h3>
                      <span className="text-xs text-[#6f7a74] font-medium">
                        · {formatFullDate(dayDate)}
                      </span>
                      {day.location && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0f6e56] bg-[#c9eadb]/40 px-2.5 py-0.5 rounded-full">
                          <MapPin size={12} /> {day.location}
                        </span>
                      )}
                      {dayForecast && (
                        <DayWeatherBadge forecast={dayForecast} size="sm" />
                      )}
                    </div>
                    {day.summary && (
                      <p className="text-xs text-[#3f4944] mt-0.5 line-clamp-2 leading-relaxed">
                        {day.summary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Day Header Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {!isReadOnly && days.length > 1 && (
                    <button
                      onClick={() => setSwapSourceDay(day)}
                      className="px-2 py-1.5 rounded-lg text-xs font-bold text-[#6f7a74] hover:text-[#0f6e56] hover:bg-[#f1f4f1] transition-colors cursor-pointer flex items-center gap-1"
                      title="Swap this day with another day"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Swap</span>
                    </button>
                  )}

                  <button
                    onClick={() => onFocusDay(dayDate)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#3f4944] hover:text-[#0f6e56] hover:bg-[#f1f4f1] transition-colors flex items-center gap-1 cursor-pointer"
                    title="Focus on this day only"
                  >
                    <span>Focus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {!isReadOnly && (
                    <button
                      onClick={() => onEditDayInfo(day, dayNumber)}
                      className="p-1.5 rounded-lg text-[#6f7a74] hover:text-[#181d1a] hover:bg-[#f1f4f1] transition-colors cursor-pointer"
                      title="Edit day location or summary"
                    >
                      <Pencil size={13} />
                    </button>
                  )}

                  {onExportDay && (
                    <button
                      onClick={() => onExportDay(day, dayNumber)}
                      className="p-1.5 rounded-lg text-[#6f7a74] hover:text-[#005440] hover:bg-[#f1f4f1] transition-colors cursor-pointer"
                      title={`Export Day ${dayNumber} PDF`}
                      aria-label={`Export Day ${dayNumber} PDF`}
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  )}

                  {!isReadOnly && (
                    <button
                      onClick={() => onAddActivity(day, dayNumber)}
                      className="flex items-center gap-1 bg-[#0f6e56] text-white px-3 py-1.5 rounded-xl font-bold text-xs hover:bg-[#005440] active:scale-95 transition-all shadow-sm cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>Add activity</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Day Route Map Canvas (Option B: Collapsible Header) */}
              {sortedActivities.length > 0 && (
                <div className="mb-4">
                  <RouteMapCanvas
                    dayNumber={dayNumber}
                    dayDate={dayDate}
                    activities={sortedActivities}
                    daySummary={day.summary}
                    dayLocation={day.location}
                  />
                </div>
              )}

              {/* Day Route & Pacing Health Banner */}
              {sortedActivities.length > 1 && (
                <div className="mb-4">
                  <DayPacingBanner
                    analysis={dayRouteAnalysis}
                    totalActivitiesCount={sortedActivities.length}
                  />
                </div>
              )}

              {/* Activities Timeline / List */}
              {sortedActivities.length > 0 ? (
                <div className="space-y-0">
                  {sortedActivities.map((activity, aIdx) => (
                    <div key={activity.id}>
                      <ActivityCard
                        activity={activity}
                        isReadOnly={isReadOnly}
                        onEdit={() => onEditActivity(day, activity)}
                        onDelete={() => onDeleteActivity(day.id, activity.id)}
                        onToggleComplete={() => onToggleComplete(day.id, activity.id)}
                      />
                      {aIdx < sortedActivities.length - 1 && dayRouteAnalysis.segments[aIdx] && (
                        <ActivityRouteConnector segment={dayRouteAnalysis.segments[aIdx]} />
                      )}
                    </div>
                  ))}
                  {completedCount > 0 && (
                    <div className="pt-3 flex items-center justify-end text-[11px] font-bold text-[#6f7a74]">
                      <span>
                        {completedCount} of {sortedActivities.length} activities completed
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* Inline Empty Day Canvas */
                <div className="border border-dashed border-[#bec9c3]/30 rounded-2xl p-6 text-center bg-[#f8faf8]/50">
                  <p className="text-xs text-[#6f7a74] mb-3">
                    No activities scheduled for this day yet.
                  </p>
                  <button
                    onClick={() => onAddActivity(day, dayNumber)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#bec9c3]/30 text-xs font-bold text-[#0f6e56] hover:bg-[#f1f4f1] transition-all shadow-2xs cursor-pointer"
                  >
                    <Plus size={13} /> Add first stop
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {swapSourceDay && (
        <SwapDaysModal
          isOpen={Boolean(swapSourceDay)}
          onClose={() => setSwapSourceDay(null)}
          groupId={groupId}
          sourceDay={swapSourceDay}
          allDays={days}
        />
      )}
    </>
  );
}
