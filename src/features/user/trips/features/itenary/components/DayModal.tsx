"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, X, MapPin, FileText } from "lucide-react";
import { DestinationSuggestion } from "@/src/features/user/onboarding/interfaces/interfaces";
import { formatDateOnly, formatFullDate } from "../utils/helpers";
import DestinationAutocomplete from "@/src/features/user/onboarding/components/DestinationsAutoComplete";
import { DayFormValues, daySchema } from "../validators/validators";
import { DayModalProps } from "../interfaces/interfaces";

export default function DayModal({ mode, date, dayNumber, initial, onSave, onClose }: DayModalProps) {
  const { handleSubmit, control, setValue, watch } = useForm<DayFormValues>({
    resolver: zodResolver(daySchema),
    defaultValues: {
      location: initial?.location ?? null,
      latitude: initial?.latitude ?? null,
      longitude: initial?.longitude ?? null,
      summary: initial?.summary ?? "",
    },
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function handleSelect(dest: DestinationSuggestion) {
    setValue("location", dest.displayName);
    setValue("latitude", dest.latitude);
    setValue("longitude", dest.longitude);
  }

  function onSubmit(values: DayFormValues) {
    onSave({
      date: formatDateOnly(date),
      location: values.location ?? null,
      latitude: values.latitude ?? null,
      longitude: values.longitude ?? null,
      summary: values.summary?.trim() || null,
    });
  }

  const summary = watch("summary") ?? "";
  const isEdit = mode === "edit";

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-[640px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between px-4 sm:px-6 pt-4 sm:pt-6">
          <div>
            <span
              className={`inline-flex items-center text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-2 ${
                isEdit ? "bg-[#e5e2de] text-[#3f4944]" : "bg-[#c9eadb] text-[#005440]"
              }`}
            >
              {isEdit ? "Edit day" : "New day"}
            </span>

            <h2 className="text-[22px] font-black text-[#181d1a] leading-none tracking-tight">Day {dayNumber}</h2>
            <div className="flex items-center gap-1.5 mt-1.5 text-[#3f4944] text-xs font-medium">
              <Calendar size={14} className="text-[#0f6e56]" />
              {formatFullDate(date)}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f1f4f1] text-[#3f4944] transition-colors -mr-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">
          {/* Location */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#3f4944]">
              <MapPin size={14} className="text-[#0f6e56]" />
              Location
            </label>
            <Controller
              control={control}
              name="location"
              render={({ field }) => (
                <DestinationAutocomplete
                  value={field.value ?? ""}
                  onChange={(val) => {
                    field.onChange(val);
                    setValue("location", val || null);
                    setValue("latitude", null);
                    setValue("longitude", null);
                  }}
                  onSelect={(dest) => {
                    field.onChange(dest.displayName);
                    handleSelect(dest);
                  }}
                />
              )}
            />
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#3f4944]">
                <FileText size={14} className="text-[#0f6e56]" />
                Day Summary
              </label>
              <span className="text-[10px] text-[#bec9c3]">{summary.length}/200</span>
            </div>
            <Controller
              control={control}
              name="summary"
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  maxLength={200}
                  placeholder="What's the plan for this day? e.g. Temples, rice paddies and street food in Ubud."
                  className="w-full px-4 py-3 bg-[#f6f3ef] rounded-xl border-2 border-transparent text-sm outline-none focus:border-[#0f6e56] focus:bg-white transition-all text-[#181d1a] placeholder:text-[#bec9c3] resize-none leading-relaxed"
                />
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 border-2 border-[#e0e3e0] text-[#3f4944] font-bold rounded-xl hover:bg-[#f6f3ef] transition-all text-sm active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] h-12 bg-[#0f6e56] text-white font-bold rounded-xl hover:bg-[#005440] active:scale-[0.98] transition-all shadow-sm text-sm"
            >
              {isEdit ? "Save changes" : "Set up day"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
