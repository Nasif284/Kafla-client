"use client";

import { useCallStore } from "@/src/store/call.store";
import ParticipantVideo from "./ParticipantVideo";
import { useLeaveCall } from "../hooks/call.hooks";

export default function ActiveGroupCallModal() {
  const status = useCallStore((state) => state.status);
  const activeCall = useCallStore((state) => state.activeCall);

  const localStream = useCallStore((state) => state.localStream);
  const remoteStreams = useCallStore((state) => state.groupRemoteStreams);
  const groupParticipants = useCallStore((state) => state.groupParticipants);

  const isMuted = useCallStore((state) => state.isMuted);
  const isCameraOn = useCallStore((state) => state.isCameraOn);
  const setMuted = useCallStore((state) => state.setMuted);
  const setCameraOn = useCallStore((state) => state.setCameraOn);

  const toggleMute = () => {
    if (!localStream) return;
    const nextMuted = !isMuted;
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !nextMuted;
    });
    setMuted(nextMuted);
  };

  const toggleCamera = () => {
    if (!localStream) return;
    const nextCameraOn = !isCameraOn;
    localStream.getVideoTracks().forEach((track) => {
      track.enabled = nextCameraOn;
    });
    setCameraOn(nextCameraOn);
  };

  const leaveCall = useLeaveCall();

  const handleLeave = async () => {
    if (!activeCall) return;
    try {
      await leaveCall.mutateAsync(activeCall.callId);
      useCallStore.getState().clearCall();
    } catch (error) {
      console.error("[GroupCall] Failed to leave:", error);
    }
  };

  if (!activeCall || (status !== "CONNECTING" && status !== "ACTIVE")) {
    return null;
  }

  const remoteUsers = Object.entries(remoteStreams);
  const totalCount = remoteUsers.length + 1;

  return (
    <div className="fixed inset-0 z-[1500] bg-[#0c100e] text-white flex flex-col justify-between overflow-hidden animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          {activeCall.groupCoverUrl ? (
            <img
              src={activeCall.groupCoverUrl}
              alt=""
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl object-cover border border-white/20 shadow-md"
            />
          ) : (
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-[#005440] text-white font-extrabold text-sm sm:text-base border border-white/20 shadow-md">
              {activeCall.groupName?.charAt(0) || "G"}
            </div>
          )}
          <div>
            <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-white font-headline">
              {activeCall.groupName || "Squad Conference"}
            </h2>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#87d9b9]">
              <span className="flex h-2 w-2 rounded-full bg-[#005440] animate-pulse" />
              <span>
                {status === "CONNECTING" ? "Connecting to squad..." : `${totalCount} Members Active`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Video Grid */}
      <div className="flex-1 w-full h-full p-4 sm:p-8 pt-20 sm:pt-24 pb-28 sm:pb-32 overflow-y-auto flex items-center justify-center">
        <div
          className={`grid w-full h-full gap-3 sm:gap-4 max-h-[85vh] ${
            totalCount === 1
              ? "grid-cols-1 max-w-2xl max-h-[70vh]"
              : totalCount === 2
                ? "grid-cols-1 sm:grid-cols-2 max-w-4xl"
                : totalCount <= 4
                  ? "grid-cols-1 sm:grid-cols-2 max-w-5xl"
                  : "grid-cols-2 sm:grid-cols-3 max-w-6xl"
          }`}
        >
          {/* Local User Stream */}
          <ParticipantVideo
            stream={localStream}
            name="You"
            isMuted={isMuted}
            isCameraOn={isCameraOn}
            isLocal={true}
          />

          {/* Remote Participants Streams */}
          {remoteUsers.map(([userId, stream]) => {
            const participant = groupParticipants.find((p) => p.userId === userId);
            const name = participant?.name || "Squad Member";
            return (
              <ParticipantVideo
                key={userId}
                stream={stream}
                name={name}
                isMuted={false}
                isCameraOn={true}
                isLocal={false}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 flex items-center justify-center z-40 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-3 sm:gap-4 rounded-3xl bg-[#1c2420]/80 p-2 sm:p-3 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-auto">
          {/* Mute/Unmute Mic */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute Microphone" : "Mute Microphone"}
            className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl transition-all active:scale-95 cursor-pointer ${
              isMuted
                ? "bg-[#ba1a1a] text-white hover:bg-[#961313]"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {isMuted ? "🔇" : "🎙️"}
          </button>

          {/* Camera Toggle */}
          <button
            type="button"
            onClick={toggleCamera}
            aria-label={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
            className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl transition-all active:scale-95 cursor-pointer ${
              !isCameraOn
                ? "bg-[#ba1a1a] text-white hover:bg-[#961313]"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {isCameraOn ? "📹" : "🚫"}
          </button>

          <div className="h-8 w-px bg-white/15 my-auto" />

          {/* Leave Call Button */}
          <button
            type="button"
            onClick={handleLeave}
            disabled={leaveCall.isPending}
            className="flex items-center gap-2 rounded-2xl bg-[#ba1a1a] hover:bg-[#961313] px-5 sm:px-6 h-12 sm:h-14 text-sm sm:text-base font-extrabold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <span>Disconnect</span>
          </button>
        </div>
      </div>
    </div>
  );
}
