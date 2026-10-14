export type Option = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

export interface TravelStyleData {
  travelType: string;
  interests: string[];
  travelPersonality: string;
  matchWith: string;
}

export interface DestinationSuggestion {
  placeId: string;
  displayName: string;
  city: string | null;
  state: string | null;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
}

export interface SuggestionInterface {
  placePrediction: {
    place: string;
    text: {
      text: string;
    };
  };
}

export interface PlaceData {
  languageCode: string;
  longText: string;
  shortText: string;
  types: string[];
}

export type TripStyle = "Adventure" | "Leisure" | "Cultural";
export type BudgetCategory = "budget" | "moderate" | "premium" | "luxury";

export interface TripPlanData {
  name: string;
  placeId: string;
  destinationName: string;
  city: string | null;
  state: string | null;
  countryCode: string;
  latitude: number;
  longitude: number;
  dateFrom: Date;
  dateTo: Date;
  travelStyleCode: string;
  budgetStyle: string;
}
