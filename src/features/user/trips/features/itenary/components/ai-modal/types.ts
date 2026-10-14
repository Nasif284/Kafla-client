// ── DTOs ──────────────────────────────────────────────────────────────────────
export interface GenerateAiItineraryRequestDTO {
  tripPace: string;
  interests: string[];
  notes?: string;
  arrivalDate?: string;
  arrivalTime?: string;
  departureDate?: string;
  departureTime?: string;
  companions?: string;
  transportMode?: string;
  accommodationType?: string;
  hotelLocationOrStyle?: string;
  dietary?: string;
}

export interface GeneratedActivity {
  title: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  category: string;
  startTime?: string;
  durationMinutes?: number;
  notes?: string;
}

export interface GeneratedDay {
  date: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  summary?: string;
  activities: GeneratedActivity[];
}

export interface GeneratedItinerary {
  days: GeneratedDay[];
}

// ── Form shape ────────────────────────────────────────────────────────────────
export interface FormValues {
  tripPace: "Relaxed" | "Balanced" | "Active";
  interests: string[];
  notes: string;
  arrivalDate: string;
  arrivalTime: string;
  departureDate: string;
  departureTime: string;
  companions: string;
  transportMode: string;
  accommodationType: "booked" | "suggest";
  hotelLocationOrStyle: string;
  dietary: string;
}

// ── Static options & presets ──────────────────────────────────────────────────
export const ALL_INTERESTS = [
  "Nature",
  "Beaches",
  "Culture",
  "Food",
  "Nightlife",
  "Adventure",
  "Shopping",
  "Wellness",
];

export const PACE_OPTIONS: FormValues["tripPace"][] = ["Relaxed", "Balanced", "Active"];

export const COMPANIONS = [
  { value: "Solo", label: "Solo Traveler" },
  { value: "Couple", label: "Couple" },
  { value: "Friends Group", label: "Friends Group" },
  { value: "Family with Kids", label: "Family with Kids" },
  { value: "Family with Elderly", label: "Family with Elderly" },
];

export const TRANSPORT_MODES = [
  { value: "Walking & Public Transit", label: "Walking & Transit" },
  { value: "Rental Car / Self-Drive", label: "Rental Car" },
  { value: "Taxi / Hired Cabs", label: "Taxis & Private Cabs" },
  { value: "Two-Wheeler / Bike", label: "Two-Wheeler & Scooter" },
];

export const HOTEL_STYLES = [
  "Budget Hostel / Backpacker",
  "Comfort Hotel (3-Star)",
  "Boutique Resort / Luxury",
  "Authentic Local Homestay",
];

export const DIETARY_OPTIONS = [
  { value: "No restrictions", label: "All Cuisines" },
  { value: "Vegetarian", label: "Vegetarian" },
  { value: "Vegan", label: "Vegan" },
  { value: "Halal", label: "Halal" },
  { value: "Authentic Local Food", label: "Authentic Local Specialties" },
];

export interface ProgressStep {
  key: "sights" | "routes" | "timing" | "personalize";
  shortLabel: string;
  label: string;
  stepNumber: string;
  title: string;
  detail: string;
}

export const GENERATION_STEPS: ProgressStep[] = [
  {
    key: "sights",
    shortLabel: "Sights",
    label: "Attractions & Culture",
    stepNumber: "01",
    title: "Curating Iconic Landmarks & Hidden Gems",
    detail: "Scanning top attractions, authentic local cafes, and scenic highlights around your destination.",
  },
  {
    key: "routes",
    shortLabel: "Routes",
    label: "Route Optimization",
    stepNumber: "02",
    title: "Mapping Efficient Routes & Transit Windows",
    detail: "Sequencing daily stops chronologically to minimize transit and avoid back-and-forth travel.",
  },
  {
    key: "timing",
    shortLabel: "Schedule",
    label: "Arrival & Departure",
    stepNumber: "03",
    title: "Synchronizing Schedule with Arrival & Check-in",
    detail: "Calibrating Day 1 pacing with arrival times and tailoring the final day for departure transfers.",
  },
  {
    key: "personalize",
    shortLabel: "Tailoring",
    label: "Tailored Experience",
    stepNumber: "04",
    title: "Crafting Your Personalized Daily Itinerary",
    detail: "Balancing pacing, dietary tastes, and curated recommendations into a cohesive daily schedule.",
  },
];

export const SWAP_PRESET_TAGS = [
  "Cozy Cafe",
  "Indoor Attraction",
  "Low Walking / Accessible",
  "Scenic Viewpoint",
  "Local Culinary Specialty",
  "Nature & Outdoors",
  "Shopping & Artisan Markets",
  "Culture & Historic Heritage",
];

export const REGEN_DAY_PRESET_TAGS = [
  "Slower Pace / Relaxed",
  "Shopping & Local Markets",
  "Evening Dining & Nightlife",
  "Culture & Historic Heritage",
  "Scenic Nature & Outdoors",
  "Late Morning Start (11:00 AM+)",
];
