import React from "react";
import { DailyWeatherForecast } from "../../../interfaces/interface";
import { WeatherIcon } from "../../../components/WeatherIcon";
import { Droplets } from "lucide-react";

interface DayWeatherBadgeProps {
  forecast?: DailyWeatherForecast | null;
  size?: "sm" | "md";
  variant?: "pill" | "card" | "strip";
  selected?: boolean;
  className?: string;
}

export function getWeatherTheme(code: number, rainProb?: number) {
  // Thunderstorm
  if (code >= 95) {
    return {
      type: "storm",
      gradientBg: "bg-gradient-to-r from-purple-50 via-indigo-50/60 to-purple-100/40 border-purple-200/80",
      pillBg: "bg-purple-50 text-purple-950 border-purple-300 hover:bg-purple-100",
      accentText: "text-purple-950",
      subText: "text-purple-800/80",
      iconBoxBg: "bg-purple-100/80 text-purple-700",
      badgePill: "bg-purple-100 text-purple-800 border-purple-200",
      advice: "Thunderstorms expected. Keep indoor alternatives ready.",
    };
  }
  // Rain / Showers / Drizzle
  if (
    (code >= 51 && code <= 65) ||
    (code >= 80 && code <= 82) ||
    (rainProb !== undefined && rainProb >= 50)
  ) {
    return {
      type: "rain",
      gradientBg: "bg-gradient-to-r from-sky-50 via-blue-50/60 to-cyan-50/40 border-sky-200/90",
      pillBg: "bg-sky-50 text-sky-950 border-sky-300 hover:bg-sky-100",
      accentText: "text-sky-950",
      subText: "text-sky-800/80",
      iconBoxBg: "bg-sky-100/80 text-sky-700",
      badgePill: "bg-sky-100 text-sky-800 border-sky-200",
      advice: "Rain expected. Bring an umbrella or pack a rain jacket.",
    };
  }
  // Snow
  if (code >= 71 && code <= 75) {
    return {
      type: "snow",
      gradientBg: "bg-gradient-to-r from-blue-50 via-indigo-50/40 to-slate-50 border-blue-200",
      pillBg: "bg-blue-50 text-blue-950 border-blue-200 hover:bg-blue-100",
      accentText: "text-blue-950",
      subText: "text-blue-800/80",
      iconBoxBg: "bg-blue-100/80 text-blue-700",
      badgePill: "bg-blue-100 text-blue-800 border-blue-200",
      advice: "Cold snowy weather. Dress in warm thermal layers.",
    };
  }
  // Clear / Sunny
  if (code === 0 || code === 1) {
    return {
      type: "sunny",
      gradientBg: "bg-gradient-to-r from-amber-50 via-orange-50/40 to-amber-100/50 border-amber-200/90",
      pillBg: "bg-amber-50 text-amber-950 border-amber-300 hover:bg-amber-100",
      accentText: "text-amber-950",
      subText: "text-amber-800/80",
      iconBoxBg: "bg-amber-100/80 text-amber-700",
      badgePill: "bg-amber-100 text-amber-900 border-amber-200",
      advice: "Sunny and pleasant. Ideal for walking tours and outdoor activities.",
    };
  }
  // Cloudy / Overcast / Fog
  return {
    type: "cloudy",
    gradientBg: "bg-gradient-to-r from-emerald-50/40 via-[#f1f4f1] to-slate-100/60 border-[#bec9c3]/30",
    pillBg: "bg-[#f1f4f1] text-[#181d1a] border-[#bec9c3]/40 hover:bg-[#e8ece9]",
    accentText: "text-[#181d1a]",
    subText: "text-[#6f7a74]",
    iconBoxBg: "bg-emerald-100/60 text-[#0f6e56]",
    badgePill: "bg-[#c9eadb]/50 text-[#005440] border-[#0f6e56]/20",
    advice: "Mild overcast skies. Comfortable weather for touring.",
  };
}

