"use client";

import { Printer, Sparkles } from "lucide-react";
import ViewSwitcher from "../components/ViewSwitcher";
import TripItinerarySetupCanvas from "../components/TripItinerarySetupCanvas";
import TripItineraryEmptyHero from "../components/TripItineraryEmptyHero";
import TodayLiveBanner from "../components/TodayLiveBanner";
import FullTripTimeline from "../components/FullTripTimeline";
import DayStripNavigation from "../components/DayStripNavigation";
import DayFocusView from "../components/DayFocusView";
import ItineraryModals from "../components/ItineraryModals";
import AIItineraryModal from "../components/AiItineraryModal";
import { useItineraryPageState } from "../hooks/useItineraryPageState";

export default function ItineraryPage() {
  const {
    groupId,
    group,
    days,
    tripDays,
    isLoading,
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
    isSettingUp,
    setupItinerary,
    handleQuickShiftStartTime,
    handleDaySave,
    handleDeleteDay,
    handleActivitySave,
    handleDeleteActivity,
    handleToggleComplete,
  } = useItineraryPageState();

  if (isLoading) {
    return (
      <div className="flex-1 px-0 flex flex-col gap-4 h-full">
        <div className="bg-white border-b border-[#bec9c3]/20 px-3 sm:px-6 py-4 flex-shrink-0 animate-pulse">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-1 h-16 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="p-4 sm:p-6 space-y-3">
          <div className="h-32 bg-white rounded-2xl border border-[#bec9c3]/20 animate-pulse p-4" />
          <div className="h-32 bg-white rounded-2xl border border-[#bec9c3]/20 animate-pulse p-4" />
        </div>
      </div>
    );
  }

  if (days.length === 0) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#fafbfa]">
        <TripItinerarySetupCanvas
          destination={group?.destination}
          dateFrom={group?.dateFrom}
          dateTo={group?.dateTo}
          totalDays={tripDays.length || 1}
          isSettingUp={isSettingUp}
          onOpenAiModal={() => setAiModal(true)}
          onSetupManual={setupItinerary}
        />

        {aiModal && group && (
          <AIItineraryModal
            id={groupId}
            tripDestination={group.destination}
            dateFrom={group.dateFrom}
            dateTo={group.dateTo}
            onClose={() => setAiModal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 px-0 flex flex-col gap-0 h-full overflow-hidden">
      {/* Top Bar Controls */}
      <div className="bg-white border-b border-[#bec9c3]/20 px-3 sm:px-6 py-2.5 sm:py-3.5 flex-shrink-0">
        <div className="flex items-center justify-between gap-3">
          <ViewSwitcher
            viewMode={viewMode}
            onViewChange={setViewMode}
            totalActivities={totalActivities}
          />

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() =>
                setExportModal({
                  open: true,
                  initialMode: viewMode === "timeline" ? "full" : "day",
                  targetDay: selectedDay || undefined,
                  dayNumber: dayIndex + 1,
                })
              }
              className="flex items-center gap-1.5 bg-white hover:bg-[#f1f4f1] border border-[#bec9c3]/50 text-[#181d1a] px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-bold text-xs active:scale-95 transition-all shadow-2xs cursor-pointer"
              title="Export Itinerary (PDF / Print)"
            >
              <Printer className="w-3.5 h-3.5 text-[#005440]" />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>

            {!isPast && (
              <button
                onClick={() => setAiModal(true)}
                className="flex items-center gap-1.5 bg-[#0f6e56] text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold text-xs hover:bg-[#005440] active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">AI Itinerary</span>
                <span className="sm:hidden">AI</span>
              </button>
            )}
          </div>
        </div>

        {viewMode === "day" && days.length > 0 && (
          <DayStripNavigation
            days={days}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            stripStart={stripStart}
            onStripStartChange={setStripStart}
            forecasts={forecasts}
          />
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 [&::-webkit-scrollbar]:hidden">
        <TodayLiveBanner
          days={days}
          dateFrom={group?.dateFrom}
          dateTo={group?.dateTo}
          weather={weather}
          forecasts={forecasts}
          onJumpToDay={(date) => {
            setSelectedDate(date);
            setViewMode("day");
          }}
          onAddActivity={(day, dNum) =>
            setActivityModal({
              mode: "add",
              day,
              dayNumber: dNum,
            })
          }
        />

        {totalActivities === 0 && !hasDismissedHero && !isPast && (
          <TripItineraryEmptyHero
            destination={group?.destination}
            dateFrom={group?.dateFrom}
            dateTo={group?.dateTo}
            totalDays={days.length}
            onOpenAiModal={() => setAiModal(true)}
            onDismiss={() => setHasDismissedHero(true)}
          />
        )}

        {viewMode === "timeline" ? (
          <FullTripTimeline
            groupId={groupId}
            days={days}
            forecasts={forecasts}
            isReadOnly={isPast}
            onAddActivity={(day, dNum) =>
              setActivityModal({
                mode: "add",
                day,
                dayNumber: dNum,
              })
            }
            onEditActivity={(day, activity) =>
              setActivityModal({
                mode: "edit",
                day,
                dayNumber: days.findIndex((d) => d.id === day.id) + 1,
                editId: activity.id,
                initial: {
                  title: activity.title,
                  description: activity.description,
                  category: activity.category.code,
                  location: activity.location,
                  latitude: activity.latitude,
                  longitude: activity.longitude,
                  startTime: activity.startTime,
                  durationMinutes: activity.durationMinutes,
                  notes: activity.notes,
                },
              })
            }
            onDeleteActivity={(dayId, actId) => handleDeleteActivity(dayId, actId)}
            onToggleComplete={(dayId, actId) => handleToggleComplete(dayId, actId)}
            onEditDayInfo={(day, dNum) =>
              setDayModal({
                mode: "edit",
                day,
                dayNumber: dNum,
              })
            }
            onFocusDay={(date) => {
              setSelectedDate(date);
              setViewMode("day");
            }}
            onExportDay={(day, dNum) =>
              setExportModal({
                open: true,
                initialMode: "day",
                targetDay: day,
                dayNumber: dNum,
              })
            }
            onExportFull={() =>
              setExportModal({
                open: true,
                initialMode: "full",
              })
            }
          />
        ) : (
          selectedDay && (
            <DayFocusView
              selectedDay={selectedDay}
              dayIndex={dayIndex}
              totalDays={days.length}
              isPast={isPast}
              completedCount={completedCount}
              selectedDayForecast={selectedDayForecast}
              sortedActivities={sortedSelectedDayActivities}
              routeAnalysis={selectedDayRouteAnalysis}
              dayMenuOpen={dayMenuOpen}
              setDayMenuOpen={setDayMenuOpen}
              onEditDayInfo={() =>
                setDayModal({
                  mode: "edit",
                  day: selectedDay,
                  dayNumber: dayIndex + 1,
                })
              }
              onDeleteDay={handleDeleteDay}
              onSwapDay={() => setSwapSourceDay(selectedDay)}
              onExportDay={() =>
                setExportModal({
                  open: true,
                  initialMode: "day",
                  targetDay: selectedDay,
                  dayNumber: dayIndex + 1,
                })
              }
              onAddActivity={() =>
                setActivityModal({
                  mode: "add",
                  day: selectedDay,
                  dayNumber: dayIndex + 1,
                })
              }
              onEditActivity={(activity) =>
                setActivityModal({
                  mode: "edit",
                  day: selectedDay,
                  dayNumber: dayIndex + 1,
                  editId: activity.id,
                  initial: {
                    title: activity.title,
                    description: activity.description,
                    category: activity.category.code,
                    location: activity.location,
                    latitude: activity.latitude,
                    longitude: activity.longitude,
                    startTime: activity.startTime,
                    durationMinutes: activity.durationMinutes,
                    notes: activity.notes,
                  },
                })
              }
              onDeleteActivity={(actId) => handleDeleteActivity(selectedDay.id, actId)}
              onToggleComplete={(actId) => handleToggleComplete(selectedDay.id, actId)}
              onQuickShiftStartTime={(activity, newStartTime) =>
                handleQuickShiftStartTime(selectedDay.id, activity, newStartTime)
              }
            />
          )
        )}
      </div>

      <ItineraryModals
        groupId={groupId}
        group={group}
        days={days}
        selectedDay={selectedDay}
        dayIndex={dayIndex}
        forecasts={forecasts}
        dayModal={dayModal}
        onCloseDayModal={() => setDayModal(null)}
        onSaveDay={handleDaySave}
        activityModal={activityModal}
        onCloseActivityModal={() => setActivityModal(null)}
        onSaveActivity={handleActivitySave}
        aiModal={aiModal}
        onCloseAiModal={() => setAiModal(false)}
        swapSourceDay={swapSourceDay}
        onCloseSwapModal={() => setSwapSourceDay(null)}
        exportModal={exportModal}
        onCloseExportModal={() => setExportModal(null)}
      />
    </div>
  );
}
