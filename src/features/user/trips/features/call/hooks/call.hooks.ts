import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { groupCallService } from "../services/call.service";
import { ApiError } from "@/src/types/types";
import { CallMediaType } from "../interfaces/call.interfaces";

export function useCreateGroupCall() {
  return useMutation({
    mutationFn: (data: { tripGroupId: string; mediaType: CallMediaType }) =>
      groupCallService.createGroupCall(data),
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Unable to start the group call.");
    },
  });
}

export function useJoinCall() {
  return useMutation({
    mutationFn: (callId: string) => groupCallService.joinCall(callId),
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Unable to join the call.");
    },
  });
}

export function useLeaveCall() {
  return useMutation({
    mutationFn: (callId: string) => groupCallService.leaveCall(callId),
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Unable to leave the call.");
    },
  });
}
