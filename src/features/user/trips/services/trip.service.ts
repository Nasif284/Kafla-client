import { userApi as api } from "../../../../lib/api-client";
import { CreateGroupPayload, UpdateGroupPayload } from "../interfaces/interface";

export const tripServices = {
  getActiveGroups: async () => {
    const res = await api.get("/trips/groups/active");
    return res.data;
  },
  getPastGroups: async () => {
    const res = await api.get("/trips/groups/past");
    return res.data;
  },
  createGroup: async (payload: CreateGroupPayload) => {
    const res = await api.post("/trips/groups", payload);
    return res.data;
  },
  updateGroup: async (id: string, payload: UpdateGroupPayload) => {
    const res = await api.put(`/trips/groups/${id}`, payload);
    return res.data;
  },
  deleteGroup: async (id: string) => {
    const res = await api.delete(`/trips/groups/${id}`);
    return res.data;
  },
  getGroup: async (id: string) => {
    const res = await api.get(`/trips/groups/${id}`);
    return res.data;
  },
  getWeather: async (id: string) => {
    const res = await api.get(`/trips/groups/${id}/weather`);
    return res.data;
  },
};
