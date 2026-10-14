import { ActivityFormValues } from "../validators/validators";

export interface ItineraryActivityDTO {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  category: { code: string; name: string };
  startTime: string | null;
  durationMinutes: number | null;
  notes: string | null;
  isCompleted: boolean;
  createdBy: { id: string; fullName: string; avatarUrl: string | null };
}

export interface ItineraryDayDTO {
  id: string;
  date: Date | string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  summary: string | null;
  activities: ItineraryActivityDTO[];
}

export interface GetGroupItineraryResponseDTO {
  groupId: string;
  days: ItineraryDayDTO[];
}

export interface CatCfg {
  label: string;
  color: string;
  bg: string;
  dot: string;
}



export interface CreateItineraryActivityRequestDTO {
  title: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  categoryCode: string;
  startTime?: string;
  durationMinutes?: number;
  notes?: string;
}


export type FormValues = ActivityFormValues & {
  location: string;
  latitude: number | null;
  longitude: number | null;
};


export interface ActivityModalProps {
  mode: "add" | "edit";
  date: Date | string;
  dayNumber: number;
  initial?: {
    title: string;
    description: string | null;
    category: string;
    location: string | null;
    latitude: number | null;
    longitude: number | null;
    startTime: string | null;
    durationMinutes: number | null;
    notes: string | null;
  };
  onSave: (data: CreateItineraryActivityRequestDTO) => void;
  onClose: () => void;
}



export interface CreateItineraryDayRequestDTO {
  date: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  summary: string | null;
}

export interface DayModalProps {
  mode: "setup" | "edit";
  date: Date | string;
  dayNumber: number;
  initial?: {
    location: string | null;
    latitude: number | null;
    longitude: number | null;
    summary: string | null;
  };
  onSave: (data: CreateItineraryDayRequestDTO) => void;
  onClose: () => void;
}
