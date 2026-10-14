"use client";

import { useCallStore } from "@/src/store/call.store";
import OutgoingCallModal from "./OutgoingCallModal";
import IncomingCallModal from "./IncomingCallModal";
import ActiveGroupCallModal from "./ActiveGroupCallModal";

export default function CallModals() {
  const status = useCallStore((state) => state.status);
  const activeCall = useCallStore((state) => state.activeCall);

  if (status === "OUTGOING") {
    return <OutgoingCallModal />;
  }

  if (status === "INCOMING") {
    return <IncomingCallModal />;
  }

  if ((status === "CONNECTING" || status === "ACTIVE") && activeCall) {
    return <ActiveGroupCallModal />;
  }

  return null;
}
