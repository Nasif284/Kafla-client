import { ItineraryActivityDTO, ItineraryDayDTO } from "../../interfaces/interfaces";

export const DAY_COLORS = [
  "#0f6e56", // Emerald (Day 1 - brand)
  "#4338ca", // Indigo (Day 2)
  "#b45309", // Amber (Day 3)
  "#be123c", // Rose (Day 4)
  "#0d9488", // Teal (Day 5)
  "#7c3aed", // Violet (Day 6)
  "#c2410c", // Orange (Day 7)
  "#0369a1", // Sky (Day 8+)
];

export function getDayColor(dayIndex: number): string {
  return DAY_COLORS[dayIndex % DAY_COLORS.length];
}

// In-memory cache for decoded road curves from Google Routes API v2
export const roadPathCache = new Map<string, Array<{ lat: number; lng: number }>>();

export interface RouteMapCanvasProps {
  dayNumber?: number;
  dayDate?: Date | string;
  activities?: ItineraryActivityDTO[];
  daySummary?: string | null;
  dayLocation?: string | null;
  days?: ItineraryDayDTO[];
  defaultExpanded?: boolean;
  className?: string;
  title?: string;
}

export interface ValidMarkerPoint {
  id: string;
  dayIndex: number;
  seqNumber: number;
  label: string;
  title: string;
  location?: string | null;
  latitude: number;
  longitude: number;
  startTime?: string | null;
  durationMinutes?: number | null;
  category?: { code: string; name: string };
  color: string;
}

export interface MapContentProps {
  stops: ValidMarkerPoint[];
  activeStop: ValidMarkerPoint | null;
  onSelectStop: (stop: ValidMarkerPoint | null) => void;
  dayMode: "single" | "multi";
  activeDayTab: number | "all";
  routeColor: string;
  onRoadRouteLoaded?: (hasRoad: boolean) => void;
}
