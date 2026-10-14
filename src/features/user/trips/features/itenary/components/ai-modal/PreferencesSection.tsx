"use client";

import { UseFormRegister, Control, Controller, UseFormSetValue } from "react-hook-form";
import { Building2 } from "lucide-react";
import {
  FormValues,
  ALL_INTERESTS,
  PACE_OPTIONS,
  HOTEL_STYLES,
  DIETARY_OPTIONS,
} from "./types";

interface PreferencesSectionProps {
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  accommodationTypeVal: "suggest" | "booked";
  hotelLocationOrStyleVal: string;
}

export function PreferencesSection({
  register,
  control,
  setValue,
  accommodationTypeVal,
  hotelLocationOrStyleVal,
}: PreferencesSectionProps) {
  const toggleInterest = (interest: string, current: string[]) => {
    if (current.includes(interest)) {
      if (current.length === 1) return;
      setValue("interests", current.filter((i) => i !== interest));
    } else {
      setValue("interests", [...current, interest]);
    }
  };

  return (
    <>
      {/* Card 3: Accommodation */}
      <div className="bg-[#f7f9f7] border border-[#bec9c3]/30 rounded-2xl p-4 sm:p-5 space-y-3">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#3f4944] mb-1">
          Where will you stay?
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setValue("accommodationType", "suggest");
              setValue("hotelLocationOrStyle", "Comfort Hotel (3-Star)");
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              accommodationTypeVal === "suggest"
                ? "bg-[#005440] text-white border-[#005440] shadow-2xs"
                : "bg-white border-[#bec9c3]/40 text-[#181d1a] hover:bg-[#e5e9e5]/40"
            }`}
          >
            <span className="text-xs font-bold block mb-0.5">Need Suggestions</span>
            <span className="text-[10px] opacity-80 block">AI plans starting from recommended stays</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setValue("accommodationType", "booked");
              setValue("hotelLocationOrStyle", "");
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              accommodationTypeVal === "booked"
                ? "bg-[#005440] text-white border-[#005440] shadow-2xs"
                : "bg-white border-[#bec9c3]/40 text-[#181d1a] hover:bg-[#e5e9e5]/40"
            }`}
          >
            <span className="text-xs font-bold block mb-0.5">Already Booked</span>
            <span className="text-[10px] opacity-80 block">Enter your hotel or area to optimize routing</span>
          </button>
        </div>

        {accommodationTypeVal === "suggest" ? (
          <div>
            <label className="block text-[10px] text-[#6f7a74] mb-1.5">Hotel Category / Style</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {HOTEL_STYLES.map((h) => {
                const selected = hotelLocationOrStyleVal === h;
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setValue("hotelLocationOrStyle", h)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selected
                        ? "bg-[#005440] text-white border-[#005440] shadow-2xs font-bold text-xs"
                        : "bg-white border-[#bec9c3]/40 text-[#181d1a] hover:bg-[#e5e9e5]/40 text-xs font-medium"
                    }`}
                  >
                    <span className="text-[11px] block truncate">{h}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-[10px] text-[#6f7a74] mb-1">
              Your Hotel Name / Area / Address
            </label>
            <div className="relative">
              <input
                type="text"
                {...register("hotelLocationOrStyle")}
                placeholder="e.g. Grand Hyatt Goa / Candolim Beach area"
                className="w-full h-10 pl-8 pr-3 bg-white border border-[#bec9c3]/40 rounded-lg text-xs font-semibold text-[#181d1a] focus:outline-none focus:border-[#005440] transition-colors"
              />
              <Building2 className="w-4 h-4 text-[#6f7a74] absolute left-2.5 top-3 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Card 4: Trip Pace & Interests */}
      <div className="bg-[#f7f9f7] border border-[#bec9c3]/30 rounded-2xl p-4 sm:p-5 space-y-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#3f4944] mb-2">
            Trip Pace
          </label>
          <Controller
            name="tripPace"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-2">
                {PACE_OPTIONS.map((p) => {
                  const selected = field.value === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => field.onChange(p)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selected
                          ? "bg-[#005440] text-white border-[#005440] shadow-2xs font-bold"
                          : "bg-white border-[#bec9c3]/40 text-[#181d1a] hover:bg-[#e5e9e5]/40 font-medium"
                      }`}
                    >
                      <span className="text-xs font-bold block">{p}</span>
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#3f4944] mb-2">
            Interests & Highlights (Select at least 1)
          </label>
          <Controller
            name="interests"
            control={control}
            render={({ field }) => (
              <div className="flex flex-wrap gap-1.5">
                {ALL_INTERESTS.map((interest) => {
                  const active = field.value.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest, field.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                        active
                          ? "bg-[#005440] text-white border-[#005440] shadow-2xs"
                          : "bg-white text-[#3f4944] border-[#bec9c3]/40 hover:bg-[#c9eadb]/30"
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>
      </div>

      {/* Card 5: Dietary & Notes */}
      <div className="bg-[#f7f9f7] border border-[#bec9c3]/30 rounded-2xl p-4 sm:p-5 space-y-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#3f4944] mb-2">
            Dietary Preferences
          </label>
          <Controller
            name="dietary"
            control={control}
            render={({ field }) => (
              <div className="flex flex-wrap gap-1.5">
                {DIETARY_OPTIONS.map((opt) => {
                  const selected = field.value === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => field.onChange(opt.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                        selected
                          ? "bg-[#005440] text-white border-[#005440] shadow-2xs"
                          : "bg-white text-[#3f4944] border-[#bec9c3]/40 hover:bg-[#c9eadb]/30"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#3f4944] mb-1.5">
            Special requests or notes (optional)
          </label>
          <textarea
            {...register("notes")}
            placeholder="E.g. must visit monasteries, prefer local cafes, need budget-friendly options..."
            className="w-full bg-[#f1f4f1] border border-[#bec9c3]/30 rounded-xl p-3 text-xs min-h-[75px] focus:ring-2 focus:ring-[#005440] focus:bg-white transition-all outline-none resize-none text-[#181d1a]"
          />
        </div>
      </div>
    </>
  );
}
