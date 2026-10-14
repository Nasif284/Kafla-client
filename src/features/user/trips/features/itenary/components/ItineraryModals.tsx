"use client";

import React from "react";
import {
  ActivityModalProps,
  CreateItineraryActivityRequestDTO,
  CreateItineraryDayRequestDTO,
  ItineraryDayDTO,
} from "../interfaces/interfaces";
import { DailyWeatherForecast } from "../../../interfaces/interface";
import DayModal from "./DayModal";
import ActivityModal from "./ActivityModal";
import SwapDaysModal from "./SwapDaysModal";
import AIItineraryModal from "./AiItineraryModal";
import ExportItineraryModal from "./ExportItineraryModal";

interface ItineraryModalsProps {
  groupId: string;
  group: any;
  days: ItineraryDayDTO[];
  selectedDay: ItineraryDayDTO | null;
  dayIndex: number;
  forecasts?: DailyWeatherForecast[];
  dayModal: {
    mode: "setup" | "edit";
    day: ItineraryDayDTO;
    dayNumber: number;
  } | null;
  onCloseDayModal: () => void;
  onSaveDay: (data: CreateItineraryDayRequestDTO) => void;
  activityModal: {
    mode: "add" | "edit";
    day: ItineraryDayDTO;
    dayNumber: number;
    editId?: string;
    initial?: ActivityModalProps["initial"];
  } | null;
  onCloseActivityModal: () => void;
  onSaveActivity: (data: CreateItineraryActivityRequestDTO) => void;
  aiModal: boolean;
  onCloseAiModal: () => void;
  swapSourceDay: ItineraryDayDTO | null;
  onCloseSwapModal: () => void;
  exportModal: {
    open: boolean;
    initialMode: "day" | "full";
    targetDay?: ItineraryDayDTO;
    dayNumber?: number;
  } | null;
  onCloseExportModal: () => void;
}

export default function ItineraryModals({
  groupId,
  group,
  days,
  selectedDay,
  dayIndex,
  forecasts,
  dayModal,
  onCloseDayModal,
  onSaveDay,
  activityModal,
  onCloseActivityModal,
  onSaveActivity,
  aiModal,
  onCloseAiModal,
  swapSourceDay,
  onCloseSwapModal,
  exportModal,
  onCloseExportModal,
}: ItineraryModalsProps) {
  return (
    <>
      {dayModal && (
        <DayModal
          mode={dayModal.mode}
          date={dayModal.day.date}
          dayNumber={dayModal.dayNumber}
          initial={{
            location: dayModal.day.location,
            latitude: dayModal.day.latitude,
            longitude: dayModal.day.longitude,
            summary: dayModal.day.summary,
          }}
          onSave={onSaveDay}
          onClose={onCloseDayModal}
        />
      )}

      {activityModal && (
        <ActivityModal
          mode={activityModal.mode}
          date={activityModal.day.date}
          dayNumber={activityModal.dayNumber}
          initial={activityModal.initial}
          onSave={onSaveActivity}
          onClose={onCloseActivityModal}
        />
      )}

      {aiModal && group && (
        <AIItineraryModal
          id={groupId}
          tripDestination={group.destination}
          dateFrom={group.dateFrom}
          dateTo={group.dateTo}
          onClose={onCloseAiModal}
        />
      )}

      {swapSourceDay && (
        <SwapDaysModal
          isOpen={Boolean(swapSourceDay)}
          onClose={onCloseSwapModal}
          groupId={groupId}
          sourceDay={swapSourceDay}
          allDays={days}
        />
      )}

      {exportModal?.open && (
        <ExportItineraryModal
          trip={{
            tripName:
              group?.name ||
              (group?.destination ? `Trip to ${group.destination}` : "Trip Itinerary"),
            destination: group?.destination || "Destination",
            dateFrom: group?.dateFrom,
            dateTo: group?.dateTo,
            travelerCount: group?.members?.length,
          }}
          days={days}
          selectedDay={exportModal.targetDay || selectedDay}
          dayNumber={exportModal.dayNumber || dayIndex + 1}
          forecasts={forecasts}
          initialMode={exportModal.initialMode}
          onClose={onCloseExportModal}
        />
      )}
    </>
  );
}
