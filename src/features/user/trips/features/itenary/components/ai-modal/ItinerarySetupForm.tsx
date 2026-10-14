"use client";

import { useForm } from "react-hook-form";
import { MapPin, ArrowRight } from "lucide-react";
import {
  FormValues,
  GenerateAiItineraryRequestDTO,
} from "./types";
import { LogisticsSection } from "./LogisticsSection";
import { PreferencesSection } from "./PreferencesSection";

interface Props {
  tripDestination: string;
  dateFrom?: string | Date;
  dateTo?: string | Date;
  onGenerate: (dto: GenerateAiItineraryRequestDTO) => void;
  generating: boolean;
}

export function ItinerarySetupForm({
  tripDestination,
  dateFrom,
  dateTo,
  onGenerate,
  generating,
}: Props) {
  const minDate = dateFrom ? String(dateFrom).split("T")[0] : undefined;
  const maxDate = dateTo ? String(dateTo).split("T")[0] : undefined;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      tripPace: "Balanced",
      interests: ["Nature", "Beaches", "Food", "Adventure"],
      notes: "",
      arrivalDate: minDate || "",
      arrivalTime: "12:00",
      departureDate: maxDate || "",
      departureTime: "14:00",
      companions: "Friends Group",
      transportMode: "Rental Car / Self-Drive",
      accommodationType: "suggest",
      hotelLocationOrStyle: "Comfort Hotel (3-Star)",
      dietary: "No restrictions",
    },
  });

  const arrivalDateVal = watch("arrivalDate");
  const departureDateVal = watch("departureDate");
  const accommodationTypeVal = watch("accommodationType");
  const hotelLocationOrStyleVal = watch("hotelLocationOrStyle");

  const calculatedDays =
    arrivalDateVal && departureDateVal && new Date(departureDateVal) >= new Date(arrivalDateVal)
      ? Math.max(
          1,
          Math.floor(
            (new Date(departureDateVal).getTime() - new Date(arrivalDateVal).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : null;

  const onValid = (values: FormValues) => {
    onGenerate({
      tripPace: values.tripPace,
      interests: values.interests,
      notes: values.notes || undefined,
      arrivalDate: values.arrivalDate || undefined,
      arrivalTime: values.arrivalTime || undefined,
      departureDate: values.departureDate || undefined,
      departureTime: values.departureTime || undefined,
      companions: values.companions || undefined,
      transportMode: values.transportMode || undefined,
      accommodationType: values.accommodationType || undefined,
      hotelLocationOrStyle: values.hotelLocationOrStyle || undefined,
      dietary: values.dietary || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-6">
      {/* Destination banner */}
      <div className="flex items-center justify-between p-3.5 bg-[#f1f4f1] rounded-2xl border border-[#bec9c3]/30">
        <div className="flex items-center gap-2 text-[#005440]">
          <MapPin size={16} />
          <span className="font-bold text-sm text-[#181d1a]">{tripDestination}</span>
        </div>
        {calculatedDays ? (
          <span className="text-xs font-bold text-[#005440] bg-[#c9eadb] px-3 py-1 rounded-full">
            {calculatedDays} {calculatedDays === 1 ? "Day" : "Days"} at Destination
          </span>
        ) : (
          <span className="text-[11px] text-[#6f7a74] font-medium">Select your dates below</span>
        )}
      </div>

      <LogisticsSection
        register={register}
        errors={errors}
        control={control}
        minDate={minDate}
        maxDate={maxDate}
        arrivalDateVal={arrivalDateVal}
        departureDateVal={departureDateVal}
        tripDestination={tripDestination}
      />

      <PreferencesSection
        register={register}
        control={control}
        setValue={setValue}
        accommodationTypeVal={accommodationTypeVal}
        hotelLocationOrStyleVal={hotelLocationOrStyleVal}
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={generating}
        className="w-full h-12 bg-[#0f6e56] hover:bg-[#005440] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-sm disabled:opacity-70 disabled:cursor-not-allowed text-sm cursor-pointer"
      >
        Generate Itinerary
        <ArrowRight size={16} />
      </button>
    </form>
  );
}
