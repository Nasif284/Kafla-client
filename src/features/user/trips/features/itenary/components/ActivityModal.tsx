"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, X, MapPin, Clock, FileText } from "lucide-react";
import { ActivityFormValues, activitySchema } from "../validators/validators";
import { DestinationSuggestion } from "@/src/features/user/onboarding/interfaces/interfaces";
import { formatDuration, formatFullDate } from "../utils/helpers";
import { CATEGORY_OPTIONS, getCat } from "../utils/data";
import DestinationAutocomplete from "@/src/features/user/onboarding/components/DestinationsAutoComplete";
import { ActivityModalProps } from "../interfaces/interfaces";

export default function ActivityModal({ mode, date, dayNumber, initial, onSave, onClose }: ActivityModalProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      category: initial?.category ?? "ACTIVITY",
      location: initial?.location ?? "",
      latitude: initial?.latitude ?? null,
      longitude: initial?.longitude ?? null,
      startTime: initial?.startTime ?? "",
      durationMinutes: initial?.durationMinutes?.toString() ?? "",
      notes: initial?.notes ?? "",
    },
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function handleLocationSelect(dest: DestinationSuggestion) {
    setValue("location", dest.displayName);
    setValue("latitude", dest.latitude);
    setValue("longitude", dest.longitude);
  }

  function onSubmit(values: ActivityFormValues) {
    const dur = parseInt(values.durationMinutes ?? "");
    onSave({
      title: values.title,
      description: values.description || undefined,
      location: values.location || undefined,
      latitude: values.latitude ?? undefined,
      longitude: values.longitude ?? undefined,
      categoryCode: values.category,
      startTime: values.startTime || undefined,
      durationMinutes: isNaN(dur) ? undefined : dur,
      notes: values.notes || undefined,
    });
  }

  const watchedDuration = watch("durationMinutes") ?? "";
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
        <div className="flex items-start justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-4 sm:pb-5 flex-shrink-0">
          <div>
            <span
              className={`inline-flex items-center text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-2 ${
                isEdit ? "bg-[#e5e2de] text-[#3f4944]" : "bg-[#c9eadb] text-[#005440]"
              }`}
            >
              {isEdit ? "Edit activity" : "New activity"}
            </span>
            <h2 className="text-[22px] font-black text-[#181d1a] leading-none tracking-tight">
              {isEdit ? "Edit Activity" : "Add Activity"}
            </h2>
            <div className="flex items-center gap-1.5 mt-1.5 text-[#3f4944] text-xs font-medium">
              <Calendar size={14} className="text-[#0f6e56]" />
              Day {dayNumber} · {formatFullDate(date)}
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

        {/* Scrollable body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 [&::-webkit-scrollbar]:hidden">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-[#3f4944]">
                Activity Name <span className="text-[#0f6e56]">*</span>
              </label>
              <input
                {...register("title")}
                placeholder="e.g. Sunrise trek at Mount Batur"
                className={`w-full h-12 px-4 rounded-xl border-2 text-sm outline-none transition-all text-[#181d1a] placeholder:text-[#bec9c3] ${
                  errors.title
                    ? "border-[#ba1a1a] bg-[#ffdad6]/10"
                    : "border-transparent bg-[#f6f3ef] focus:border-[#0f6e56] focus:bg-white"
                }`}
              />
              {errors.title && <p className="text-xs text-[#ba1a1a]">{errors.title.message}</p>}
            </div>

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
                    onChange={field.onChange}
                    onSelect={(dest) => {
                      field.onChange(dest.displayName);
                      handleLocationSelect(dest);
                    }}
                  />
                )}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-[#3f4944]">Description</label>
              <textarea
                {...register("description")}
                rows={2}
                placeholder="Optional details about this activity..."
                className="w-full px-4 py-3 bg-[#f6f3ef] rounded-xl border-2 border-transparent text-sm outline-none focus:border-[#0f6e56] focus:bg-white transition-all text-[#181d1a] placeholder:text-[#bec9c3] resize-none leading-relaxed"
              />
            </div>

            {/* Start time + duration */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#3f4944]">
                  <Clock size={14} className="text-[#0f6e56]" />
                  Start Time
                </label>
                <input
                  {...register("startTime")}
                  type="time"
                  className="w-full h-12 px-4 bg-[#f6f3ef] rounded-xl border-2 border-transparent text-sm outline-none focus:border-[#0f6e56] focus:bg-white transition-all text-[#181d1a]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-[#3f4944]">Duration</label>
                <div className="relative">
                  <input
                    {...register("durationMinutes")}
                    type="number"
                    min="0"
                    placeholder="e.g. 90"
                    className="w-full h-12 px-4 pr-14 bg-[#f6f3ef] rounded-xl border-2 border-transparent text-sm outline-none focus:border-[#0f6e56] focus:bg-white transition-all text-[#181d1a] placeholder:text-[#bec9c3]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#bec9c3] pointer-events-none tabular-nums">
                    {watchedDuration && parseInt(watchedDuration) > 0
                      ? formatDuration(parseInt(watchedDuration))
                      : "min"}
                  </span>
                </div>
              </div>
            </div>

            {/* Category pills */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-[#3f4944]">
                Category <span className="text-[#0f6e56]">*</span>
              </label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_OPTIONS.map(({ value, label }) => {
                      const cat = getCat(value);
                      const active = field.value === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => field.onChange(value)}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                            active
                              ? `${cat.dot} text-white shadow-sm scale-105`
                              : `${cat.bg} ${cat.color}`
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#3f4944]">
                <FileText size={14} className="text-[#0f6e56]" />
                Notes
              </label>
              <textarea
                {...register("notes")}
                rows={2}
                placeholder="Tips or reminders for the squad..."
                className="w-full px-4 py-3 bg-[#f6f3ef] rounded-xl border-2 border-transparent text-sm outline-none focus:border-[#0f6e56] focus:bg-white transition-all text-[#181d1a] placeholder:text-[#bec9c3] resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-6 flex-shrink-0 flex gap-3">
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
              {isEdit ? "Save changes" : "Add to itinerary"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
