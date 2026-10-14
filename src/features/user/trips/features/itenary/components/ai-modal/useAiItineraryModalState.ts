import { useState } from "react";
import {
  useAiItineraryGenerate,
  useSaveGenerated,
  useSwapActivity,
  useRegenerateDay,
} from "../../hooks/hooks";
import {
  GenerateAiItineraryRequestDTO,
  GeneratedItinerary,
} from "./types";

interface UseAiItineraryModalStateProps {
  id: string;
  tripDestination: string;
  onClose: () => void;
}

export function useAiItineraryModalState({
  id,
  tripDestination,
  onClose,
}: UseAiItineraryModalStateProps) {
  const [step, setStep] = useState<"form" | "preview">("form");
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [lastDTO, setLastDTO] = useState<GenerateAiItineraryRequestDTO | null>(null);
  const [swappingKey, setSwappingKey] = useState<string | null>(null);
  const [regeneratingDayIdx, setRegeneratingDayIdx] = useState<number | null>(null);
  const [swapTarget, setSwapTarget] = useState<{
    dayIndex: number;
    actIndex: number;
    activityTitle: string;
  } | null>(null);
  const [regenDayTarget, setRegenDayTarget] = useState<{
    dayIndex: number;
    dayNumber: number;
    dayDate: string;
  } | null>(null);

  const generate = useAiItineraryGenerate();
  const save = useSaveGenerated();
  const swapActivity = useSwapActivity();
  const regenerateDay = useRegenerateDay();

  const handleGenerate = (dto: GenerateAiItineraryRequestDTO) => {
    setLastDTO(dto);
    setStep("preview");
    generate.mutate(
      { id, data: dto },
      {
        onSuccess: (res) => {
          setItinerary(res.data);
        },
      }
    );
  };

  const handleRegenerate = () => {
    if (lastDTO) handleGenerate(lastDTO);
  };

  const handleSave = () => {
    if (!itinerary) return;
    save.mutate(
      { id, data: itinerary },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleDeleteActivity = (dayIndex: number, actIndex: number) => {
    setItinerary((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        days: prev.days.map((day, dIdx) => {
          if (dIdx !== dayIndex) return day;
          return {
            ...day,
            activities: day.activities.filter((_, aIdx) => aIdx !== actIndex),
          };
        }),
      };
    });
  };

  const handleOpenSwapPrompt = (dayIndex: number, actIndex: number) => {
    if (!itinerary) return;
    const act = itinerary.days[dayIndex]?.activities[actIndex];
    if (!act) return;
    setSwapTarget({
      dayIndex,
      actIndex,
      activityTitle: act.title,
    });
  };

  const handleOpenRegenDayPrompt = (dayIndex: number) => {
    if (!itinerary) return;
    const day = itinerary.days[dayIndex];
    if (!day) return;
    setRegenDayTarget({
      dayIndex,
      dayNumber: dayIndex + 1,
      dayDate: day.date,
    });
  };

  const handleSwapActivity = (
    dayIndex: number,
    actIndex: number,
    customInstruction?: string
  ) => {
    if (!itinerary) return;
    const day = itinerary.days[dayIndex];
    const act = day?.activities[actIndex];
    if (!act) return;

    const excludePlaces: string[] = [];
    itinerary.days.forEach((d) => {
      d.activities.forEach((a) => {
        if (a.title) excludePlaces.push(a.title);
        if (a.location) excludePlaces.push(a.location);
      });
    });

    const prevAct = actIndex > 0 ? day.activities[actIndex - 1] : undefined;
    const nextAct = actIndex < day.activities.length - 1 ? day.activities[actIndex + 1] : undefined;
    const dayActivitiesOutline = day.activities
      .filter((_, idx) => idx !== actIndex)
      .map(
        (a) =>
          `${a.startTime ? `[${a.startTime}] ` : ""}${a.title} (${a.category}${
            a.location ? ` @ ${a.location}` : ""
          })`
      );

    const key = `${dayIndex}-${actIndex}`;
    setSwappingKey(key);

    swapActivity.mutate(
      {
        id,
        data: {
          destination: tripDestination,
          dayDate: day.date,
          currentActivity: {
            title: act.title,
            category: act.category,
            startTime: act.startTime,
            durationMinutes: act.durationMinutes,
            location: act.location,
          },
          previousActivity: prevAct
            ? {
                title: prevAct.title,
                category: prevAct.category,
                startTime: prevAct.startTime,
                durationMinutes: prevAct.durationMinutes,
                location: prevAct.location,
              }
            : undefined,
          nextActivity: nextAct
            ? {
                title: nextAct.title,
                category: nextAct.category,
                startTime: nextAct.startTime,
                durationMinutes: nextAct.durationMinutes,
                location: nextAct.location,
              }
            : undefined,
          dayActivitiesOutline,
          excludePlaces,
          interests: lastDTO?.interests,
          tripPace: lastDTO?.tripPace,
          dietary: lastDTO?.dietary,
          customInstruction: customInstruction?.trim() || undefined,
        },
      },
      {
        onSuccess: (res) => {
          const newAct = res.data;
          setItinerary((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              days: prev.days.map((d, dIdx) => {
                if (dIdx !== dayIndex) return d;
                const newActivities = [...d.activities];
                newActivities[actIndex] = newAct;
                return { ...d, activities: newActivities };
              }),
            };
          });
        },
        onSettled: () => {
          setSwappingKey(null);
        },
      }
    );
  };

  const handleRegenerateDay = (
    dayIndex: number,
    customInstruction?: string
  ) => {
    if (!itinerary) return;
    const day = itinerary.days[dayIndex];
    if (!day) return;

    const excludePlaces: string[] = [];
    itinerary.days.forEach((d, dIdx) => {
      if (dIdx !== dayIndex) {
        d.activities.forEach((a) => {
          if (a.title) excludePlaces.push(a.title);
          if (a.location) excludePlaces.push(a.location);
        });
      }
    });

    const prevDay = dayIndex > 0 ? itinerary.days[dayIndex - 1] : null;
    const nextDay =
      dayIndex < itinerary.days.length - 1 ? itinerary.days[dayIndex + 1] : null;

    const startFromLocation = prevDay?.location || tripDestination;
    const endAtLocation = nextDay?.location || prevDay?.location || tripDestination;

    setRegeneratingDayIdx(dayIndex);

    regenerateDay.mutate(
      {
        id,
        data: {
          destination: tripDestination,
          dayNumber: dayIndex + 1,
          date: day.date,
          startFromLocation,
          endAtLocation,
          excludePlaces,
          tripPace: lastDTO?.tripPace,
          interests: lastDTO?.interests,
          companions: lastDTO?.companions,
          transportMode: lastDTO?.transportMode,
          accommodationType: lastDTO?.accommodationType,
          hotelLocationOrStyle: lastDTO?.hotelLocationOrStyle,
          dietary: lastDTO?.dietary,
          notes: lastDTO?.notes,
          customInstruction: customInstruction?.trim() || undefined,
        },
      },
      {
        onSuccess: (res) => {
          const newDay = res.data;
          setItinerary((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              days: prev.days.map((d, dIdx) => (dIdx === dayIndex ? newDay : d)),
            };
          });
        },
        onSettled: () => {
          setRegeneratingDayIdx(null);
        },
      }
    );
  };

  return {
    step,
    setStep,
    itinerary,
    swappingKey,
    regeneratingDayIdx,
    swapTarget,
    setSwapTarget,
    regenDayTarget,
    setRegenDayTarget,
    generating: generate.isPending,
    saving: save.isPending,
    handleGenerate,
    handleRegenerate,
    handleSave,
    handleDeleteActivity,
    handleOpenSwapPrompt,
    handleOpenRegenDayPrompt,
    handleSwapActivity,
    handleRegenerateDay,
  };
}
