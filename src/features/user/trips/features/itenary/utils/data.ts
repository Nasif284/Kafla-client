import { CatCfg, GetGroupItineraryResponseDTO } from "../interfaces/interfaces";

export const TRIP_START = new Date("2025-06-12");
export const TRIP_END = new Date("2025-06-28");

export const CATEGORY_CFG: Record<string, CatCfg> = {
  FOOD: { label: "Food & Dining", color: "text-amber-700", bg: "bg-amber-100", dot: "bg-amber-500" },
  TRANSPORT: { label: "Transport", color: "text-purple-700", bg: "bg-purple-100", dot: "bg-purple-500" },
  ACCOMMODATION: { label: "Accommodation", color: "text-blue-700", bg: "bg-blue-100", dot: "bg-blue-500" },
  ACTIVITY: { label: "Activity", color: "text-[#005440]", bg: "bg-[#c9eadb]", dot: "bg-[#0f6e56]" },
  SIGHTSEEING: { label: "Sightseeing", color: "text-rose-700", bg: "bg-red-100", dot: "bg-red-100" },
  OTHER: { label: "Other", color: "text-[#3f4944]", bg: "bg-[#e5e2de]", dot: "bg-[#bec9c3]" },
};

export function getCat(code: string): CatCfg {
  return CATEGORY_CFG[code] ?? CATEGORY_CFG.OTHER;
}

export const CATEGORY_OPTIONS = [
  { value: "FOOD", label: "Food & Dining" },
  { value: "TRANSPORT", label: "Transport" },
  { value: "ACCOMMODATION", label: "Accommodation" },
  { value: "ACTIVITY", label: "Activity" },
  { value: "SIGHTSEEING", label: "Sightseeing" },
  { value: "OTHER", label: "Other" },
];


