"use client";

import { useJoinCall } from "../hooks/call.hooks";
import { Phone, Video } from "lucide-react";
import { useAuthStore } from "@/src/store/auth.store";
import { useCallStore } from "@/src/store/call.store";

export default function IncomingCallModal() {
  const incomingCall = useCallStore((state) => state.incomingCall);
  const currentUserId = useAuthStore((state) => state.user?.id);
  const setConnecting = useCallStore((state) => state.setConnecting);
  const clearCall = useCallStore((state) => state.clearCall);
  const setGroupParticipants = useCallStore((state) => state.setGroupParticipants);

  const { mutateAsync: joinCall, isPending: isJoining } = useJoinCall();

  if (!incomingCall) {
    return null;
  }

  const image = incomingCall.groupCoverUrl || incomingCall.callerProfileImage;
  const displayName = incomingCall.groupName || "Squad Group Call";

  const handleAccept = async () => {
    try {
      const response = await joinCall(incomingCall.callId);
      const participants = (response.data.call.participants || [])
        .filter(
          (participant: { status: string; userId: string }) =>
            participant.status === "JOINED" && participant.userId !== currentUserId,
        )
        .map(
          (participant: {
            status: string;
            userId: string;
            user?: {
              fullName: string;
              avatarUrl: string;
            };
          }) => ({
            userId: participant.userId,
            name: participant.user?.fullName || "Member",
            profileImage: participant.user?.avatarUrl || null,
          }),
        );
      setGroupParticipants(participants);
      setConnecting();
    } catch (error) {
      console.error("[IncomingCallModal] Failed to join group call:", error);
      clearCall();
    }
  };

  const handleDecline = () => {
    clearCall();
  };

  return (
    <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-sm rounded-3xl bg-[#181d1a] border border-white/10 p-6 sm:p-8 shadow-2xl text-white text-center animate-in fade-in zoom-in-95 duration-200">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#0f6e56]">
          Incoming Squad Call
        </p>

        <div className="my-6 sm:my-8 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-[#005440]/30 animate-ping opacity-75" />
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-full bg-[#2d312f] border-2 border-[#005440]">
              {image ? (
                <img src={image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-white/80">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        <h3 className="text-xl font-extrabold text-white truncate">{displayName}</h3>
        <p className="mt-1 text-xs text-white/70">
          <span className="font-semibold text-white/90">{incomingCall.callerName}</span> started a{" "}
          {incomingCall.mediaType === "VIDEO" ? "video" : "voice"} call
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          {/* Decline Button */}
          <button
            type="button"
            onClick={handleDecline}
            aria-label="Decline Call"
            className="flex-1 rounded-2xl bg-[#ba1a1a] hover:bg-[#961313] py-3.5 px-4 text-sm font-bold text-white shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            Decline
          </button>

          {/* Accept Button */}
          <button
            type="button"
            onClick={handleAccept}
            disabled={isJoining}
            aria-label="Join Call"
            className="flex-1 rounded-2xl bg-[#005440] hover:bg-[#0f6e56] py-3.5 px-4 text-sm font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {incomingCall.mediaType === "VIDEO" ? <Video className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
            <span>{isJoining ? "Joining..." : "Join"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
