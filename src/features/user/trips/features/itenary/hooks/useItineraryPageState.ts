import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  ActivityModalProps,
  CreateItineraryActivityRequestDTO,
  CreateItineraryDayRequestDTO,
  ItineraryActivityDTO,
  ItineraryDayDTO,
} from "../interfaces/interfaces";
import {
  formatDateOnly,
  generateTripDays,
  isSameDay,
} from "../utils/helpers";
import { analyzeDayRoute } from "../utils/routeIntelligence";
import { DailyWeatherForecast, TripWeatherResponseDTO } from "../../../interfaces/interface";
import {
  useAddItineraryActivity,
  useDeleteItineraryActivity,
  useDeleteItineraryDay,
  useGetItinerary,
  useSetupItinerary,
  useToggleItineraryActivityCompletion,
  useUpdateItineraryActivity,
  useUpdateItineraryDay,
} from "./hooks";
import { useGetGroup, useGetWeather } from "../../../hooks/trip.hooks";
import { ItineraryViewMode } from "../components/ViewSwitcher";

export function useItineraryPageState() {
  const { id } = useParams();
  const groupId = id as string;

  const { data: tripData, isLoading: loading } = useGetGroup(groupId);
  const { data, isLoading } = useGetItinerary(groupId);
  const { data: weatherData } = useGetWeather(groupId);

  const group = tripData?.data;
  const isPast = group?.dateTo ? new Date(group.dateTo) < new Date() : false;

  const [aiModal, setAiModal] = useState(false);
  const [exportModal, setExportModal] = useState<{
    open: boolean;
    initialMode: "day" | "full";
    targetDay?: ItineraryDayDTO;
    dayNumber?: number;
  } | null>(null);
  const [viewMode, setViewMode] = useState<ItineraryViewMode>("day");
  const [hasDismissedHero, setHasDismissedHero] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const [dayModal, setDayModal] = useState<{
    mode: "setup" | "edit";
    day: ItineraryDayDTO;
    dayNumber: number;
  } | null>(null);

  const [activityModal, setActivityModal] = useState<{
    mode: "add" | "edit";
    day: ItineraryDayDTO;
    dayNumber: number;
    editId?: string;
    initial?: ActivityModalProps["initial"];
  } | null>(null);

  const [dayMenuOpen, setDayMenuOpen] = useState(false);
  const [swapSourceDay, setSwapSourceDay] = useState<ItineraryDayDTO | null>(null);
  const [stripStart, setStripStart] = useState(0);

  const setupItinerary = useSetupItinerary();
  const editDay = useUpdateItineraryDay();
  const deleteDay = useDeleteItineraryDay();
  const createActivity = useAddItineraryActivity();
  const editActivity = useUpdateItineraryActivity();
  const deleteActivity = useDeleteItineraryActivity();
  const toggleCompletion = useToggleItineraryActivityCompletion();

  const itinerary = data?.data;
  const days: ItineraryDayDTO[] = itinerary?.days || [];

  const tripDays = group?.dateFrom && group?.dateTo
    ? generateTripDays(group.dateFrom, group.dateTo)
    : [];

  useEffect(() => {
    if (!selectedDate && days.length > 0) {
      setSelectedDate(new Date(days[0].date));
    } else if (!selectedDate && group?.dateFrom) {
      setSelectedDate(new Date(group.dateFrom));
    }
  }, [days, group, selectedDate]);

  const selectedDay = days.find((d) =>
    selectedDate ? isSameDay(new Date(d.date), selectedDate) : false
  ) ?? days[0] ?? null;

  const weather: TripWeatherResponseDTO | undefined = weatherData?.data;
  const forecasts: DailyWeatherForecast[] | undefined = weather?.forecast;
  const selectedDayDateStr = selectedDay ? formatDateOnly(selectedDay.date) : null;
  const selectedDayForecast = forecasts?.find((f) => f.date === selectedDayDateStr);

  const dayIndex = selectedDay
    ? days.findIndex((d) => d.id === selectedDay.id)
    : 0;

  const totalActivities = days.reduce(
    (sum, d) => sum + (d.activities?.length || 0),
    0
  );

  const completedCount = selectedDay?.activities
    ? selectedDay.activities.filter((a) => a.isCompleted).length
    : 0;

  const sortedSelectedDayActivities = useMemo(() => {
    if (!selectedDay?.activities) return [];
    return [...selectedDay.activities].sort((a, b) => {
      if (!a.startTime) return 1;
      if (!b.startTime) return -1;
      return a.startTime.localeCompare(b.startTime);
    });
  }, [selectedDay?.activities]);

  const selectedDayRouteAnalysis = useMemo(() => {
    return analyzeDayRoute(sortedSelectedDayActivities);
  }, [sortedSelectedDayActivities]);

  function handleQuickShiftStartTime(
    dayId: string,
    activity: ItineraryActivityDTO,
    newStartTime: string
  ) {
    editActivity.mutate({
      id: groupId,
      dayId,
      activityId: activity.id,
      data: {
        title: activity.title,
        description: activity.description || undefined,
        categoryCode: activity.category.code,
        location: activity.location || undefined,
        latitude: activity.latitude ? Number(activity.latitude) : undefined,
        longitude: activity.longitude ? Number(activity.longitude) : undefined,
        startTime: newStartTime,
        durationMinutes: activity.durationMinutes || 60,
        notes: activity.notes || undefined,
      },
    });
  }

  function handleDaySave(saveData: CreateItineraryDayRequestDTO) {
    if (!dayModal?.day) return;
    editDay.mutate({ id: groupId, dayId: dayModal.day.id, data: saveData });
    setDayModal(null);
  }

  function handleDeleteDay() {
    setDayMenuOpen(false);
    if (!selectedDay) return;
    if (!window.confirm(`Delete Day ${dayIndex + 1} and all its activities?`)) return;
    deleteDay.mutate({ id: groupId, dayId: selectedDay.id });
  }

  function handleActivitySave(saveData: CreateItineraryActivityRequestDTO) {
    if (!activityModal?.day) return;
    if (activityModal.mode === "add") {
      createActivity.mutate({
        id: groupId,
        dayId: activityModal.day.id,
        data: saveData,
      });
    } else {
      editActivity.mutate({
        id: groupId,
        dayId: activityModal.day.id,
        activityId: activityModal.editId!,
        data: saveData,
      });
    }
    setActivityModal(null);
  }

  function handleDeleteActivity(dayId: string, activityId: string) {
    deleteActivity.mutate({ id: groupId, dayId, activityId });
  }

  function handleToggleComplete(dayId: string, activityId: string) {
    toggleCompletion.mutate({ id: groupId, dayId, activityId });
  }

  return {
    groupId,
    group,
    days,
    tripDays,
    isLoading: isLoading || loading,
    isPast,
    weather,
    forecasts,
    selectedDate,
    setSelectedDate,
    selectedDay,
    selectedDayForecast,
    dayIndex,
    totalActivities,
    completedCount,
    sortedSelectedDayActivities,
    selectedDayRouteAnalysis,
    viewMode,
    setViewMode,
    stripStart,
    setStripStart,
    hasDismissedHero,
    setHasDismissedHero,
    dayMenuOpen,
    setDayMenuOpen,
    aiModal,
    setAiModal,
    exportModal,
    setExportModal,
    dayModal,
    setDayModal,
    activityModal,
    setActivityModal,
    swapSourceDay,
    setSwapSourceDay,
    isSettingUp: setupItinerary.isPending,
    setupItinerary: () => setupItinerary.mutate(groupId),
    handleQuickShiftStartTime,
    handleDaySave,
    handleDeleteDay,
    handleActivitySave,
    handleDeleteActivity,
    handleToggleComplete,
  };
}
