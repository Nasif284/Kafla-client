"use client";

import { useState } from "react";
import { Calendar, CalendarCheck, ArrowRight } from "lucide-react";
import { useCreateGroup } from "@/src/features/user/trips/hooks/trip.hooks";
import { DestinationSuggestion } from "../../onboarding/interfaces/interfaces";
import DestinationAutocomplete from "../../onboarding/components/DestinationsAutoComplete";

interface CreateGroupProps {
  onClose: () => void;
  initialName?: string;
}

export default function CreateGroup({ onClose, initialName = "" }: CreateGroupProps) {
  const [name, setName] = useState(initialName);
  const [destinationText, setDestinationText] = useState("");
  const [selectedDestination, setSelectedDestination] = useState<DestinationSuggestion | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const createGroup = useCreateGroup();

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!name.trim()) {
      setValidationError("Please enter a group name");
      return;
    }
    if (!selectedDestination) {
      setValidationError("Please select a destination from the suggestions");
      return;
    }
    if (!dateFrom || !dateTo) {
      setValidationError("Please select both departure and return dates");
      return;
    }
    if (new Date(dateFrom) >= new Date(dateTo)) {
      setValidationError("Return date must be after departure date");
      return;
    }

    createGroup.mutate(
      {
        name: name.trim(),
        placeId: selectedDestination.placeId,
        destinationName: selectedDestination.displayName,
        city: selectedDestination.city,
        state: selectedDestination.state,
        countryCode: selectedDestination.countryCode,
        latitude: selectedDestination.latitude,
        longitude: selectedDestination.longitude,
        dateFrom: new Date(dateFrom),
        dateTo: new Date(dateTo),
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const isFormValid =
    name.trim().length > 0 &&
    selectedDestination !== null &&
    dateFrom.length > 0 &&
    dateTo.length > 0;

  return (
    <div className="p-4 sm:p-6 text-start">
      <form onSubmit={handleDirectSubmit} className="space-y-4 sm:space-y-5">
        {/* Group Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#3f4944] uppercase tracking-wider font-headline">
            Group Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Goa Trip Squad, Bali Summer 2026..."
            className="w-full h-11 sm:h-12 px-3.5 sm:px-4 bg-[#e0e3e0] rounded-xl outline-none focus:ring-2 focus:ring-[#005440] focus:bg-white transition-all text-xs sm:text-sm font-medium text-[#181d1a] placeholder:text-[#6f7a74]"
          />
        </div>

        {/* Destination Autocomplete */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#3f4944] uppercase tracking-wider font-headline">
            Destination <span className="text-red-500">*</span>
          </label>
          <DestinationAutocomplete
            value={destinationText}
            onChange={(val) => {
              setDestinationText(val);
              if (!val) setSelectedDestination(null);
            }}
            onSelect={(dest) => {
              setSelectedDestination(dest);
              setDestinationText(dest.displayName);
            }}
          />
        </div>

        {/* Date Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#3f4944] uppercase tracking-wider font-headline">
              Departure Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 sm:left-4 flex items-center pointer-events-none text-[#3f4944]">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full h-11 sm:h-12 pl-10 sm:pl-11 pr-3.5 bg-[#e0e3e0] rounded-xl outline-none focus:ring-2 focus:ring-[#005440] focus:bg-white transition-all text-xs sm:text-sm font-medium text-[#181d1a]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#3f4944] uppercase tracking-wider font-headline">
              Return Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 sm:left-4 flex items-center pointer-events-none text-[#3f4944]">
                <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <input
                type="date"
                min={dateFrom || new Date().toISOString().split("T")[0]}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full h-11 sm:h-12 pl-10 sm:pl-11 pr-3.5 bg-[#e0e3e0] rounded-xl outline-none focus:ring-2 focus:ring-[#005440] focus:bg-white transition-all text-xs sm:text-sm font-medium text-[#181d1a]"
              />
            </div>
          </div>
        </div>

        {/* Optional Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#3f4944] uppercase tracking-wider font-headline">
            Description / Trip Vibe (Optional)
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's the plan? e.g. Exploring beaches, budget hostels, and road trips..."
            className="w-full p-3 bg-[#e0e3e0] rounded-xl outline-none focus:ring-2 focus:ring-[#005440] focus:bg-white transition-all text-xs sm:text-sm font-medium text-[#181d1a] placeholder:text-[#6f7a74] resize-none"
          />
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <p className="text-xs sm:text-sm font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
            {validationError}
          </p>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-end pt-3 sm:pt-4 border-t border-[#bec9c3]/20">
          <button
            type="submit"
            disabled={!isFormValid || createGroup.isPending}
            className={`w-full sm:w-auto sm:min-w-[200px] h-11 sm:h-12 px-6 rounded-xl font-bold text-xs sm:text-sm text-white transition-all shadow-md flex items-center justify-center gap-2 ${
              !isFormValid
                ? "bg-gray-300 cursor-not-allowed"
                : createGroup.isPending
                ? "bg-[#addbd0] cursor-wait"
                : "bg-[#0f6e56] hover:opacity-90 active:scale-95 cursor-pointer"
            }`}
          >
            {createGroup.isPending ? (
              "Creating group..."
            ) : (
              <>
                Create Group Squad
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
