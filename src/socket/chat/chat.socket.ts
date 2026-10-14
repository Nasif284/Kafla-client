import { ChatImageAttachment } from "@/src/features/user/trips/features/chat/interfaces/interfaces";
import { getSocket } from "../socket";

export function joinConversation(conversationId: string) {
  getSocket().emit("chat:join", conversationId);
}

export function leaveConversation(conversationId: string) {
  getSocket().emit("chat:leave", conversationId);
}

export function sendMessage(target: string | { conversationId: string }, content: string) {
  const conversationId = typeof target === "string" ? target : target.conversationId;
  getSocket().emit("chat:send", {
    conversationId,
    type: "TEXT",
    content,
  });
}

export function sendImageMessage(target: string | { conversationId: string }, attachment: ChatImageAttachment) {
  const conversationId = typeof target === "string" ? target : target.conversationId;
  getSocket().emit("chat:send", {
    conversationId,
    type: "IMAGE",
    attachment,
  });
}

export function markConversationAsRead(conversationId: string) {
  if (conversationId) {
    getSocket().emit("chat:read", { conversationId });
  }
}