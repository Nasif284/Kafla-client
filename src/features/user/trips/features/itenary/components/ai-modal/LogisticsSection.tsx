"use client";

import { UseFormRegister, FieldErrors, Control, Controller } from "react-hook-form";
import { Calendar } from "lucide-react";
import { FormValues, COMPANIONS, TRANSPORT_MODES } from "./types";

interface LogisticsSectionProps {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  control: Control<FormValues>;
  minDate?: string;
  maxDate?: string;
  arrivalDateVal: string;
  departureDateVal: string;
  tripDestination: string;
}

export function LogisticsSection({
  register,
  errors,
  control,
  minDate,
  maxDate,
  arrivalDateVal,
  departureDateVal,
  tripDestination,
}: LogisticsSectionProps) {
  return (
    <>
      {/* Card 1: Arrival & Departure timing */}
      <div className="bg-[#f7f9f7] border border-[#bec9c3]/30 rounded-2xl p-4 sm:p-5 space-y-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#005440] flex items-center gap-1.5">
            <Calendar size={14} /> When will you be at {tripDestination.split(",")[0]}?
          </h3>
          <p className="text-[11px] text-[#6f7a74] mt-0.5">
            Specify arrival & departure at the destination (excluding long journey/train travel days).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Arrival at Destination */}
          <div className="bg-white p-3.5 rounded-xl border border-[#bec9c3]/40 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#005440] block">
              1. Arrival at Destination
            </span>
            <div>
              <label className="block text-[10px] text-[#6f7a74] mb-1">Arrival Date *</label>
              <input
                type="date"
                min={minDate}
                max={departureDateVal || maxDate}
                {...register("arrivalDate", {
                  required: "Arrival date is required",
                  validate: (val) => {
                    if (minDate && val < minDate) return "Cannot be earlier than trip start date";
                    if (maxDate && val > maxDate) return "Cannot be later than trip end date";
                    if (departureDateVal && val > departureDateVal)
                      return "Arrival cannot be after departure";
                    return true;
                  },
                })}
                className="w-full h-10 px-3 bg-[#f7f9f7] border border-[#bec9c3]/40 rounded-lg text-xs font-semibold text-[#181d1a] focus:bg-white focus:outline-none focus:border-[#005440] transition-colors"
              />
              {errors.arrivalDate && (
                <p className="text-[#ba1a1a] text-[10px] mt-1">{errors.arrivalDate.message}</p>
              )}
            </div>
            <div>
              <label className="block text-[10px] text-[#6f7a74] mb-1">Arrival Time</label>
              <input
                type="time"
                {...register("arrivalTime")}
                className="w-full h-10 px-3 bg-[#f7f9f7] border border-[#bec9c3]/40 rounded-lg text-xs font-semibold text-[#181d1a] focus:bg-white focus:outline-none focus:border-[#005440] transition-colors"
              />
            </div>
          </div>

          {/* Departure from Destination */}
          <div className="bg-white p-3.5 rounded-xl border border-[#bec9c3]/40 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#005440] block">
              2. Departure from Destination
            </span>
            <div>
              <label className="block text-[10px] text-[#6f7a74] mb-1">Departure Date *</label>
              <input
                type="date"
                min={arrivalDateVal || minDate}
                max={maxDate}
                {...register("departureDate", {
                  required: "Departure date is required",
                  validate: (val) => {
                    if (minDate && val < minDate) return "Cannot be earlier than trip start date";
                    if (maxDate && val > maxDate) return "Cannot be later than trip end date";
                    if (arrivalDateVal && val < arrivalDateVal)
                      return "Departure must be on or after arrival date";
                    return true;
                  },
                })}
                className="w-full h-10 px-3 bg-[#f7f9f7] border border-[#bec9c3]/40 rounded-lg text-xs font-semibold text-[#181d1a] focus:bg-white focus:outline-none focus:border-[#005440] transition-colors"
              />
              {errors.departureDate && (
                <p className="text-[#ba1a1a] text-[10px] mt-1">{errors.departureDate.message}</p>
              )}
            </div>
            <div>
              <label className="block text-[10px] text-[#6f7a74] mb-1">Departure Time</label>
              <input
                type="time"
                {...register("departureTime")}
                className="w-full h-10 px-3 bg-[#f7f9f7] border border-[#bec9c3]/40 rounded-lg text-xs font-semibold text-[#181d1a] focus:bg-white focus:outline-none focus:border-[#005440] transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Companions & Transport mode */}
      <div className="bg-[#f7f9f7] border border-[#bec9c3]/30 rounded-2xl p-4 sm:p-5 space-y-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#3f4944] mb-2">
            Who are you traveling with?
          </label>
          <Controller
            name="companions"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COMPANIONS.map((c) => {
                  const selected = field.value === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => field.onChange(c.value)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selected
                          ? "bg-[#005440] text-white border-[#005440] shadow-2xs"
                          : "bg-white border-[#bec9c3]/40 text-[#181d1a] hover:bg-[#e5e9e5]/40"
                      }`}
                    >
                      <span className="text-xs font-bold block">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#3f4944] mb-2">
            Local transportation at destination
          </label>
          <Controller
            name="transportMode"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TRANSPORT_MODES.map((t) => {
                  const selected = field.value === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => field.onChange(t.value)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selected
                          ? "bg-[#005440] text-white border-[#005440] shadow-2xs"
                          : "bg-white border-[#bec9c3]/40 text-[#181d1a] hover:bg-[#e5e9e5]/40"
                      }`}
                    >
                      <span className="text-xs font-bold block">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>
      </div>
    </>
  );
}
