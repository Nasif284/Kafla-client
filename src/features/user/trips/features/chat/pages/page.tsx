"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Paperclip, Users, Search, Send, Smile } from "lucide-react";
import HeaderAction from "../components/HeaderAction";
import { ChatMessage } from "../components/ChatMessage";
import { useGetConversationId, useGetMessages } from "../hooks/hooks";
import { useChatSocket } from "../hooks/socketHooks";
import { sendMessage } from "@/src/socket/chat/chat.socket";
import { useAuthStore } from "@/src/store/auth.store";
import { ChatMessageDTO } from "../interfaces/interfaces";
import GroupCallSections from "../components/GroupCallSections";
import { useGetGroup } from "@/src/features/user/trips/hooks/trip.hooks";

import EmojiPicker from "../components/EmojiPicker";

export default function GroupChatPage() {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const { id: groupId } = useParams<{ id: string }>();

  const { data: groupData, isLoading: groupLoading } = useGetGroup(groupId);
  const group = groupData?.data;

  const { data: convData, isLoading: convLoading } = useGetConversationId(groupId);
  const conversationId = convData?.data?.conversationId;

  const { data: messagesData, isLoading: messagesLoading } = useGetMessages(conversationId);
  const messages = messagesData?.data?.messages || [];

  const [content, setContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages?.length]);

  useChatSocket({ conversationId });

  function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedContent = content.trim();
    if (!trimmedContent || !conversationId) return;
    sendMessage(conversationId, trimmedContent);
    setContent("");
    setShowEmojiPicker(false);
  }

  const isLoading = convLoading || messagesLoading || groupLoading;

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-14rem)] min-h-[480px] flex-col rounded-2xl border border-[#bec9c3]/20 bg-white shadow-sm overflow-hidden animate-pulse p-6 justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-3 w-48 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-12 w-2/3 bg-gray-100 rounded-2xl" />
          <div className="h-12 w-1/2 bg-gray-100 rounded-2xl ml-auto" />
        </div>
        <div className="h-12 w-full bg-gray-200 rounded-xl" />
      </div>
    );
  }

  const memberNames = group?.members
    ?.map((m: any) => m.fullName || m.name || "Member")
    .slice(0, 3)
    .join(", ");
  const memberCountExtra = group?.members?.length > 3 ? ` + ${group.members.length - 3} others` : "";
  const subtitle = memberNames ? `${memberNames}${memberCountExtra}` : "Trip Group Chat";

  return (
    <section className="flex h-[calc(100vh-14rem)] min-h-[480px] flex-col overflow-hidden rounded-2xl border border-[#bec9c3]/20 bg-white shadow-sm">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between border-b border-[#bec9c3]/20 bg-white/90 px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-md z-10">
        <div className="flex items-center gap-3 min-w-0">
          {group?.coverUrl ? (
            <img src={group.coverUrl} alt={group.name} className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl object-cover shrink-0 border border-[#bec9c3]/20 shadow-xs" />
          ) : (
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#005440]/10 text-[#005440] shrink-0">
              <Users className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          )}

          <div className="min-w-0">
            <h1 className="font-bold text-sm sm:text-base text-[#181d1a] truncate font-headline">{group?.name || "Group Chat"}</h1>
            <p className="text-xs text-[#6f7a74] truncate">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <GroupCallSections groupId={groupId} groupName={group?.name || "Trip Group"} groupCoverUrl={group?.coverUrl} />
          <HeaderAction label="Search chat">
            <Search className="h-5 w-5" />
          </HeaderAction>
        </div>
      </header>

      {/* Messages Feed */}
      <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f8faf8]/70">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-[#005440]/10 text-[#005440] flex items-center justify-center mb-4">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-extrabold text-[#181d1a] font-headline mb-1">No messages yet</h3>
            <p className="text-xs sm:text-sm text-[#6f7a74] max-w-xs">Start the conversation with your group members!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:gap-5">
            {messages.map((message: ChatMessageDTO) => (
              <ChatMessage key={message.id} message={message} profile={message.sender} currentUserId={currentUserId!} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="shrink-0 border-t border-[#bec9c3]/20 bg-white p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1">
            <input
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="h-11 sm:h-12 w-full rounded-xl border border-[#e0e3e0] bg-[#f1f4f1]/80 px-4 text-sm text-[#181d1a] outline-none placeholder:text-[#9ca8a3] focus:border-[#005440] focus:bg-white focus:ring-2 focus:ring-[#005440]/10 transition-all"
              placeholder="Type a message..."
            />
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 relative">
            {showEmojiPicker && (
              <EmojiPicker
                onSelect={(emoji) => setContent((prev) => prev + emoji)}
                onClose={() => setShowEmojiPicker(false)}
              />
            )}

            <button
              type="button"
              onClick={() => setShowEmojiPicker((v) => !v)}
              aria-label="Add emoji"
              title="Add emoji"
              className={`p-2 rounded-xl transition-colors ${
                showEmojiPicker ? "bg-[#005440]/10 text-[#005440]" : "text-[#6f7a74] hover:text-[#005440] hover:bg-[#f1f4f1]"
              }`}
            >
              <Smile className="h-5 w-5" />
            </button>

            <button type="button" aria-label="Attach file" title="Attach file" className="p-2 text-[#6f7a74] hover:text-[#005440] hover:bg-[#f1f4f1] rounded-xl transition-colors">
              <Paperclip className="h-5 w-5" />
            </button>

            <button
              type="submit"
              disabled={!content.trim()}
              aria-label="Send message"
              title="Send message"
              className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#005440] text-white shadow-sm transition-all hover:bg-[#004030] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#005440]"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
