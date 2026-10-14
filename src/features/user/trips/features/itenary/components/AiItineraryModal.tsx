import {
  ItinerarySetupForm,
  GeneratedItineraryView,
  SwapAdviceModal,
  RegenerateDayAdviceModal,
  useAiItineraryModalState,
} from "./ai-modal";
import { X, Sparkles } from "lucide-react";

// Re-export types for backward compatibility across the codebase
export type {
  GenerateAiItineraryRequestDTO,
  GeneratedActivity,
  GeneratedDay,
  GeneratedItinerary,
} from "./ai-modal";

interface Props {
  id: string;
  tripDestination: string;
  dateFrom?: string | Date;
  dateTo?: string | Date;
  onClose: () => void;
}

export default function AIItineraryModal({
  id,
  tripDestination,
  dateFrom,
  dateTo,
  onClose,
}: Props) {
  const {
    step,
    setStep,
    itinerary,
    swappingKey,
    regeneratingDayIdx,
    swapTarget,
    setSwapTarget,
    regenDayTarget,
    setRegenDayTarget,
    generating,
    saving,
    handleGenerate,
    handleRegenerate,
    handleSave,
    handleDeleteActivity,
    handleOpenSwapPrompt,
    handleOpenRegenDayPrompt,
    handleSwapActivity,
    handleRegenerateDay,
  } = useAiItineraryModalState({
    id,
    tripDestination,
    onClose,
  });

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`bg-white w-full ${
          step === "form" ? "max-w-2xl" : "max-w-3xl"
        } relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 transition-all`}
      >
        {/* Scoped theme scrollbar styling */}
        <style>{`
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #bec9c3 transparent;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #bec9c3;
            border-radius: 9999px;
            transition: background-color 0.2s ease;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #005440;
          }
        `}</style>

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full hover:bg-[#e5e9e5] transition-colors z-20 text-[#3f4944] cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="py-4 sm:py-5 text-center flex-shrink-0 px-12 sm:px-14 border-b border-[#bec9c3]/20">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-headline font-bold text-[#005440] tracking-tight">
              AI Trip Planner
            </h2>
            <Sparkles size={18} className="text-[#005440]" />
          </div>
          <p className="text-[#3f4944] text-xs sm:text-sm font-medium">
            {step === "form"
              ? "Customize your travel companions, accommodation base, and timings."
              : "Review your generated itinerary before saving it to your trip."}
          </p>
        </div>

        {/* Modal Body */}
        <div
          className={`flex-1 ${
            step === "form" ? "overflow-y-auto custom-scrollbar" : "overflow-hidden flex flex-col"
          }`}
        >
          {step === "form" ? (
            <div className="p-4 sm:p-6 sm:px-8">
              <ItinerarySetupForm
                tripDestination={tripDestination}
                dateFrom={dateFrom}
                dateTo={dateTo}
                onGenerate={handleGenerate}
                generating={generating}
              />
            </div>
          ) : (
            <GeneratedItineraryView
              itinerary={itinerary}
              generating={generating}
              saving={saving}
              onDeleteActivity={handleDeleteActivity}
              onSwapActivity={handleOpenSwapPrompt}
              onRegenerateDay={handleOpenRegenDayPrompt}
              swappingKey={swappingKey}
              regeneratingDayIdx={regeneratingDayIdx}
              onBack={() => setStep("form")}
              onRegenerate={handleRegenerate}
              onSave={handleSave}
              onClose={onClose}
            />
          )}
        </div>

        {/* Advice modals */}
        {swapTarget && (
          <SwapAdviceModal
            activityTitle={swapTarget.activityTitle}
            onConfirm={(instruction) => {
              handleSwapActivity(swapTarget.dayIndex, swapTarget.actIndex, instruction);
              setSwapTarget(null);
            }}
            onClose={() => setSwapTarget(null)}
          />
        )}

        {regenDayTarget && (
          <RegenerateDayAdviceModal
            dayNumber={regenDayTarget.dayNumber}
            dayDate={regenDayTarget.dayDate}
            onConfirm={(instruction) => {
              handleRegenerateDay(regenDayTarget.dayIndex, instruction);
              setRegenDayTarget(null);
            }}
            onClose={() => setRegenDayTarget(null)}
          />
        )}
      </div>
    </div>
  );
}
