export type CallMediaType = "AUDIO" | "VIDEO";
export type CallStatus = "IDLE" | "OUTGOING" | "INCOMING" | "CONNECTING" | "ACTIVE" | "ENDING";

export interface GroupCallParticipant {
  userId: string;
  name: string;
  profileImage?: string | null;
}

export interface GroupCallIncoming {
  callId: string;
  callerId: string;
  callerName: string;
  callerProfileImage: string | null;
  tripGroupId: string;
  groupName: string;
  groupCoverUrl: string | null;
  mediaType: CallMediaType;
  scope?: "TRIP_GROUP";
}

export interface ActiveCall {
  callId: string;
  mediaType: CallMediaType;
  callerId: string;
  tripGroupId: string;
  groupName?: string;
  groupCoverUrl?: string | null;
  scope?: "TRIP_GROUP";
}

export interface CallParticipantJoined {
  callId: string;
  userId: string;
  name: string;
  profileImage: string | null;
}

export interface CallParticipantLeft {
  callId: string;
  userId: string;
}

export interface CallError {
  message: string;
}

export interface CallEnded {
  callId: string;
}

export interface CallOffer {
  callId: string;
  senderUserId: string;
  offer: RTCSessionDescriptionInit;
}

export interface CallAnswer {
  callId: string;
  senderUserId: string;
  answer: RTCSessionDescriptionInit;
}

export interface CallIceCandidate {
  callId: string;
  senderUserId: string;
  candidate: RTCIceCandidateInit;
}
