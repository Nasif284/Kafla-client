import { useState, useEffect } from "react";
import { Compass, Route, Clock, Sparkles, Lightbulb, Check } from "lucide-react";
import { GENERATION_STEPS } from "./types";

interface Props {
  onCancel?: () => void;
}

function StepIcon({ stepKey }: { stepKey: string }) {
  const className = "w-9 h-9 text-[#005440] transition-all duration-500";
  switch (stepKey) {
    case "sights":
      return <Compass className={className} />;
    case "routes":
      return <Route className={className} />;
    case "timing":
      return <Clock className={className} />;
    case "personalize":
      return <Sparkles className={className} />;
    default:
      return <Compass className={className} />;
  }
}

export function ItineraryGenerationLoader({ onCancel }: Props = {}) {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev < GENERATION_STEPS.length - 1 ? prev + 1 : prev));
    }, 7000);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 94) return prev;
        const remaining = 95 - prev;
        return prev + Math.max(0.4, remaining * 0.08);
      });
    }, 350);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressTimer);
    };
  }, []);

  const current = GENERATION_STEPS[activeStep];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 min-h-[460px] max-w-lg mx-auto w-full text-center">
      {/* 4-Step Pill Stepper */}
      <div className="w-full flex items-center justify-between gap-2 sm:gap-3 mb-8">
        {GENERATION_STEPS.map((step, idx) => {
          const isDone = activeStep > idx;
          const isCurrent = activeStep === idx;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 min-w-0">
              <div
                className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                  isDone
                    ? "bg-[#005440]"
                    : isCurrent
                    ? "bg-[#005440]/80"
                    : "bg-[#e5e9e5]"
                }`}
              />
              <div className="flex items-center justify-center gap-1 w-full">
                <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                  {isDone ? (
                    <Check className="w-3.5 h-3.5 text-[#005440] stroke-[2.5]" />
                  ) : (
                    <span
                      className={`text-[10px] font-mono font-bold leading-none ${
                        isCurrent ? "text-[#005440]" : "text-[#8a948e]"
                      }`}
                    >
                      0{idx + 1}
                    </span>
                  )}
                </span>
                <span
                  className={`text-[10px] sm:text-[11px] font-bold tracking-wider uppercase truncate ${
                    isDone
                      ? "text-[#005440]"
                      : isCurrent
                      ? "text-[#005440] font-extrabold"
                      : "text-[#6f7a74]"
                  }`}
                >
                  {step.shortLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hero Animated Icon Circle */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Soft breathing halo ring */}
        <div className="absolute w-24 h-24 rounded-full bg-[#005440]/10 animate-pulse pointer-events-none" />
        {/* Crisp circular badge */}
        <div className="relative w-20 h-20 rounded-full bg-[#c9eadb]/40 border-2 border-[#005440]/20 flex items-center justify-center shadow-xs">
          <StepIcon stepKey={current.key} />
        </div>
      </div>

      {/* Step Title & Detail */}
      <div className="space-y-2 mb-6 max-w-md mx-auto w-full">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#005440] uppercase tracking-wider bg-[#c9eadb]/50 px-3 py-1 rounded-full">
            Step {current.stepNumber} of 04 · {current.label}
          </span>
        </div>
        <h3 className="text-lg sm:text-xl font-headline font-bold text-[#181d1a] tracking-tight">
          {current.title}
        </h3>
        <p className="text-xs sm:text-[13px] text-[#6f7a74] leading-relaxed">
          {current.detail}
        </p>
      </div>

      {/* Progress percentage bar */}
      <div className="w-full bg-[#e5e9e5] h-2 rounded-full overflow-hidden mb-6">
        <div
          className="bg-gradient-to-r from-[#005440] to-[#0f6e56] h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.round(progress)}%` }}
        />
      </div>

      {/* Helpful Hint Card */}
      <div className="w-full bg-[#f7f9f7] border border-[#bec9c3]/30 rounded-xl p-3.5 flex items-center gap-3 text-left">
        <div className="w-7 h-7 rounded-lg bg-[#c9eadb]/40 flex items-center justify-center shrink-0">
          <Lightbulb className="w-4 h-4 text-[#005440]" />
        </div>
        <p className="text-[11px] sm:text-xs text-[#3f4944] leading-relaxed">
          <span className="font-bold text-[#181d1a]">Kafla Intelligence:</span> Once generated, you can review each day, regenerate alternatives, or edit activities before saving to your trip.
        </p>
      </div>
    </div>
  );
}
