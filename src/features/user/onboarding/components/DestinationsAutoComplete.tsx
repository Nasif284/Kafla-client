"use client";

import { DestinationSuggestion, PlaceData, SuggestionInterface } from "../interfaces/interfaces";
import { useGetPlacesSuggestion } from "../hooks/onboarding.hooks";
import { useDebounce } from "@/src/hooks/debounce.hook";
import { useState } from "react";
import { onboardingService } from "../services/onboarding.service";
import { MapPin } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSelect: (destination: DestinationSuggestion) => void;
}

export default function DestinationAutocomplete({ value, onChange, onSelect }: Props) {
  const debouncedSuggestion = useDebounce(value);
  const [isSelected, setIsSelected] = useState(!!value);
  const { data, isLoading: loading } = useGetPlacesSuggestion(debouncedSuggestion, !isSelected);
  const suggestion = !isSelected ? (data?.suggestions?.[0] ?? null) : null;
  const handleSelect = async (selected: SuggestionInterface) => {
    try {
      const placeId = selected.placePrediction.place;
      setIsSelected(true);
      onChange(selected.placePrediction.text.text);
      const place = await onboardingService.getPlaceDetails(placeId);
      const city = place.addressComponents?.find((c: PlaceData) => c.types.includes("locality"))?.longText || null;
      const state = place.addressComponents?.find((c: PlaceData) => c.types.includes("administrative_area_level_1"))?.longText || null;
      const country = place.addressComponents?.find((c: PlaceData) => c.types.includes("country"))?.longText;
      const countryCode = place.addressComponents?.find((c: PlaceData) => c.types.includes("country"))?.shortText;
      onSelect({
        placeId,
        displayName: selected.placePrediction.text.text,

        city,
        state,
        country,
        countryCode,

        latitude: place.location.latitude,
        longitude: place.location.longitude,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-3 sm:left-4 flex items-center pointer-events-none text-[#3f4944] group-focus-within:text-[#005440] transition-colors z-10">
        <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <input
        value={value}
        onChange={(e) => {
          setIsSelected(false);
          onChange(e.target.value);
        }}
        placeholder="Search destination..."
        className="w-full h-10 sm:h-12 pl-9 sm:pl-11 pr-3 sm:pr-4 bg-[#e0e3e0] rounded-xl border-none outline-none focus:ring-2 focus:ring-[#005440] focus:bg-white transition-all placeholder:text-[#6f7a74] text-[#181d1a] text-xs sm:text-sm font-medium"
      />

      {loading && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs text-gray-500 z-50 flex items-center gap-2">
          <div className="w-3.5 h-3.5 border-2 border-[#005440] border-t-transparent rounded-full animate-spin" />
          <span>Searching destinations...</span>
        </div>
      )}

      {suggestion && (
        <div className="absolute z-50 top-full mt-1.5 w-full bg-white border border-gray-100 rounded-xl shadow-xl max-h-72 overflow-auto animate-in fade-in zoom-in-95 duration-100">
          <button
            key={suggestion.placePrediction.place}
            type="button"
            onClick={() => handleSelect(suggestion)}
            className="w-full text-left px-4 py-3 text-xs sm:text-sm text-[#181d1a] font-medium hover:bg-[#eef8f4] hover:text-[#005440] transition-colors flex items-center gap-2.5"
          >
            <MapPin className="w-4 h-4 text-[#005440] shrink-0" />
            <span className="truncate">{suggestion.placePrediction.text.text}</span>
          </button>
        </div>
      )}
    </div>
  );
}
