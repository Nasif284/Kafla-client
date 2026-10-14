import { useMutation, useQuery } from "@tanstack/react-query";
import { groupChatService } from "../services/services";
import { AxiosError } from "axios";
import { ApiError } from "@/src/types/types";
import { toast } from "sonner";

export function useGetConversationId(groupId: string) {
  return useQuery({
    queryKey: ["group_chat_conversation_id", groupId],
    queryFn: () => groupChatService.getGroupChatConversationId(groupId),
    enabled: !!groupId,
  });
}

export function useGetMessages(conversationId: string) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => groupChatService.getMessages(conversationId),
    enabled: !!conversationId,
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: (data: FormData) => groupChatService.uploadImage(data),
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong uploading image");
    },
  });
}