export default function DayWeatherBadge({
  forecast,
  size,
  variant,
  selected = false,
  className = "",
}: DayWeatherBadgeProps) {
  if (!forecast) return null;

  const maxT = Math.round(forecast.maxTemperature);
  const minT = Math.round(forecast.minTemperature);
  const rainProb = forecast.precipitationProbability;
  const showRain = rainProb !== undefined && rainProb > 25;

  // Original compact size for timeline inline badge
  if (size === "sm") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 bg-[#f1f4f1] border border-[#bec9c3]/20 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-bold text-[#181d1a] shrink-0 transition-colors select-none ${className}`}
        title={`${forecast.weatherDescription} · High: ${maxT}°C, Low: ${minT}°C${
          rainProb !== undefined ? ` · Rain chance: ${rainProb}%` : ""
        }`}
      >
        <WeatherIcon
          code={forecast.weatherCode}
          isDay={true}
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#005440] shrink-0"
        />
        <span className="text-[11px] sm:text-xs font-black text-[#181d1a]">
          {maxT}° / {minT}°
        </span>
        {showRain && (
          <span className="text-[10px] font-bold text-sky-700 ml-0.5 inline-flex items-center gap-0.5">
            <Droplets className="w-2.5 h-2.5 text-sky-600 shrink-0" />
            <span>{rainProb}%</span>
          </span>
        )}
      </div>
    );
  }

  const theme = getWeatherTheme(forecast.weatherCode, rainProb);

  // ── Variant: Card (Rich Day Weather Card for Day Focus Mode) ──────
  if (variant === "card" || size === "md") {
    return (
      <div
        className={`p-4 rounded-2xl border transition-all ${theme.gradientBg} shadow-xs ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs shrink-0 ${theme.iconBoxBg}`}
            >
              <WeatherIcon
                code={forecast.weatherCode}
                isDay={true}
                colored={true}
                className="w-7 h-7"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xl sm:text-2xl font-black tracking-tight ${theme.accentText}`}>
                  {maxT}° <span className="text-sm font-semibold opacity-70">/ {minT}°C</span>
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${theme.badgePill}`}
                >
                  {forecast.weatherDescription}
                </span>
                {showRain && (
                  <span className="text-xs font-black text-sky-800 bg-sky-100/90 border border-sky-300/60 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                    <Droplets className="w-3 h-3 text-sky-700 shrink-0" />
                    <span>{rainProb}% Rain</span>
                  </span>
                )}
              </div>
              <p className={`text-xs mt-1 font-medium ${theme.subText}`}>
                {theme.advice}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 border-l border-black/10 pl-4 py-1 text-right shrink-0">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6f7a74] block">
                Daily Forecast
              </span>
              <span className="text-xs font-black text-[#181d1a]">
                High: {maxT}°C · Low: {minT}°C
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Variant: Strip (Mini Chip inside Day Strip tab buttons) ──────
  if (variant === "strip") {
    return (
      <div
        className={`flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-black transition-all select-none ${
          selected
            ? "bg-white text-[#005440] shadow-sm border border-white/80"
            : `${theme.pillBg} border`
        } ${className}`}
        title={`${forecast.weatherDescription} · High: ${maxT}°C`}
      >
        <WeatherIcon
          code={forecast.weatherCode}
          isDay={true}
          colored={true}
          className="w-3 h-3 shrink-0"
        />
        <span className={selected ? "text-[#005440] font-black leading-none" : "leading-none"}>
          {maxT}°
        </span>
      </div>
    );
  }

  // Default compact inline pill
  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-[#f1f4f1] border border-[#bec9c3]/20 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-bold text-[#181d1a] shrink-0 transition-colors select-none ${className}`}
      title={`${forecast.weatherDescription} · High: ${maxT}°C, Low: ${minT}°C${
        rainProb !== undefined ? ` · Rain chance: ${rainProb}%` : ""
      }`}
    >
      <WeatherIcon
        code={forecast.weatherCode}
        isDay={true}
        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#005440] shrink-0"
      />
      <span className="text-[11px] sm:text-xs font-black text-[#181d1a]">
        {maxT}° / {minT}°
      </span>
      {showRain && (
        <span className="text-[10px] font-bold text-sky-700 ml-0.5 inline-flex items-center gap-0.5">
          <Droplets className="w-2.5 h-2.5 text-sky-600 shrink-0" />
          <span>{rainProb}%</span>
        </span>
      )}
    </div>
  );
}
