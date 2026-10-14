import { sendCallAnswer, sendCallIceCandidate, sendCallOffer } from "@/src/socket/call/call.socket";

import type { CallMediaType } from "@/src/store/call.store";

interface GroupWebRTCManagerOptions {
  callId: string;
  currentUserId: string;
  mediaType: CallMediaType;
  onRemoteStream: (userId: string, stream: MediaStream) => void;
  onRemoteStreamRemoved?: (userId: string) => void;
}

export class GroupWebRTCManager {
  private readonly peers = new Map<string, RTCPeerConnection>();

  private localStream: MediaStream | null = null;

  private readonly callId: string;
  private readonly currentUserId: string;
  private readonly mediaType: CallMediaType;

  private readonly onRemoteStream: (userId: string, stream: MediaStream) => void;

  private readonly onRemoteStreamRemoved?: (userId: string) => void;

  constructor(options: GroupWebRTCManagerOptions) {
    this.callId = options.callId;
    this.currentUserId = options.currentUserId;
    this.mediaType = options.mediaType;
    this.onRemoteStream = options.onRemoteStream;
    this.onRemoteStreamRemoved = options.onRemoteStreamRemoved;
  }

  async initializeLocalStream(): Promise<MediaStream> {
    if (this.localStream) {
      return this.localStream;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: this.mediaType === "VIDEO",
    });

    this.localStream = stream;

    console.log("[GroupWebRTC] Local stream initialized");

    return stream;
  }

  private createPeer(remoteUserId: string): RTCPeerConnection {
    const existingPeer = this.peers.get(remoteUserId);

    if (existingPeer) {
      return existingPeer;
    }

    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        peer.addTrack(track, this.localStream!);
      });
    }

    peer.onicecandidate = (event) => {
      if (!event.candidate) {
        return;
      }

      sendCallIceCandidate(this.callId, remoteUserId, event.candidate.toJSON());
    };

    peer.ontrack = (event) => {
      const [stream] = event.streams;

      if (!stream) {
        return;
      }
      console.log(`[GroupWebRTC] Remote stream received from ${remoteUserId}`);
      this.onRemoteStream(remoteUserId, stream);
    };

    peer.onconnectionstatechange = () => {
      console.log(`[GroupWebRTC] ${remoteUserId} connection:`, peer.connectionState);

      if (peer.connectionState === "failed" || peer.connectionState === "closed") {
        this.removePeer(remoteUserId);
      }
    };
    peer.oniceconnectionstatechange = () => {
      console.log(`[GroupWebRTC] ${remoteUserId} ICE:`, peer.iceConnectionState);
    };

    this.peers.set(remoteUserId, peer);
    return peer;
  }

  async createOffer(remoteUserId: string): Promise<void> {
    const peer = this.createPeer(remoteUserId);

    // Do not create another offer while this peer is already negotiating.
    if (peer.signalingState !== "stable") {
      console.warn(`[GroupWebRTC] Cannot create offer for ${remoteUserId}. ` + `Signaling state: ${peer.signalingState}`);
      return;
    }
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    console.log(`[GroupWebRTC] Sending offer ${this.currentUserId} -> ${remoteUserId}`);
    sendCallOffer(this.callId, remoteUserId, peer.localDescription ?? offer);
  }

  async handleOffer(remoteUserId: string, offer: RTCSessionDescriptionInit): Promise<void> {
    const peer = this.createPeer(remoteUserId);

    console.log(`[GroupWebRTC] Received offer from ${remoteUserId}`, {
      signalingState: peer.signalingState,
    });

    if (peer.signalingState !== "stable") {
      console.warn(`[GroupWebRTC] Ignoring offer from ${remoteUserId}. ` + `Current state: ${peer.signalingState}`);
      return;
    }

    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    console.log(`[GroupWebRTC] Sending answer ${this.currentUserId} -> ${remoteUserId}`);
    sendCallAnswer(this.callId, remoteUserId, peer.localDescription ?? answer);
  }

  async handleAnswer(remoteUserId: string, answer: RTCSessionDescriptionInit): Promise<void> {
    const peer = this.peers.get(remoteUserId);

    if (!peer) {
      console.warn(`[GroupWebRTC] No peer for ${remoteUserId}`);
      return;
    }

    console.log(`[GroupWebRTC] Received answer from ${remoteUserId}`, {
      signalingState: peer.signalingState,
    });

    if (peer.signalingState !== "have-local-offer") {
      console.warn(`[GroupWebRTC] Ignoring answer from ${remoteUserId}. ` + `Current state: ${peer.signalingState}`);
      return;
    }

    await peer.setRemoteDescription(new RTCSessionDescription(answer));
    console.log(`[GroupWebRTC] Answer applied from ${remoteUserId}`);
  }

  async handleIceCandidate(remoteUserId: string, candidate: RTCIceCandidateInit): Promise<void> {
    const peer = this.peers.get(remoteUserId);

    if (!peer) {
      console.warn(`[GroupWebRTC] No peer for ICE candidate from ${remoteUserId}`);
      return;
    }

    await peer.addIceCandidate(new RTCIceCandidate(candidate));
  }

  removePeer(remoteUserId: string): void {
    const peer = this.peers.get(remoteUserId);
    if (!peer) {
      return;
    }
    console.log(`[GroupWebRTC] Removing peer ${remoteUserId}`);
    peer.close();
    this.peers.delete(remoteUserId);
    this.onRemoteStreamRemoved?.(remoteUserId);
  }
  async connectToParticipants(userIds: string[]) {
    if (!this.localStream) {
      await this.initializeLocalStream();
    }

    for (const userId of userIds) {
      if (userId === this.currentUserId) {
        continue;
      }

      if (this.peers.has(userId)) {
        continue;
      }
      if (this.currentUserId > userId) {
        console.log(`[GroupWebRTC] Waiting for ${userId} to offer`);
        continue;
      }

      console.log(`[GroupWebRTC] Creating offer ${this.currentUserId} -> ${userId}`);

      await this.createOffer(userId);
    }
  }

  getPeer(remoteUserId: string): RTCPeerConnection | undefined {
    return this.peers.get(remoteUserId);
  }

  getPeers(): Map<string, RTCPeerConnection> {
    return this.peers;
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  cleanup(): void {
    console.log("[GroupWebRTC] Cleaning up");

    for (const peer of this.peers.values()) {
      peer.close();
    }

    this.peers.clear();

    this.localStream?.getTracks().forEach((track) => track.stop());

    this.localStream = null;
  }
}
