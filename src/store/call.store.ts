import { create } from "zustand";
import {
  ActiveCall,
  CallMediaType,
  CallStatus,
  GroupCallIncoming,
  GroupCallParticipant,
} from "@/src/features/user/trips/features/call/interfaces/call.interfaces";

export type { CallStatus, CallMediaType, GroupCallParticipant, GroupCallIncoming, ActiveCall };

interface CallState {
  status: CallStatus;
  activeCall: ActiveCall | null;
  incomingCall: GroupCallIncoming | null;

  localStream: MediaStream | null;
  groupRemoteStreams: Record<string, MediaStream>;
  groupParticipants: GroupCallParticipant[];

  isMuted: boolean;
  isCameraOn: boolean;

  setOutgoingCall: (call: ActiveCall) => void;
  setIncomingCall: (call: GroupCallIncoming) => void;
  clearIncomingCall: () => void;

  setConnecting: () => void;
  setActive: () => void;
  setEnding: () => void;

  setLocalStream: (stream: MediaStream | null) => void;
  setGroupRemoteStream: (userId: string, stream: MediaStream) => void;
  removeGroupRemoteStream: (userId: string) => void;
  clearGroupRemoteStreams: () => void;

  setMuted: (muted: boolean) => void;
  setCameraOn: (enabled: boolean) => void;

  setGroupParticipants: (participants: GroupCallParticipant[]) => void;
  removeGroupParticipant: (userId: string) => void;

  clearCall: () => void;
}

export const useCallStore = create<CallState>((set) => ({
  status: "IDLE",
  activeCall: null,
  incomingCall: null,
  localStream: null,
  groupRemoteStreams: {},
  groupParticipants: [],
  isMuted: false,
  isCameraOn: false,

  setOutgoingCall: (call) =>
    set({
      status: "OUTGOING",
      activeCall: call,
      incomingCall: null,
      isMuted: false,
      isCameraOn: call.mediaType === "VIDEO",
    }),

  setIncomingCall: (call) =>
    set({
      status: "INCOMING",
      incomingCall: call,
      isMuted: false,
      isCameraOn: call.mediaType === "VIDEO",
      activeCall: {
        callId: call.callId,
        mediaType: call.mediaType,
        callerId: call.callerId,
        tripGroupId: call.tripGroupId,
        groupName: call.groupName,
        groupCoverUrl: call.groupCoverUrl,
        scope: "TRIP_GROUP",
      },
    }),

  clearIncomingCall: () =>
    set({
      incomingCall: null,
    }),

  setConnecting: () =>
    set({
      status: "CONNECTING",
    }),

  setActive: () =>
    set({
      status: "ACTIVE",
    }),

  setEnding: () =>
    set({
      status: "ENDING",
    }),

  setLocalStream: (stream) =>
    set({
      localStream: stream,
    }),

  setMuted: (muted) =>
    set({
      isMuted: muted,
    }),

  setGroupRemoteStream: (userId, stream) =>
    set((state) => ({
      groupRemoteStreams: {
        ...state.groupRemoteStreams,
        [userId]: stream,
      },
    })),

  removeGroupRemoteStream: (userId) =>
    set((state) => {
      const streams = {
        ...state.groupRemoteStreams,
      };
      delete streams[userId];
      return {
        groupRemoteStreams: streams,
      };
    }),

  clearGroupRemoteStreams: () =>
    set({
      groupRemoteStreams: {},
    }),

  setCameraOn: (enabled) =>
    set({
      isCameraOn: enabled,
    }),

  setGroupParticipants: (participants) =>
    set({
      groupParticipants: participants,
    }),

  removeGroupParticipant: (userId) =>
    set((state) => ({
      groupParticipants: state.groupParticipants.filter((participant) => participant.userId !== userId),
    })),

  clearCall: () =>
    set((state) => {
      if (state.localStream) {
        state.localStream.getTracks().forEach((track) => {
          track.stop();
        });
      }

      Object.values(state.groupRemoteStreams).forEach((stream) => {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      });

      return {
        status: "IDLE",
        activeCall: null,
        incomingCall: null,
        localStream: null,
        groupRemoteStreams: {},
        groupParticipants: [],
        isMuted: false,
        isCameraOn: false,
      };
    }),
}));
