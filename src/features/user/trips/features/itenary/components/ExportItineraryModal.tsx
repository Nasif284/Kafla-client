"use client";

import React, { useState } from "react";
import { ItineraryActivityDTO, ItineraryDayDTO } from "../interfaces/interfaces";
import { DailyWeatherForecast } from "../../../interfaces/interface";
import { formatDayLabel, formatFullDate } from "../utils/helpers";
import { triggerItineraryPrint, TripExportMeta } from "../utils/pdfExportEngine";
import {
  Printer,
  FileText,
  Calendar,
  CheckSquare,
  CloudSun,
  X,
  Sparkles,
  Download,
  Loader2,
} from "lucide-react";

interface ExportItineraryModalProps {
  trip: TripExportMeta;
  days: ItineraryDayDTO[];
  selectedDay?: ItineraryDayDTO | null;
  dayNumber?: number;
  forecasts?: DailyWeatherForecast[];
  initialMode?: "day" | "full";
  onClose: () => void;
}

export default function ExportItineraryModal({
  trip,
  days,
  selectedDay,
  dayNumber = 1,
  forecasts = [],
  initialMode = "full",
  onClose,
}: ExportItineraryModalProps) {
  const [mode, setMode] = useState<"day" | "full">(initialMode);
  const [includeWeather, setIncludeWeather] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeCheckboxes, setIncludeCheckboxes] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const totalActivities = days.reduce(
    (sum, d) => sum + (d.activities?.length || 0),
    0
  );

  const selectedDayActivitiesCount = selectedDay?.activities?.length || 0;

  async function handleExport() {
    setIsExporting(true);
    try {
      await triggerItineraryPrint({
        trip,
        mode,
        selectedDay,
        dayNumber,
        days,
        forecasts,
        includeWeather,
        includeNotes,
        includeCheckboxes,
      });
      // Allow dialog to open before closing modal
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 500);
    } catch (err) {
      console.error("Export failed:", err);
      setIsExporting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-lg relative rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-[#bec9c3]/20 flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#bec9c3]/20 flex items-center justify-between bg-[#f8faf8]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#c9eadb]/50 flex items-center justify-center text-[#005440]">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#181d1a] leading-tight">
                Export Itinerary (PDF)
              </h3>
              <p className="text-xs text-[#6f7a74] mt-0.5">
                Print or download high-fidelity offline travel sheets
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#e5e9e5] text-[#6f7a74] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Export Mode Selection */}
          <div>
            <label className="text-[11px] font-bold text-[#3f4944] uppercase tracking-wider block mb-2">
              Select Export Scope
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Full Timeline */}
              <button
                type="button"
                onClick={() => setMode("full")}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  mode === "full"
                    ? "border-[#005440] bg-[#f0fdf4] shadow-xs"
                    : "border-[#bec9c3]/30 hover:border-[#bec9c3] bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      mode === "full"
                        ? "bg-[#005440] text-white"
                        : "bg-[#f1f4f1] text-[#6f7a74]"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                  </div>
                  {mode === "full" && (
                    <span className="w-2 h-2 rounded-full bg-[#005440]" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-[#181d1a]">
                  Full Trip Timeline
                </h4>
                <p className="text-[11px] text-[#6f7a74] mt-1 leading-snug">
                  All {days.length} days ({totalActivities} activities) with day-by-day pagination.
                </p>
              </button>

              {/* Option 2: Day Basis */}
              <button
                type="button"
                onClick={() => setMode("day")}
                disabled={!selectedDay}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  mode === "day"
                    ? "border-[#005440] bg-[#f0fdf4] shadow-xs"
                    : "border-[#bec9c3]/30 hover:border-[#bec9c3] bg-white disabled:opacity-40"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      mode === "day"
                        ? "bg-[#005440] text-white"
                        : "bg-[#f1f4f1] text-[#6f7a74]"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                  </div>
                  {mode === "day" && (
                    <span className="w-2 h-2 rounded-full bg-[#005440]" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-[#181d1a]">
                  Day {dayNumber} Basis
                </h4>
                <p className="text-[11px] text-[#6f7a74] mt-1 leading-snug">
                  {selectedDay
                    ? `${formatDayLabel(selectedDay.date)} · ${selectedDayActivitiesCount} activities`
                    : "Select a day first"}
                </p>
              </button>
            </div>
          </div>

          {/* Options & Inclusions */}
          <div className="bg-[#f7f9f7] border border-[#bec9c3]/30 rounded-2xl p-4 space-y-3">
            <span className="text-[11px] font-bold text-[#3f4944] uppercase tracking-wider block">
              Inclusions & Print Enhancements
            </span>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="text-xs font-medium text-[#181d1a] flex items-center gap-2">
                  <CloudSun className="w-4 h-4 text-[#0f6e56]" />
                  <span>Include Weather Forecasts</span>
                </span>
                <input
                  type="checkbox"
                  checked={includeWeather}
                  onChange={(e) => setIncludeWeather(e.target.checked)}
                  className="rounded text-[#005440] focus:ring-[#005440] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="text-xs font-medium text-[#181d1a] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0f6e56]" />
                  <span>Include Activity Notes & Tips</span>
                </span>
                <input
                  type="checkbox"
                  checked={includeNotes}
                  onChange={(e) => setIncludeNotes(e.target.checked)}
                  className="rounded text-[#005440] focus:ring-[#005440] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="text-xs font-medium text-[#181d1a] flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#0f6e56]" />
                  <span>Include Printable Checkboxes</span>
                </span>
                <input
                  type="checkbox"
                  checked={includeCheckboxes}
                  onChange={(e) => setIncludeCheckboxes(e.target.checked)}
                  className="rounded text-[#005440] focus:ring-[#005440] w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Format Note */}
          <div className="text-[11px] text-[#6f7a74] leading-relaxed">
            <strong className="text-[#181d1a]">Tip:</strong> In the browser print dialog, choose{" "}
            <em>&quot;Save as PDF&quot;</em> to download an offline vector PDF file or select a printer.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#bec9c3]/20 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[#6f7a74] hover:text-[#181d1a] hover:bg-[#f1f4f1] rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="px-5 py-2.5 bg-[#0f6e56] hover:bg-[#005440] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 className="animate-spin w-3.5 h-3.5" />
                <span>Preparing PDF…</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export {mode === "day" ? `Day ${dayNumber}` : "Full Timeline"} PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
