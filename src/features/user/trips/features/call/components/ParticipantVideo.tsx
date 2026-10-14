"use client";

import { useEffect, useRef } from "react";

interface ParticipantVideoProps {
  stream: MediaStream | null;
  name: string;
  isMuted?: boolean;
  isCameraOn?: boolean;
  isLocal?: boolean;
}

export default function ParticipantVideo({
  stream,
  name,
  isMuted = false,
  isCameraOn = true,
  isLocal = false,
}: ParticipantVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const hasVideo = stream?.getVideoTracks().some((track) => track.readyState === "live" && track.enabled) ?? false;
  const hasAudio = stream?.getAudioTracks().some((track) => track.readyState === "live" && track.enabled) ?? false;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = stream;
    return () => {
      video.srcObject = null;
    };
  }, [stream]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.srcObject = stream;
    return () => {
      audio.srcObject = null;
    };
  }, [stream]);

  const initial = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative aspect-video sm:aspect-auto h-full w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-[#161c19] border border-white/10 shadow-xl flex items-center justify-center group">
      {/* Video Stream Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          hasVideo && isCameraOn ? "opacity-100" : "opacity-0 absolute pointer-events-none"
        }`}
      />

      {/* Avatar when Camera is Disabled */}
      {(!hasVideo || !isCameraOn) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1c2621] via-[#121815] to-[#090c0a] p-4 text-center">
          <div className="relative mb-3">
            <div className="absolute -inset-2 rounded-full bg-[#005440]/30 animate-pulse" />
            <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-[#24302a] border-2 border-[#005440] text-2xl sm:text-3xl font-extrabold text-white shadow-xl">
              {initial}
            </div>
          </div>
          <span className="text-xs sm:text-sm font-bold text-white/90 truncate max-w-[80%] font-headline">{name}</span>
        </div>
      )}

      {/* Name Tag Overlay */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl bg-black/60 px-3 py-1.5 backdrop-blur-md border border-white/10 text-white z-10">
        <span className="text-xs font-semibold max-w-[120px] sm:max-w-[160px] truncate">
          {name} {isLocal && "(You)"}
        </span>
        {isMuted && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#ba1a1a]/80 text-[10px]">
            🔇
          </span>
        )}
      </div>

      {/* Audio Indicator */}
      {hasAudio && !isMuted && (
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0f6e56] animate-ping" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#0f6e56]" />
        </div>
      )}
    </div>
  );
}
