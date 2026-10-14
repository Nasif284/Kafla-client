"use client";

import React, { useState, useEffect } from "react";
import { Calendar, CalendarCheck, ArrowRight } from "lucide-react";
import { useUpdateTripGroup } from "@/src/features/user/trips/hooks/trip.hooks";
import { GroupData } from "../interfaces/interface";
import { DestinationSuggestion } from "../../onboarding/interfaces/interfaces";
import DestinationAutocomplete from "../../onboarding/components/DestinationsAutoComplete";
import ModalLayout from "@/src/components/Modal";

interface EditTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: GroupData;
}

const formatDateForInput = (d: string | Date | undefined) => {
  if (!d) return "";
  const dateObj = new Date(d);
  if (isNaN(dateObj.getTime())) return "";
  return dateObj.toISOString().split("T")[0];
};

export default function EditTripModal({ isOpen, onClose, group }: EditTripModalProps) {
  const [name, setName] = useState(group.name || "");
  const [destinationText, setDestinationText] = useState(group.destination || "");
  const [selectedDestination, setSelectedDestination] = useState<DestinationSuggestion | null>(null);
  const [dateFrom, setDateFrom] = useState(formatDateForInput(group.dateFrom));
  const [dateTo, setDateTo] = useState(formatDateForInput(group.dateTo));
  const [description, setDescription] = useState(group.description || "");
  const [validationError, setValidationError] = useState<string | null>(null);

  const updateGroup = useUpdateTripGroup();

  useEffect(() => {
    if (isOpen) {
      setName(group.name || "");
      setDestinationText(group.destination || "");
      setSelectedDestination(null);
      setDateFrom(formatDateForInput(group.dateFrom));
      setDateTo(formatDateForInput(group.dateTo));
      setDescription(group.description || "");
      setValidationError(null);
    }
  }, [isOpen, group]);

  // Dynamic reschedule metrics
  const oldFrom = new Date(group.dateFrom);
  const oldTo = new Date(group.dateTo);
  const newFrom = dateFrom ? new Date(dateFrom) : oldFrom;
  const newTo = dateTo ? new Date(dateTo) : oldTo;

  const oldDuration = Math.round((oldTo.getTime() - oldFrom.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const newDuration = Math.round((newTo.getTime() - newFrom.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const dayShift = Math.round((newFrom.getTime() - oldFrom.getTime()) / (1000 * 60 * 60 * 24));
  const datesChanged = dayShift !== 0 || newDuration !== oldDuration;
  const destinationChanged = Boolean(selectedDestination && selectedDestination.displayName !== group.destination);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!name.trim()) {
      setValidationError("Please enter a trip name");
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

    const payload: any = {
      name: name.trim(),
      dateFrom: new Date(dateFrom),
      dateTo: new Date(dateTo),
      description: description.trim() || undefined,
    };

    if (selectedDestination) {
      payload.placeId = selectedDestination.placeId;
      payload.destinationName = selectedDestination.displayName;
      payload.city = selectedDestination.city;
      payload.state = selectedDestination.state;
      payload.countryCode = selectedDestination.countryCode;
      payload.latitude = selectedDestination.latitude;
      payload.longitude = selectedDestination.longitude;
    }

    updateGroup.mutate(
      {
        id: group.id,
        payload,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} title="Edit Trip Details">
      <div className="p-4 sm:p-6 text-start max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Trip Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#3f4944] uppercase tracking-wider font-headline">
              Trip Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Goa Trip Squad, Bali Summer 2026..."
              className="w-full h-11 sm:h-12 px-3.5 sm:px-4 bg-[#e0e3e0] rounded-xl outline-none focus:ring-2 focus:ring-[#005440] focus:bg-white transition-all text-xs sm:text-sm font-medium text-[#181d1a]"
            />
          </div>

          {/* Destination Autocomplete */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#3f4944] uppercase tracking-wider font-headline">
              Destination Location
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
            {destinationChanged && (
              <p className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 p-2 rounded-lg font-medium">
                Changing primary destination will update your cover photo, weather, and map center. All existing activities and notes will be preserved.
              </p>
            )}
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
                  min={dateFrom}
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full h-11 sm:h-12 pl-10 sm:pl-11 pr-3.5 bg-[#e0e3e0] rounded-xl outline-none focus:ring-2 focus:ring-[#005440] focus:bg-white transition-all text-xs sm:text-sm font-medium text-[#181d1a]"
                />
              </div>
            </div>
          </div>

          {/* Smart Rescheduling Notice */}
          {datesChanged && (
            <div className="bg-[#f1f8f5] border border-[#0f6e56]/20 p-3.5 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#005440]">
                <span>📅 Schedule Update Preview</span>
              </div>
              <p className="text-[11px] text-[#3f4944] leading-relaxed">
                {dayShift !== 0 && (
                  <span>
                    Trip postponed by {Math.abs(dayShift)} {Math.abs(dayShift) === 1 ? "day" : "days"}. Existing itinerary days and stops will automatically shift by {dayShift > 0 ? `+${dayShift}` : dayShift} days to match your new flight.
                  </span>
                )}
                {newDuration > oldDuration && (
                  <span className="block mt-1">
                    Trip extended by +{newDuration - oldDuration} days. {newDuration - oldDuration} new planning days will be added automatically.
                  </span>
                )}
                {newDuration < oldDuration && (
                  <span className="block mt-1 text-amber-800">
                    Trip shortened by {oldDuration - newDuration} days. Activities from trimmed days will safely be moved to your final active day so nothing is lost.
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#3f4944] uppercase tracking-wider font-headline">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's the plan? e.g. Exploring beaches, budget hostels..."
              className="w-full p-3 bg-[#e0e3e0] rounded-xl outline-none focus:ring-2 focus:ring-[#005440] focus:bg-white transition-all text-xs sm:text-sm font-medium text-[#181d1a] placeholder:text-[#6f7a74] resize-none"
            />
          </div>

          {/* Validation Error Banner */}
          {validationError && (
            <p className="text-xs sm:text-sm font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
              {validationError}
            </p>
          )}

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-3 sm:pt-4 border-t border-[#bec9c3]/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-[#3f4944] hover:bg-[#f1f4f1] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateGroup.isPending}
              className="h-11 px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#0f6e56] hover:bg-[#005440] active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {updateGroup.isPending ? "Saving changes..." : "Save Trip Changes"}
              {!updateGroup.isPending && (
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              )}
            </button>
          </div>
        </form>
      </div>
    </ModalLayout>
  );
}
