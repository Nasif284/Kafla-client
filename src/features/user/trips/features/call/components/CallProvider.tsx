"use client";

import { useEffect } from "react";
import {
  onCallEnded,
  onCallParticipantJoined,
  onCallParticipantLeft,
  onGroupCallIncoming,
} from "@/src/socket/call/call.socket";
import { useCallStore } from "@/src/store/call.store";
import GroupWebRTCController from "./GroupWebRTCController";
import CallModals from "./CallModals";

export default function CallProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const cleanupGroupIncoming = onGroupCallIncoming((call) => {
      console.log("[CallProvider] Group incoming call received:", call);
      useCallStore.getState().setIncomingCall(call);
    });

    const cleanupParticipantJoined = onCallParticipantJoined((data) => {
      console.log("[CallProvider] Participant joined call:", data);
      const state = useCallStore.getState();

      if (state.activeCall?.callId !== data.callId) {
        return;
      }

      state.setConnecting();

      const existingParticipant = state.groupParticipants.some(
        (participant) => participant.userId === data.userId,
      );

      if (!existingParticipant) {
        state.setGroupParticipants([
          ...state.groupParticipants,
          {
            userId: data.userId,
            name: data.name,
            profileImage: data.profileImage,
          },
        ]);
      }
    });

    const cleanupParticipantLeft = onCallParticipantLeft((data) => {
      console.log("[CallProvider] Participant left call:", data);
      const state = useCallStore.getState();

      if (state.activeCall?.callId !== data.callId) {
        return;
      }

      state.removeGroupParticipant(data.userId);
      state.removeGroupRemoteStream(data.userId);
    });

    const cleanupEnded = onCallEnded((data) => {
      console.log("[CallProvider] Call ended:", data);
      const state = useCallStore.getState();

      if (state.activeCall?.callId === data.callId) {
        state.clearCall();
      }
    });

    return () => {
      cleanupGroupIncoming();
      cleanupParticipantJoined();
      cleanupParticipantLeft();
      cleanupEnded();
    };
  }, []);

  return (
    <>
      <GroupWebRTCController />
      {children}
      <CallModals />
    </>
  );
}
