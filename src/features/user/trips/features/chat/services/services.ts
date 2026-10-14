import { userApi as api } from "@/src/lib/api-client";

export const groupChatService = {
  getGroupChatConversationId: async (groupId: string) => {
    const res = await api.get(`/chat/group/${groupId}`);
    return res.data;
  },

  getMessages: async (conversationId: string) => {
    const res = await api.get(`/chat/${conversationId}/messages`);
    return res.data;
  },

  uploadImage: async (data: FormData) => {
    const res = await api.post(`/chat/upload/image`, data);
    return res.data;
  },
};
