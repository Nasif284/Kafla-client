"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  joinCallRoom,
  leaveCallRoom,
  onCallAnswer,
  onCallIceCandidate,
  onCallOffer,
  onCallParticipantJoined,
  onCallParticipantLeft,
} from "@/src/socket/call/call.socket";
import { useAuthStore } from "@/src/store/auth.store";
import { useCallStore } from "@/src/store/call.store";
import { GroupWebRTCManager } from "@/src/webRtc/GroupWebRTCManager";

export function useGroupWebRTC() {
  const managerRef = useRef<GroupWebRTCManager | null>(null);
  const activeCall = useCallStore((state) => state.activeCall);
  const setLocalStream = useCallStore((state) => state.setLocalStream);
  const setRemoteStreamForUser = useCallStore((state) => state.setGroupRemoteStream);
  const removeRemoteStream = useCallStore((state) => state.removeGroupRemoteStream);
  const removeGroupParticipant = useCallStore((state) => state.removeGroupParticipant);
  const setActive = useCallStore((state) => state.setActive);

  const currentUserId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    if (!activeCall || !currentUserId) {
      return;
    }

    console.log("[GroupWebRTC] Creating manager:", activeCall.callId);
    joinCallRoom(activeCall.callId);

    const manager = new GroupWebRTCManager({
      callId: activeCall.callId,
      currentUserId,
      mediaType: activeCall.mediaType,

      onRemoteStream: (userId, stream) => {
        console.log("[GroupWebRTC] Remote stream received:", userId);
        setRemoteStreamForUser(userId, stream);
        setActive();
      },

      onRemoteStreamRemoved: (userId) => {
        console.log("[GroupWebRTC] Remote stream removed:", userId);
        removeRemoteStream(userId);
      },
    });

    managerRef.current = manager;

    return () => {
      console.log("[GroupWebRTC] Destroying manager:", activeCall.callId);
      leaveCallRoom(activeCall.callId);
      manager.cleanup();
      managerRef.current = null;
    };
  }, [
    activeCall?.callId,
    activeCall?.mediaType,
    currentUserId,
    setRemoteStreamForUser,
    removeRemoteStream,
    setActive,
  ]);

  const getManager = useCallback(() => {
    return managerRef.current;
  }, []);

  const initialize = useCallback(async () => {
    if (!activeCall) {
      return null;
    }

    const manager = getManager();
    if (!manager) {
      console.warn("[GroupWebRTC] Manager is not ready");
      return null;
    }

    const stream = await manager.initializeLocalStream();
    setLocalStream(stream);
    console.log("[GroupWebRTC] Local media initialized");
    return stream;
  }, [activeCall?.callId, getManager, setLocalStream]);

  useEffect(() => {
    const cleanup = onCallOffer(async (data) => {
      if (!activeCall || data.callId !== activeCall.callId) {
        return;
      }

      const manager = getManager();
      if (!manager) {
        console.warn("[GroupWebRTC] Manager unavailable for offer");
        return;
      }

      try {
        if (!manager.getLocalStream()) {
          await initialize();
        }

        console.log(`[GroupWebRTC] Handling offer from ${data.senderUserId}`);
        await manager.handleOffer(data.senderUserId, data.offer);
      } catch (error) {
        console.error("[GroupWebRTC] Offer error:", error);
      }
    });

    return cleanup;
  }, [activeCall?.callId, getManager, initialize]);

  useEffect(() => {
    const cleanup = onCallAnswer(async (data) => {
      if (!activeCall || data.callId !== activeCall.callId) {
        return;
      }

      const manager = getManager();
      if (!manager) {
        console.warn("[GroupWebRTC] Manager unavailable for answer");
        return;
      }

      try {
        console.log(`[GroupWebRTC] Handling answer from ${data.senderUserId}`);
        await manager.handleAnswer(data.senderUserId, data.answer);
      } catch (error) {
        console.error("[GroupWebRTC] Answer error:", error);
      }
    });

    return cleanup;
  }, [activeCall?.callId, getManager]);

  useEffect(() => {
    const cleanup = onCallIceCandidate(async (data) => {
      if (!activeCall || data.callId !== activeCall.callId) {
        return;
      }

      const manager = getManager();
      if (!manager) {
        console.warn("[GroupWebRTC] Manager unavailable for ICE");
        return;
      }

      try {
        await manager.handleIceCandidate(data.senderUserId, data.candidate);
      } catch (error) {
        console.error("[GroupWebRTC] ICE error:", error);
      }
    });

    return cleanup;
  }, [activeCall?.callId, getManager]);

  useEffect(() => {
    const cleanup = onCallParticipantJoined(async (data) => {
      if (!activeCall || data.callId !== activeCall.callId || !currentUserId) {
        return;
      }
      const remoteUserId = data.userId;

      if (remoteUserId === currentUserId) {
        return;
      }

      const manager = getManager();
      if (!manager) {
        console.warn("[GroupWebRTC] Manager unavailable when participant joined");
        return;
      }

      if (currentUserId >= remoteUserId) {
        return;
      }

      try {
        console.log(`[GroupWebRTC] Creating offer for ${remoteUserId}`);
        if (!manager.getLocalStream()) {
          await initialize();
        }

        await manager.createOffer(remoteUserId);
      } catch (error) {
        console.error(`[GroupWebRTC] Failed to create offer for ${remoteUserId}:`, error);
      }
    });

    return cleanup;
  }, [activeCall?.callId, currentUserId, getManager, initialize]);

  const connectToParticipants = useCallback(
    async (userIds: string[]) => {
      if (!activeCall) {
        return;
      }

      const manager = getManager();
      if (!manager) {
        console.warn("[GroupWebRTC] Manager unavailable while connecting participants");
        return;
      }

      if (!manager.getLocalStream()) {
        const stream = await manager.initializeLocalStream();
        setLocalStream(stream);
      }

      await manager.connectToParticipants(userIds);
    },
    [activeCall?.callId, getManager, setLocalStream],
  );

  useEffect(() => {
    const cleanup = onCallParticipantLeft((data) => {
      if (!activeCall || data.callId !== activeCall.callId) {
        return;
      }

      if (data.userId === currentUserId) {
        return;
      }

      console.log(`[GroupWebRTC] Participant left: ${data.userId}`);
      const manager = getManager();
      if (manager) {
        manager.removePeer(data.userId);
      }

      removeRemoteStream(data.userId);
      removeGroupParticipant(data.userId);
    });

    return cleanup;
  }, [activeCall?.callId, currentUserId, getManager, removeRemoteStream, removeGroupParticipant]);

  return {
    initialize,
    connectToParticipants,
  };
}
