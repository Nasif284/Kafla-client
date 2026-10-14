"use client";

import React, { useState, useEffect } from "react";
import { ItineraryActivityDTO, ItineraryDayDTO } from "../interfaces/interfaces";
import { DailyWeatherForecast, TripWeatherResponseDTO } from "../../../interfaces/interface";
import { WeatherIcon } from "../../../components/WeatherIcon";
import { formatDateOnly, formatFullDate, isSameDay } from "../utils/helpers";
import { Zap, Clock, CheckCircle2, Droplets, X, ArrowRight } from "lucide-react";

interface TodayLiveBannerProps {
  days: ItineraryDayDTO[];
  dateFrom?: Date | string;
  dateTo?: Date | string;
  weather?: TripWeatherResponseDTO;
  forecasts?: DailyWeatherForecast[];
  onJumpToDay: (date: Date) => void;
  onAddActivity?: (day: ItineraryDayDTO, dayNumber: number) => void;
  className?: string;
}

function formatRemainingTime(minutes: number): string {
  if (minutes <= 0) return "now";
  if (minutes < 60) return `in ${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `in ${h}h ${m}m` : `in ${h}h`;
}

function formatEndingTime(minutes: number): string {
  if (minutes <= 0) return "ending now";
  if (minutes < 60) return `ends in ${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `ends in ${h}h ${m}m` : `ends in ${h}h`;
}

function getTodayActivityStatus(activities: ItineraryActivityDTO[]) {
  if (!activities || activities.length === 0) {
    return {
      type: "empty" as const,
      label: "No activities scheduled yet for today",
    };
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const timedActivities = [...activities]
    .filter((a) => a.startTime)
    .sort((a, b) => a.startTime!.localeCompare(b.startTime!));

  // 1. Check if an activity is happening right now
  for (const act of timedActivities) {
    const [h, m] = act.startTime!.split(":").map(Number);
    const startM = h * 60 + m;
    const endM = startM + (act.durationMinutes || 60);
    if (!act.isCompleted && currentMinutes >= startM && currentMinutes < endM) {
      const remaining = endM - currentMinutes;
      return {
        type: "happening_now" as const,
        activity: act,
        timeBadge: formatEndingTime(remaining),
        title: act.title,
        startTime: act.startTime,
        location: act.location,
      };
    }
  }

  // 2. Check for next upcoming activity
  for (const act of timedActivities) {
    const [h, m] = act.startTime!.split(":").map(Number);
    const startM = h * 60 + m;
    if (!act.isCompleted && startM > currentMinutes) {
      const diff = startM - currentMinutes;
      return {
        type: "upcoming" as const,
        activity: act,
        timeBadge: formatRemainingTime(diff),
        title: act.title,
        startTime: act.startTime,
        location: act.location,
      };
    }
  }

  // 3. Check for any incomplete untimed activities
  const untimedIncomplete = activities.find((a) => !a.isCompleted);
  if (untimedIncomplete) {
    return {
      type: "untimed" as const,
      activity: untimedIncomplete,
      timeBadge: "Up next",
      title: untimedIncomplete.title,
      location: untimedIncomplete.location,
    };
  }

  // 4. All completed
  const completedCount = activities.filter((a) => a.isCompleted).length;
  if (completedCount === activities.length) {
    return {
      type: "all_completed" as const,
      label: `All ${completedCount} activities completed today`,
    };
  }

  return {
    type: "done_for_day" as const,
    label: "All scheduled activities wrapped up for today",
  };
}

export default function TodayLiveBanner({
  days,
  dateFrom,
  dateTo,
  weather,
  forecasts,
  onJumpToDay,
  onAddActivity,
  className = "",
}: TodayLiveBannerProps) {
  // Keep live time ticking every minute
  const [, setMinuteTicker] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setMinuteTicker((t) => t + 1);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!dateFrom || !dateTo || isDismissed) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const tripStart = new Date(dateFrom);
  tripStart.setHours(0, 0, 0, 0);

  const tripEnd = new Date(dateTo);
  tripEnd.setHours(23, 59, 59, 999);

  // Check if current date falls within trip dates
  const isTripActive = today >= tripStart && today <= tripEnd;
  if (!isTripActive) return null;

  // Find today's day from days array
  const todayDayIndex = days.findIndex((d) => isSameDay(new Date(d.date), today));
  const todayDay = todayDayIndex !== -1 ? days[todayDayIndex] : null;
  const dayNumber = todayDayIndex !== -1 ? todayDayIndex + 1 : 1;

  // Status calculation
  const status = getTodayActivityStatus(todayDay?.activities || []);

  // Weather for today
  const todayDateStr = formatDateOnly(today);
  const todayForecast = forecasts?.find((f) => f.date === todayDateStr);
  const currentWeather = weather?.current;

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-r from-[#005440] via-[#0d6e57] to-[#0a5c48] text-white rounded-2xl sm:rounded-3xl border border-emerald-400/40 p-4 sm:p-5 shadow-lg shadow-emerald-950/15 mb-6 transition-all ${className}`}
    >
      {/* Decorative ambient background blur */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-300/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-teal-200/15 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Live Badge + Day Info + Current/Upcoming Activity */}
        <div className="flex-1 min-w-0">
          {/* Top meta row: Live pulse + Day count */}
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30 text-white px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-xs backdrop-blur-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-80" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200" />
              </span>
              Happening Today
            </span>

            <span className="text-xs font-black text-white font-headline">
              Day {dayNumber} of {days.length}
            </span>

            <span className="text-xs text-white/75 font-medium">
              · {formatFullDate(today)}
            </span>
          </div>

          {/* Activity Status row */}
          <div className="flex items-center gap-2 mt-1">
            {status.type === "happening_now" && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-amber-400 text-amber-950 text-xs font-black px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0 shadow-xs">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>NOW</span>
                </span>
                <span className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                  {status.title}
                </span>
                <span className="text-xs text-white font-semibold bg-black/20 px-2 py-0.5 rounded-full border border-white/20 shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{status.timeBadge}</span>
                </span>
              </div>
            )}

            {status.type === "upcoming" && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white/20 text-white border border-white/30 text-xs font-black px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{status.timeBadge}</span>
                </span>
                <span className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                  {status.title}
                </span>
                {status.startTime && (
                  <span className="text-xs text-white/80 font-medium">
                    · Starts at {status.startTime}
                  </span>
                )}
              </div>
            )}

            {status.type === "untimed" && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-md shrink-0">
                  Up Next
                </span>
                <span className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                  {status.title}
                </span>
              </div>
            )}

            {status.type === "all_completed" && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
                <span className="text-sm sm:text-base font-bold text-white">
                  {status.label}
                </span>
              </div>
            )}

            {status.type === "empty" && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white/85">
                  {status.label}
                </span>
                {todayDay && onAddActivity && (
                  <button
                    onClick={() => onAddActivity(todayDay, dayNumber)}
                    className="text-xs font-bold text-white underline underline-offset-2 hover:text-emerald-100 cursor-pointer ml-1"
                  >
                    + Add activity
                  </button>
                )}
              </div>
            )}

            {status.type === "done_for_day" && (
              <span className="text-sm font-medium text-white/90">
                {status.label}
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Live Weather + Quick Jump Button */}
        <div className="flex items-center gap-3 self-start md:self-center shrink-0 flex-wrap">
          {/* Weather Widget */}
          {currentWeather && (
            <div className="flex items-center gap-2.5 bg-white/15 border border-white/25 px-3.5 py-2 rounded-xl backdrop-blur-xs select-none">
              <WeatherIcon
                code={currentWeather.weatherCode}
                isDay={currentWeather.isDay}
                colored={true}
                className="w-5 h-5 shrink-0"
              />
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-white">
                    {Math.round(currentWeather.temperature)}°C
                  </span>
                  {todayForecast && (
                    <span className="text-[11px] text-white/80 font-semibold">
                      {Math.round(todayForecast.maxTemperature)}°/{Math.round(todayForecast.minTemperature)}°
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-white/90 font-medium block capitalize truncate max-w-[110px]">
                  {currentWeather.weatherDescription}
                </span>
              </div>
              {todayForecast?.precipitationProbability !== undefined &&
                todayForecast.precipitationProbability > 20 && (
                  <span className="text-[10px] font-black text-white bg-sky-500/40 border border-sky-300/50 px-1.5 py-0.5 rounded ml-1 flex items-center gap-1">
                    <Droplets className="w-2.5 h-2.5 text-sky-200 shrink-0" />
                    <span>{todayForecast.precipitationProbability}%</span>
                  </span>
                )}
            </div>
          )}

          {/* Quick Jump CTA */}
          <button
            onClick={() => onJumpToDay(today)}
            className="flex items-center gap-1.5 bg-white hover:bg-emerald-50 active:scale-95 text-[#005440] font-black text-xs px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
          >
            <span>Jump to Day {dayNumber}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Subtle Dismiss / Close */}
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 text-white/60 hover:text-white rounded-lg transition-colors cursor-pointer shrink-0"
            title="Dismiss live banner for now"
            aria-label="Dismiss banner"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
