import axios from "axios";
import { userApi as api } from "../../../../lib/api-client";

export const onboardingService = {
  onboardingSource: async (data: { source: string }) => {
    const res = await api.post("/onboarding/source", data);
    return res.data;
  },
  getPlacesSuggestion: async (value: string) => {
    const res = await axios.post(
      "/api/places/autocomplete",
      {
        input: value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return res.data;
  },
  getPlaceDetails: async (placeId: string) => {
    const res = await axios.post(
      "/api/places/details",
      {
        placeId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return res.data;
  },
};
