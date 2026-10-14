import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ChatMessageDTO } from "../interfaces/interfaces";
import { getSocket } from "@/src/socket/socket";
import { joinConversation, leaveConversation } from "@/src/socket/chat/chat.socket";

interface UseChatSocketProps {
  conversationId?: string;
  onMessage?: (message: ChatMessageDTO) => void;
}

export function useChatSocket({ conversationId, onMessage }: UseChatSocketProps) {
  const queryClient = useQueryClient();

  const handleMessage = useCallback(
    (message: ChatMessageDTO) => {
      console.log("[Chat] New message:", message);
      if (message.conversationId) {
        queryClient.setQueryData(
          ["messages", message.conversationId],
          (previous: { data: { messages: ChatMessageDTO[] } } | undefined) => {
            if (!previous) return previous;

            const messages = previous.data?.messages ?? [];

            if (messages.some((item: ChatMessageDTO) => item.id === message.id)) {
              return previous;
            }

            return {
              ...previous,
              data: {
                ...previous.data,
                messages: [...messages, message],
              },
            };
          },
        );
        queryClient.invalidateQueries({
          queryKey: ["messages", message.conversationId],
        });
      }
      if (onMessage) {
        onMessage(message);
      }
    },
    [queryClient, onMessage],
  );

  const handleError = useCallback((error: { message: string }) => {
    console.error("[Chat]", error.message);
  }, []);

  const handleMessagesRead = useCallback(
    (readData: { conversationId: string; readerId: string; readAt: string }) => {
      if (conversationId && readData.conversationId === conversationId) {
        queryClient.setQueryData(
          ["messages", conversationId],
          (previous: { data: { messages: ChatMessageDTO[] } } | undefined) => {
            if (!previous) return previous;
            const updatedMessages = (previous.data?.messages ?? []).map((msg) =>
              msg.senderId !== readData.readerId && msg.status !== "READ"
                ? { ...msg, status: "READ" as const, readAt: readData.readAt }
                : msg,
            );
            return {
              ...previous,
              data: {
                ...previous.data,
                messages: updatedMessages,
              },
            };
          },
        );
      }
    },
    [conversationId, queryClient],
  );

  useEffect(() => {
    const socket = getSocket();

    if (conversationId) {
      joinConversation(conversationId);
    }

    socket.on("chat:message", handleMessage);
    socket.on("chat:messages_read", handleMessagesRead);
    socket.on("chat:error", handleError);

    return () => {
      if (conversationId) {
        leaveConversation(conversationId);
      }
      socket.off("chat:message", handleMessage);
      socket.off("chat:messages_read", handleMessagesRead);
      socket.off("chat:error", handleError);
    };
  }, [conversationId, handleMessage, handleMessagesRead, handleError]);
}
