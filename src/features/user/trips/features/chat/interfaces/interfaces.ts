export type SenderProfile = {
  fullName: string;
  avatarUrl: string | null;
};

export interface ChatAttachment {
  id?: string;
  storageKey: string;
  fileName?: string;
  mimeType: string;
  fileSize?: number;
  url?: string;
}

export interface ChatImageAttachment {
  storageKey: string;
  fileName?: string;
  mimeType: string;
  fileSize: number;
}

export interface ChatMessageDTO {
  id: string;
  conversationId: string;
  senderId: string;
  type: "TEXT" | "IMAGE";
  status?: "SENT" | "DELIVERED" | "READ";
  readAt?: Date | string | null;
  sender?: {
    fullName: string;
    avatarUrl: string | null;
  };
  content?: string;
  attachment?: ChatAttachment;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessagesResponseDTO {
  messages: ChatMessageDTO[];
}
