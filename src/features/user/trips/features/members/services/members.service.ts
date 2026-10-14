import { userApi as api } from "@/src/lib/api-client";

export const memberServices = {
  getMembers: async (id: string) => {
    const res = await api.get(`/trips/groups/${id}/members`);
    return res.data;
  },
  addMembers: async (id: string, data: { members: string[] }) => {
    const res = await api.post(`/trips/groups/${id}/members`, data);
    return res.data;
  },
  getInviteCode: async (id: string) => {
    const res = await api.get(`/trips/groups/${id}/invite/code`);
    return res.data;
  },
  inviteByEmail: async (id: string, data: { email: string }) => {
    const res = await api.post(`/trips/groups/${id}/invite/email`, data);
    return res.data;
  },
  joinWithLink: async (inviteCode: string) => {
    const res = await api.post(`/trips/groups/join/${inviteCode}`);
    return res.data;
  },
  getInvites: async (id: string) => {
    const res = await api.get(`/trips/groups/${id}/invites`);
    return res.data;
  },
  removeMember: async (groupId: string, memberId: string) => {
    const res = await api.patch(`/trips/groups/${groupId}/members/remove/${memberId}`);
    return res.data;
  },
  leaveGroup: async (groupId: string) => {
    const res = await api.patch(`/trips/groups/${groupId}/members/leave`);
    return res.data;
  },
  changeRole: async (groupId: string, memberId: string) => {
    const res = await api.patch(`/trips/groups/${groupId}/members/role/${memberId}`);
    return res.data;
  },
};
