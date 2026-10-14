import { ItineraryActivityDTO, ItineraryDayDTO } from "../interfaces/interfaces";
import { DailyWeatherForecast } from "../../../interfaces/interface";
import { formatDayLabel, formatDuration, formatFullDate, formatDateOnly } from "./helpers";
import { getCat } from "./data";

export interface TripExportMeta {
  tripName?: string;
  destination: string;
  dateFrom?: string | Date;
  dateTo?: string | Date;
  travelerCount?: number;
}

export interface ExportPdfOptions {
  trip: TripExportMeta;
  mode: "day" | "full";
  selectedDay?: ItineraryDayDTO | null;
  dayNumber?: number;
  days: ItineraryDayDTO[];
  forecasts?: DailyWeatherForecast[];
  includeWeather?: boolean;
  includeNotes?: boolean;
  includeCheckboxes?: boolean;
}

// ── Inline Vector SVG Icons for Print Fidelity ─────────────────────────────────
const SVG_ICONS = {
  logo: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#005440" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
  calendar: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f6e56" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  clock: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6f7a74" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  mapPin: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0f6e56" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  sun: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  rain: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2"><line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/><line x1="12" y1="15" x2="12" y2="23"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>`,
  cloud: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
  check: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#005440" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  note: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
};

function getWeatherIconSvg(code?: number) {
  if (code === undefined || code === null) return SVG_ICONS.sun;
  if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82)) return SVG_ICONS.rain;
  if (code >= 1 && code <= 3) return SVG_ICONS.cloud;
  return SVG_ICONS.sun;
}

// ── Category Color Map for Clean Print Reproduction ───────────────────────────
function getCategoryPrintBadge(catCode: string, catName: string) {
  const cat = getCat(catCode);
  let bgHex = "#f1f5f9";
  let textHex = "#334155";
  let borderHex = "#cbd5e1";

  switch (catCode) {
    case "FOOD":
      bgHex = "#fef3c7";
      textHex = "#92400e";
      borderHex = "#fde68a";
      break;
    case "TRANSPORT":
      bgHex = "#f3e8ff";
      textHex = "#6b21a8";
      borderHex = "#e9d5ff";
      break;
    case "ACCOMMODATION":
      bgHex = "#e0f2fe";
      textHex = "#0369a1";
      borderHex = "#bae6fd";
      break;
    case "ACTIVITY":
      bgHex = "#dcfce7";
      textHex = "#166534";
      borderHex = "#bbf7d0";
      break;
    case "SIGHTSEEING":
      bgHex = "#ffe4e6";
      textHex = "#9f1239";
      borderHex = "#fecdd3";
      break;
    default:
      bgHex = "#f1f5f9";
      textHex = "#334155";
      borderHex = "#cbd5e1";
  }

  return `<span style="background-color: ${bgHex}; color: ${textHex}; border: 1px solid ${borderHex}; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 2px 7px; border-radius: 9999px; display: inline-block;">${catName || cat.label}</span>`;
}

// ── HTML Document Generator ────────────────────────────────────────────────────
export function buildItineraryPrintHtml(options: ExportPdfOptions): string {
  const {
    trip,
    mode,
    selectedDay,
    dayNumber = 1,
    days,
    forecasts = [],
    includeWeather = true,
    includeNotes = true,
    includeCheckboxes = true,
  } = options;

  const targetDays = mode === "day" ? (selectedDay ? [selectedDay] : []) : days;
  const isFull = mode === "full";

  const tripTitle = trip.tripName || `Trip to ${trip.destination}`;
  const dateRangeStr =
    trip.dateFrom && trip.dateTo
      ? `${formatFullDate(trip.dateFrom)} – ${formatFullDate(trip.dateTo)}`
      : "Upcoming Trip";

  // Build Day HTML Sections
  const daysHtml = targetDays
    .map((day, idx) => {
      const currentDayNumber = isFull ? idx + 1 : dayNumber;
      const dayDate = new Date(day.date);
      const dayDateStr = formatDateOnly(dayDate);
      const dayForecast = forecasts.find((f) => f.date === dayDateStr);
      const sortedActivities = [...(day.activities || [])].sort((a, b) => {
        if (!a.startTime) return 1;
        if (!b.startTime) return -1;
        return a.startTime.localeCompare(b.startTime);
      });

      // Weather banner for the day
      let weatherHtml = "";
      if (includeWeather && dayForecast) {
        const maxT = Math.round(dayForecast.maxTemperature);
        const minT = Math.round(dayForecast.minTemperature);
        const rainProb = dayForecast.precipitationProbability;
        weatherHtml = `
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 12px; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-flex; align-items: center;">${getWeatherIconSvg(dayForecast.weatherCode)}</span>
              <div>
                <span style="font-size: 12px; font-weight: 800; color: #0f172a;">${dayForecast.weatherDescription}</span>
                <span style="font-size: 11px; color: #64748b; margin-left: 6px;">· High: <strong>${maxT}°C</strong> / Low: ${minT}°C</span>
              </div>
            </div>
            ${
              rainProb !== undefined && rainProb > 0
                ? `<span style="font-size: 11px; font-weight: 700; color: #0284c7; background: #e0f2fe; padding: 2px 8px; border-radius: 9999px;">${rainProb}% Rain Chance</span>`
                : ""
            }
          </div>
        `;
      }

      // Activities list
      const activitiesHtml =
        sortedActivities.length > 0
          ? sortedActivities
              .map((act) => {
                const durationText = act.durationMinutes ? formatDuration(act.durationMinutes) : "";
                return `
                  <div style="page-break-inside: avoid; break-inside: avoid; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 14px; margin-bottom: 10px; background-color: #ffffff; display: flex; gap: 14px;">
                    <!-- Left: Time column & Checkbox -->
                    <div style="width: 78px; flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 6px;">
                      <span style="font-size: 11px; font-weight: 800; color: #005440; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 2px 6px; border-radius: 6px; letter-spacing: 0.02em;">
                        ${act.startTime || "Anytime"}
                      </span>
                      ${
                        durationText
                          ? `<span style="font-size: 10px; color: #64748b; display: flex; align-items: center; gap: 4px;">
                              ${SVG_ICONS.clock} ${durationText}
                            </span>`
                          : ""
                      }
                      ${
                        includeCheckboxes
                          ? `<div style="display: flex; align-items: center; gap: 5px; margin-top: 2px;">
                              <div style="width: 14px; height: 14px; border: 1.5px solid #94a3b8; border-radius: 4px;"></div>
                              <span style="font-size: 9px; color: #94a3b8; font-weight: 600;">Check</span>
                            </div>`
                          : ""
                      }
                    </div>

                    <!-- Right: Activity Details -->
                    <div style="flex: 1; min-width: 0;">
                      <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
                        <h4 style="margin: 0; font-size: 13px; font-weight: 800; color: #0f172a; line-height: 1.3;">
                          ${act.title}
                        </h4>
                        <div>
                          ${getCategoryPrintBadge(act.category.code, act.category.name)}
                        </div>
                      </div>

                      ${
                        act.location
                          ? `<div style="font-size: 11px; color: #0f6e56; font-weight: 600; display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
                              ${SVG_ICONS.mapPin} <span>${act.location}</span>
                            </div>`
                          : ""
                      }

                      ${
                        act.description
                          ? `<p style="margin: 0 0 6px 0; font-size: 11px; color: #334155; line-height: 1.45;">
                              ${act.description}
                            </p>`
                          : ""
                      }

                      ${
                        includeNotes && act.notes
                          ? `<div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; padding: 5px 8px; font-size: 10px; color: #92400e; display: flex; align-items: flex-start; gap: 6px; margin-top: 4px;">
                              <span style="flex-shrink: 0; margin-top: 1px;">${SVG_ICONS.note}</span>
                              <span style="line-height: 1.4;"><strong>Note:</strong> ${act.notes}</span>
                            </div>`
                          : ""
                      }
                    </div>
                  </div>
                `;
              })
              .join("")
          : `<p style="font-size: 12px; color: #64748b; font-style: italic; padding: 12px 0;">No activities scheduled for this day.</p>`;

      return `
        <div class="${isFull && idx > 0 ? "page-break" : ""}" style="margin-bottom: 28px;">
          <!-- Day Header Banner -->
          <div style="border-bottom: 2px solid #005440; padding-bottom: 8px; margin-bottom: 12px; display: flex; align-items: flex-end; justify-content: space-between;">
            <div>
              <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.1em; color: #0f6e56; text-transform: uppercase;">
                ${formatDayLabel(dayDate)} · ${dayDateStr}
              </div>
              <h3 style="margin: 2px 0 0 0; font-size: 18px; font-weight: 900; color: #005440; letter-spacing: -0.01em;">
                Day ${currentDayNumber} — ${day.location || trip.destination}
              </h3>
              ${
                day.summary
                  ? `<p style="margin: 3px 0 0 0; font-size: 11px; color: #475569; font-weight: 500;">
                      ${day.summary}
                    </p>`
                  : ""
              }
            </div>
            <div style="text-align: right; flex-shrink: 0;">
              <span style="font-size: 10px; font-weight: 700; color: #475569; background: #f1f5f9; padding: 3px 8px; border-radius: 9999px;">
                ${sortedActivities.length} Activities Planned
              </span>
            </div>
          </div>

          ${weatherHtml}
          ${activitiesHtml}
        </div>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>${tripTitle} — ${mode === "day" ? `Day ${dayNumber}` : "Complete Itinerary"}</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 12mm 14mm 12mm 14mm;
        }
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: #0f172a;
          background: #ffffff;
          font-size: 12px;
          line-height: 1.5;
        }
        .page-break {
          page-break-before: always;
          break-before: page;
        }
        @media screen {
          body {
            max-width: 800px;
            margin: 20px auto;
            padding: 30px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
          }
        }
      </style>
    </head>
    <body>
      <!-- Document Header -->
      <div style="border-bottom: 3px solid #005440; padding-bottom: 14px; margin-bottom: 20px; display: flex; align-items: flex-start; justify-content: space-between;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            ${SVG_ICONS.logo}
            <span style="font-size: 11px; font-weight: 900; letter-spacing: 0.15em; color: #005440; text-transform: uppercase;">
              Kafla Expedition Itinerary
            </span>
          </div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #0f172a; letter-spacing: -0.02em;">
            ${tripTitle}
          </h1>
          <div style="display: flex; align-items: center; gap: 12px; margin-top: 6px; font-size: 11px; color: #475569; font-weight: 600;">
            <span style="display: flex; align-items: center; gap: 4px;">
              ${SVG_ICONS.mapPin} ${trip.destination}
            </span>
            <span>·</span>
            <span style="display: flex; align-items: center; gap: 4px;">
              ${SVG_ICONS.calendar} ${dateRangeStr}
            </span>
          </div>
        </div>

        <div style="text-align: right; flex-shrink: 0;">
          <div style="background: #f0fdf4; border: 1.5px solid #005440; color: #005440; padding: 4px 10px; border-radius: 8px; font-size: 10px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; display: inline-block;">
            ${mode === "day" ? `Day ${dayNumber} Sheet` : "Full Trip Timeline"}
          </div>
          <div style="font-size: 9px; color: #94a3b8; font-weight: 600; margin-top: 4px;">
            Generated on ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>
      </div>

      <!-- Main Days Content -->
      ${daysHtml}

      <!-- Document Footer -->
      <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 12px; display: flex; align-items: center; justify-content: space-between; font-size: 9px; color: #94a3b8; page-break-inside: avoid; break-inside: avoid;">
        <div>
          <strong>Kafla Travel Workspace</strong> · Prepared for trip members & offline travel
        </div>
        <div>
          Official Travel Document · Keep with travel passes
        </div>
      </div>
    </body>
    </html>
  `;
}

// ── Print Engine Trigger ───────────────────────────────────────────────────────
export function triggerItineraryPrint(options: ExportPdfOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const html = buildItineraryPrintHtml(options);

    // Create an isolated hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.setAttribute("aria-hidden", "true");
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      resolve(false);
      return;
    }

    doc.open();
    doc.write(html);
    doc.close();

    // Allow browser layout engine to calculate styles & fonts
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        resolve(true);
      } catch (err) {
        console.error("Print trigger error:", err);
        resolve(false);
      } finally {
        // Cleanup iframe after print dialog opens
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1500);
      }
    }, 300);
  });
}
