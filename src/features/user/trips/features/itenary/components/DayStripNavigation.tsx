"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { ItineraryDayDTO } from "../interfaces/interfaces";
import { DailyWeatherForecast } from "../../../interfaces/interface";
import {
  formatDateOnly,
  formatDayLabel,
  formatDayNum,
  formatMonthShort,
  isSameDay,
} from "../utils/helpers";
import DayWeatherBadge from "./DayWeatherBadge";

interface DayStripNavigationProps {
  days: ItineraryDayDTO[];
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
  stripStart: number;
  onStripStartChange: (updater: (s: number) => number) => void;
  forecasts?: DailyWeatherForecast[];
}

const VISIBLE = 7;

export default function DayStripNavigation({
  days,
  selectedDate,
  onSelectDate,
  stripStart,
  onStripStartChange,
  forecasts,
}: DayStripNavigationProps) {
  const stripEnd = Math.min(stripStart + VISIBLE, days.length);
  const visibleDays = days.slice(stripStart, stripEnd);

  return (
    <div className="flex items-center gap-1.5 sm:gap-3 mt-3 pt-2.5 border-t border-[#f1f4f1]">
      <button
        onClick={() => onStripStartChange((s) => Math.max(0, s - 1))}
        disabled={stripStart === 0}
        className="p-1 sm:p-1.5 rounded-full hover:bg-[#f1f4f1] text-[#3f4944] transition-colors disabled:opacity-30 shrink-0 cursor-pointer"
        aria-label="Previous days"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Day chips */}
      <div className="flex gap-1.5 sm:gap-2 flex-1 overflow-x-auto hide-scrollbar py-0.5 scroll-smooth">
        {visibleDays.map((day, i) => {
          const dayDate = new Date(day.date);
          const isSelected = selectedDate ? isSameDay(dayDate, selectedDate) : false;
          const hasActivities = day.activities && day.activities.length > 0;
          const globalIdx = stripStart + i;
          const stripDateStr = formatDateOnly(dayDate);
          const stripDayForecast = forecasts?.find((f) => f.date === stripDateStr);

          return (
            <button
              key={day.id || day.date.toString()}
              onClick={() => onSelectDate(dayDate)}
              className={`flex-1 min-w-[56px] sm:min-w-0 flex flex-col items-center py-2 sm:py-2.5 px-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
                isSelected
                  ? "bg-[#0f6e56] text-white shadow-md"
                  : "hover:bg-[#f1f4f1] text-[#3f4944]"
              }`}
            >
              <span
                className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
                  isSelected ? "text-white/80" : "text-[#bec9c3]"
                }`}
              >
                {formatDayLabel(dayDate)}
              </span>
              <span
                className={`text-base sm:text-xl font-black leading-none mt-0.5 ${
                  isSelected ? "text-white" : "text-[#181d1a]"
                }`}
              >
                {formatDayNum(dayDate)}
              </span>
              <span
                className={`text-[9px] sm:text-[10px] font-bold ${
                  isSelected ? "text-white/80" : "text-[#bec9c3]"
                }`}
              >
                {formatMonthShort(dayDate)}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold mt-0.5 opacity-80 truncate">
                Day {globalIdx + 1}
              </span>

              {/* Compact weather indicator on day strip */}
              {stripDayForecast && (
                <DayWeatherBadge
                  forecast={stripDayForecast}
                  variant="strip"
                  selected={isSelected}
                />
              )}

              {/* Dot indicator */}
              <span
                className={`w-1.5 h-1.5 rounded-full mt-1 transition-colors ${
                  hasActivities
                    ? isSelected
                      ? "bg-white"
                      : "bg-[#0f6e56]"
                    : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Next */}
      <button
        onClick={() => onStripStartChange((s) => Math.min(days.length - VISIBLE, s + 1))}
        disabled={stripEnd >= days.length}
        className="p-1 sm:p-1.5 rounded-full hover:bg-[#f1f4f1] text-[#3f4944] transition-colors disabled:opacity-30 shrink-0 cursor-pointer"
        aria-label="Next days"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
