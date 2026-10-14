import { ChatMessageDTO, SenderProfile } from "../interfaces/interfaces";

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

export function ChatMessage({ message, profile, currentUserId }: { message: ChatMessageDTO; profile?: SenderProfile; currentUserId: string }) {
  const isCurrentUser = message.senderId === currentUserId;

  if (isCurrentUser) {
    return (
      <div className="ml-auto flex max-w-[85%] sm:max-w-[75%] flex-row-reverse gap-2.5">
        <div className="space-y-1 text-right">
          <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-[#9ca8a3]">
            <span>You</span>
            <span>·</span>
            <span>{timeFormatter.format(new Date(message.createdAt))}</span>
          </div>
          <div className="rounded-2xl rounded-br-xs bg-[#005440] px-4 py-2.5 text-sm leading-relaxed text-white shadow-xs">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  const avatarUrl = profile?.avatarUrl;
  const fullName = profile?.fullName || "Group Member";
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <div className="flex max-w-[85%] sm:max-w-[75%] gap-2.5 items-end">
      {avatarUrl ? (
        <img src={avatarUrl} alt={fullName} className="h-8 w-8 rounded-full object-cover shrink-0 shadow-2xs border border-white" />
      ) : (
        <div className="h-8 w-8 rounded-full bg-[#005440]/10 text-[#005440] font-bold text-xs flex items-center justify-center shrink-0 border border-white">
          {initial}
        </div>
      )}

      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#6f7a74] ml-1">
          <span className="truncate max-w-[140px]">{fullName}</span>
          <span>·</span>
          <span>{timeFormatter.format(new Date(message.createdAt))}</span>
        </div>
        <div className="rounded-2xl rounded-bl-xs bg-white border border-[#bec9c3]/20 px-4 py-2.5 text-sm leading-relaxed text-[#181d1a] shadow-xs">
          {message.content}
        </div>
      </div>
    </div>
  );
}
