export interface GroupMembers {
  id: string;
  name: string;
  avatarUrl?: string;
  role?: string;
  joinedAt?: Date;
}

export interface GroupDestinationDetails {
  id: string;
  placeId: string;
  name: string;
  city: string | null;
  state: string | null;
  country: string;
  latitude: number;
  longitude: number;
  coverUrl?: string | null;
}

export interface GroupData {
  id: string;
  name: string;
  description?: string | null;
  dateTo: Date | string;
  dateFrom: Date | string;
  coverUrl: string;
  destination: string;
  budgetStyle?: string;
  inviteCode?: string;
  statusCode?: string;
  currencyCode?: string;
  destinationDetails?: GroupDestinationDetails;
  members: GroupMembers[];
}

export interface CreateGroupPayload {
  name: string;
  placeId?: string;
  destinationName?: string;
  city?: string | null;
  state?: string | null;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
  dateFrom: Date | string;
  dateTo: Date | string;
  coverUrl?: string;
  currencyCode?: string;
  description?: string;
}

export type UpdateGroupPayload = Partial<CreateGroupPayload>;
 
export interface DailyWeatherForecast {
  date: string; // YYYY-MM-DD
  weatherCode: number;
  weatherDescription: string;
  minTemperature: number;
  maxTemperature: number;
  precipitationProbability?: number;
}

export interface TripWeatherResponseDTO {
  location: {
    city: string;
    state?: string | null;
    country: string;
  };
  current: {
    temperature: number;
    apparentTemperature: number;
    weatherCode: number;
    weatherDescription: string;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    isDay: boolean;
    updatedAt: Date | string;
  };
  today: {
    minTemperature: number;
    maxTemperature: number;
  };
  forecast?: DailyWeatherForecast[];
}