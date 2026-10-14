import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { memberServices } from "../services/members.service";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiError } from "@/src/types/types";
import { useRouter } from "next/navigation";
import { Connection } from "../interfaces/interfaces";

export function useGetMembers(id:string) {
  return useQuery({
    queryKey: ["group_members", id],
    queryFn: () => memberServices.getMembers(id),
    enabled: !!id,
  });
}

export function useAddMembers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data:{id: string,members:string[]}) => memberServices.addMembers(data.id,{members:data.members}),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["group_members"] });
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}
export function useGetInviteCode(id: string) {
  return useQuery({
    queryKey: ["group_invite_code", id],
    queryFn: () => memberServices.getInviteCode(id),
    enabled: !!id,
  });
}
export function useGetInvites(id: string) {
  return useQuery({
    queryKey: ["group_invites", id],
    queryFn: () => memberServices.getInvites(id),
    enabled: !!id,
  });
}

export function useInviteByEmail() {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; email: string }) => memberServices.inviteByEmail(data.id, { email: data.email }),
    onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["group_invites"] });
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}

export function useJoinWithLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteCode: string) => memberServices.joinWithLink(inviteCode),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["active_groups"] });
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}


export function useRemoveMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({groupId,memberId}:{groupId:string,memberId:string}) => memberServices.removeMember(groupId,memberId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["group_members"] });
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}
export function useLeaveGroup() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (groupId :string) => memberServices.leaveGroup(groupId),
    onSuccess: async (res) => {
      await Promise.all([queryClient.invalidateQueries({ queryKey: ["group_members"] }), queryClient.invalidateQueries({ queryKey: ["active_groups"] })]);
      toast.success(res.message);
      router.replace("/trips/groups");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}

export function useChangeMemberRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, memberId }: { groupId: string; memberId: string }) => memberServices.changeRole(groupId, memberId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["group_members"] });
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}

export function useGetConnections() {
  return useQuery({
    queryKey: ["connections"],
    queryFn: async () => ({ data: { connections: [] as Connection[] } }),
  });
}

