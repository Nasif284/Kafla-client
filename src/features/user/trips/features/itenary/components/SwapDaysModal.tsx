"use client";

import React, { useState } from "react";
import { ItineraryDayDTO } from "../interfaces/interfaces";
import { useSwapDays } from "../hooks/hooks";
import { formatFullDate } from "../utils/helpers";
import ModalLayout from "@/src/components/Modal";

interface SwapDaysModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  sourceDay: ItineraryDayDTO;
  allDays: ItineraryDayDTO[];
}

export default function SwapDaysModal({
  isOpen,
  onClose,
  groupId,
  sourceDay,
  allDays,
}: SwapDaysModalProps) {
  const otherDays = allDays.filter((d) => d.id !== sourceDay.id);
  const [selectedTargetId, setSelectedTargetId] = useState<string>(
    otherDays[0]?.id || ""
  );

  const swapDaysMutation = useSwapDays();
  const targetDay = otherDays.find((d) => d.id === selectedTargetId);

  const sourceDayIndex = allDays.findIndex((d) => d.id === sourceDay.id) + 1;
  const targetDayIndex = targetDay
    ? allDays.findIndex((d) => d.id === targetDay.id) + 1
    : 1;

  const handleSwap = () => {
    if (!selectedTargetId) return;
    swapDaysMutation.mutate(
      {
        groupId,
        data: {
          dayIdA: sourceDay.id,
          dayIdB: selectedTargetId,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} title="Swap Itinerary Days">
      <div className="p-4 sm:p-6 text-start space-y-5">
        <p className="text-xs sm:text-sm text-[#3f4944] leading-relaxed">
          Switch the plans between two days in your itinerary. Great for adjusting to weather forecasts, delayed flights, or sudden plan changes.
        </p>

        {/* Swap Visual Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center relative">
          {/* Day A */}
          <div className="p-3.5 rounded-2xl bg-[#f1f4f1] border border-[#bec9c3]/20 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6f7a74]">
              Current Day
            </span>
            <h4 className="text-sm font-bold text-[#181d1a]">
              Day {sourceDayIndex} &bull; {formatFullDate(sourceDay.date)}
            </h4>
            <p className="text-xs text-[#005440] font-semibold">
              {sourceDay.activities?.length || 0} activities scheduled
            </p>
          </div>

          {/* Swap icon badge */}
          <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-[#bec9c3]/30 shadow-xs items-center justify-center text-[#0f6e56] z-10">
            ⇄
          </div>

          {/* Day B Picker */}
          <div className="p-3.5 rounded-2xl bg-[#f1f8f5] border border-[#0f6e56]/30 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#005440]">
              Swap with
            </span>
            <select
              value={selectedTargetId}
              onChange={(e) => setSelectedTargetId(e.target.value)}
              className="w-full bg-white border border-[#bec9c3]/30 rounded-xl px-3 py-2 text-xs font-semibold text-[#181d1a] outline-none focus:ring-2 focus:ring-[#0f6e56]"
            >
              {otherDays.map((d) => {
                const idx = allDays.findIndex((item) => item.id === d.id) + 1;
                return (
                  <option key={d.id} value={d.id}>
                    Day {idx} ({formatFullDate(d.date)}) - {d.activities?.length || 0} activities
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Swap preview notice */}
        {targetDay && (
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/50 text-[11px] text-[#005440] leading-relaxed">
            Day {sourceDayIndex}&apos;s {sourceDay.activities?.length || 0} stops will move to{" "}
            <span className="font-bold">{formatFullDate(targetDay.date)}</span>, and Day{" "}
            {targetDayIndex}&apos;s {targetDay.activities?.length || 0} stops will move to{" "}
            <span className="font-bold">{formatFullDate(sourceDay.date)}</span>.
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#bec9c3]/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-[#3f4944] hover:bg-[#f1f4f1] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedTargetId || swapDaysMutation.isPending}
            onClick={handleSwap}
            className="h-11 px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#0f6e56] hover:bg-[#005440] active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {swapDaysMutation.isPending ? "Swapping days..." : "Confirm Day Swap"}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
}
