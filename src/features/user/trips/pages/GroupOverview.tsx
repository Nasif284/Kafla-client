"use client";

import { useState } from "react";
import ProgressBar from "../features/checklist/components/ProgressBar";
import { useGetGroup, useGetWeather } from "../hooks/trip.hooks";
import { useParams, useRouter } from "next/navigation";
import { capitalizeFirstLetter } from "@/src/utils/capitalizseFirstLetter";
import { useGetSummary } from "../features/expense/hooks/hooks";
import { useGetChecklist } from "../features/checklist/hooks/checklist.hooks";
import { useGetItinerary } from "../features/itenary/hooks/hooks";
import TodayLiveBanner from "../features/itenary/components/TodayLiveBanner";
import { WeatherIcon } from "../components/WeatherIcon";
import { TrendingDown, TrendingUp, Droplets, Wind } from "lucide-react";

export default function TripOverviewPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: weatherData, isLoading: weatherLoading } = useGetWeather(id as string)
  const weather = weatherData?.data

  const { data, isLoading } = useGetGroup(id as string);
  const trip = data?.data;

  const { data: itineraryData } = useGetItinerary(id as string);
  const itinerary = itineraryData?.data;

  const { data: checklistData, isLoading: checklistSummeryLoading } = useGetChecklist(id as string);
  const checkSummary = checklistData?.data?.summary;

  const { data: expenseSummery, isLoading: summeryLoading } = useGetSummary(id as string);
  const summary = expenseSummery?.data;


  if (isLoading || summeryLoading || checklistSummeryLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 sm:gap-8">
        <div className="lg:col-span-6 space-y-6 sm:space-y-8">
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#bec9c3]/20 animate-pulse h-40" />
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#bec9c3]/20 animate-pulse h-48" />
        </div>
        <div className="lg:col-span-4 space-y-6 sm:space-y-8">
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#bec9c3]/20 animate-pulse h-64" />
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="p-8 text-center text-sm font-medium text-[#3f4944] bg-white rounded-2xl border border-[#bec9c3]/20">
        Trip group not found.
      </div>
    );
  }

  const checkPct = checkSummary?.total ? Math.round((checkSummary.completed * 100) / checkSummary.total) : 0;
  const days =
    itinerary?.days?.length ||
    Math.max(
      1,
      Math.round(
        (new Date(trip.dateTo).getTime() - new Date(trip.dateFrom).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1
    );
  const membersCount = trip.members?.length || 0;
  const totalActivities =
    itinerary?.days?.reduce(
      (acc: number, d: any) => acc + (d.activities?.length || 0),
      0
    ) || 0;

  const GLANCE = [
    { label: "Duration", value: `${days} Days` },
    { label: "Group", value: `${membersCount} ${membersCount === 1 ? "Member" : "Members"}` },
    { label: "Activities", value: `${totalActivities} ${totalActivities === 1 ? "Stop" : "Stops"}` },
    { label: "Destination", value: trip.destination || "TBD" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Today Live On-The-Road Banner (Active Trips) ───────── */}
      <TodayLiveBanner
        days={itinerary?.days || []}
        dateFrom={trip.dateFrom}
        dateTo={trip.dateTo}
        weather={weather}
        forecasts={weather?.forecast}
        onJumpToDay={() => router.push(`/trips/groups/${id}/itinerary`)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 sm:gap-8 items-start">
      {/* Left Column Wrapper: contents on mobile, block on lg */}
      <div className="contents lg:block lg:col-span-6 space-y-6 sm:space-y-8">
        {/* ── 1. Trip at a glance ── */}
        <section className="order-1 lg:order-none">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#181d1a] mb-3 sm:mb-4 font-headline">Trip at a glance</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
            {GLANCE.map(({ label, value }) => (
              <div key={label} className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#bec9c3]/20 shadow-xs">
                <span className="text-[#3f4944] text-[10px] sm:text-xs uppercase tracking-wider font-bold">{label}</span>
                <p className="text-base sm:text-xl font-bold text-[#005440] mt-1 truncate">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. Expenses Summary (Mobile: 3rd) ── */}
        {summary?.totalExpenses > 0 && (
          <div className="order-3 lg:order-none bg-white p-4 sm:p-6 rounded-2xl border border-[#bec9c3]/20 shadow-xs">
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 font-headline text-[#181d1a]">Expenses summary</h3>
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between text-xs sm:text-sm font-bold mb-2">
                <span className="text-[#3f4944]">Total Expense</span>
                <span className="text-[#181d1a]">₹{summary.totalExpenses}</span>
              </div>
            </div>
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#ffdad6]/20 rounded-xl">
                <div className="flex items-center gap-2 text-[#ba1a1a]">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-xs sm:text-sm font-medium text-[#181d1a]">You owe total</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#ba1a1a]">₹{(summary.youOwe ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#c9eadb]/30 rounded-xl">
                <div className="flex items-center gap-2 text-[#005440]">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs sm:text-sm font-medium text-[#181d1a]">You get back total</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#005440]">₹{(summary.youAreOwed ?? 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column Wrapper: contents on mobile, block on lg */}
      <div className="contents lg:block lg:col-span-4 space-y-6 sm:space-y-8">
        {/* ── 2. Weather Card (Mobile: 2nd right after Trip at a Glance) ── */}
        <div className="order-2 lg:order-none bg-white p-4 sm:p-6 rounded-2xl border border-[#bec9c3]/20 shadow-xs">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="font-bold text-base sm:text-lg font-headline text-[#181d1a]">Weather</h3>

            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-[#3f4944] uppercase tracking-wider">Real-time updates</span>
            </div>
          </div>

          {weatherLoading || !weather ? (
            <div className="text-center py-8 text-xs sm:text-sm text-[#3f4944]">Loading weather...</div>
          ) : (
            <>
              {/* Current weather */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <WeatherIcon code={weather.current?.weatherCode} isDay={weather.current?.isDay} />

                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-[#181d1a]">{Math.round(weather.current?.temperature || 0)}°C</p>

                    <p className="text-xs sm:text-sm font-medium text-[#3f4944]">{weather.current?.weatherDescription}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-[#3f4944]">
                    H: {Math.round(weather.today?.maxTemperature || 0)}° · L: {Math.round(weather.today?.minTemperature || 0)}°
                  </p>

                  <p className="text-[10px] text-[#3f4944] opacity-70 mt-0.5">
                    {weather.location?.city}, {weather.location?.country}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div className="bg-[#f1f4f1] p-3 rounded-xl border border-[#bec9c3]/10">
                  <span className="text-[10px] font-bold text-[#3f4944] uppercase tracking-wider mb-1 block">Humidity</span>

                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-[#005440]" />

                    <span className="text-xs sm:text-sm font-bold text-[#181d1a]">{weather.current?.humidity}%</span>
                  </div>
                </div>

                <div className="bg-[#f1f4f1] p-3 rounded-xl border border-[#bec9c3]/10">
                  <span className="text-[10px] font-bold text-[#3f4944] uppercase tracking-wider mb-1 block">Wind</span>

                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-[#005440]" />

                    <span className="text-xs sm:text-sm font-bold text-[#181d1a]">{Math.round(weather.current?.windSpeed || 0)} km/h</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── 4. Shared Checklist (Mobile: 4th) ── */}
        {checkSummary?.total > 0 && (
          <div className="order-4 lg:order-none bg-white p-4 sm:p-6 rounded-2xl border border-[#bec9c3]/20 shadow-xs">
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 font-headline text-[#181d1a]">Shared checklist</h3>
            <div className="mb-4">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-[#3f4944]">Overall progress</span>
                <span className="text-[#181d1a]">
                  {checkSummary.completed} of {checkSummary.total} tasks completed
                </span>
              </div>
              <ProgressBar pct={checkPct} color="bg-[#adcebf]" />
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
