import { userApi as api } from "@/src/lib/api-client";
import { CallMediaType } from "../interfaces/call.interfaces";

export const groupCallService = {
  createGroupCall: async (data: { tripGroupId: string; mediaType: CallMediaType }) => {
    const res = await api.post("/calls/group", data);
    return res.data;
  },

  joinCall: async (callId: string) => {
    const res = await api.post(`/calls/${callId}/join`);
    return res.data;
  },

  leaveCall: async (callId: string) => {
    const res = await api.post(`/calls/${callId}/leave`);
    return res.data;
  },
};
