import { getSocket } from "../socket";
import {
  CallAnswer,
  CallEnded,
  CallError,
  CallIceCandidate,
  CallOffer,
  CallParticipantJoined,
  CallParticipantLeft,
  GroupCallIncoming,
} from "@/src/features/user/trips/features/call/interfaces/call.interfaces";

export function onGroupCallIncoming(callback: (call: GroupCallIncoming) => void) {
  const socket = getSocket();
  socket.on("call:group-incoming", callback);
  return () => {
    socket.off("call:group-incoming", callback);
  };
}

export function onCallParticipantJoined(callback: (data: CallParticipantJoined) => void) {
  const socket = getSocket();
  socket.on("call:participant-joined", callback);
  return () => {
    socket.off("call:participant-joined", callback);
  };
}

export function onCallParticipantLeft(callback: (data: CallParticipantLeft) => void) {
  const socket = getSocket();
  socket.on("call:participant-left", callback);
  return () => {
    socket.off("call:participant-left", callback);
  };
}

export function onCallEnded(callback: (data: CallEnded) => void) {
  const socket = getSocket();
  socket.on("call:ended", callback);
  return () => {
    socket.off("call:ended", callback);
  };
}

export function onCallRoomJoined(callback: (data: { callId: string }) => void) {
  const socket = getSocket();
  socket.on("call:room-joined", callback);
  return () => {
    socket.off("call:room-joined", callback);
  };
}

export function onCallError(callback: (data: { message: string }) => void) {
  const socket = getSocket();
  socket.on("call:error", callback);
  return () => {
    socket.off("call:error", callback);
  };
}

export function joinCallRoom(callId: string) {
  const socket = getSocket();
  socket.emit("call:join-room", callId);
}

export function leaveCallRoom(callId: string) {
  const socket = getSocket();
  socket.emit("call:leave-room", callId);
}

export function onCallOffer(callback: (data: CallOffer) => void) {
  const socket = getSocket();
  socket.on("call:offer", callback);
  return () => {
    socket.off("call:offer", callback);
  };
}

export function onCallAnswer(callback: (data: CallAnswer) => void) {
  const socket = getSocket();
  socket.on("call:answer", callback);
  return () => {
    socket.off("call:answer", callback);
  };
}

export function onCallIceCandidate(callback: (data: CallIceCandidate) => void) {
  const socket = getSocket();
  socket.on("call:ice-candidate", callback);
  return () => {
    socket.off("call:ice-candidate", callback);
  };
}

export function sendCallOffer(callId: string, targetUserId: string, offer: RTCSessionDescriptionInit) {
  getSocket().emit("call:offer", {
    callId,
    targetUserId,
    offer,
  });
}

export function sendCallAnswer(callId: string, targetUserId: string, answer: RTCSessionDescriptionInit) {
  getSocket().emit("call:answer", {
    callId,
    targetUserId,
    answer,
  });
}

export function sendCallIceCandidate(callId: string, targetUserId: string, candidate: RTCIceCandidateInit) {
  getSocket().emit("call:ice-candidate", {
    callId,
    targetUserId,
    candidate,
  });
}