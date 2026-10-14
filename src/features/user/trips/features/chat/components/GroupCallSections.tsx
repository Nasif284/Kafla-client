"use client";

import HeaderAction from "./HeaderAction";
import { Phone, Video } from "lucide-react";
import { useCreateGroupCall } from "@/src/features/user/trips/features/call/hooks/call.hooks";
import { useCallStore } from "@/src/store/call.store";

const GroupCallSections = ({ groupId, groupName, groupCoverUrl }: { groupId: string; groupName: string; groupCoverUrl?: string }) => {
  const createGroupCall = useCreateGroupCall();

  const setOutgoingCall = useCallStore((state) => state.setOutgoingCall);

  const handleCall = (mediaType: "AUDIO" | "VIDEO") => {
    if (createGroupCall.isPending) {
      return;
    }

    createGroupCall.mutate(
      {
        tripGroupId: groupId,
        mediaType,
      },
      {
        onSuccess: (response) => {
          const call = response.data.call;

          setOutgoingCall({
            callId: call.id,
            scope: "TRIP_GROUP",
            mediaType: call.mediaType,
            callerId: call.callerId,
            tripGroupId: call.tripGroupId,

            groupName: call.groupName,
            groupCoverUrl: call.groupCoverUrl,
          });
        },
      },
    );
  };

  return (
    <>
      <HeaderAction label="Start voice call" onClick={() => handleCall("AUDIO")}>
        <Phone className="h-5 w-5" />
      </HeaderAction>

      <HeaderAction label="Start video call" onClick={() => handleCall("VIDEO")}>
        <Video className="h-5 w-5" />
      </HeaderAction>
    </>
  );
};

export default GroupCallSections;
