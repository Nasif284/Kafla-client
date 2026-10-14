import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { tripServices } from "@/src/features/user/trips/services/trip.service";
import { CreateGroupPayload, UpdateGroupPayload } from "../interfaces/interface";
import { ApiError } from "@/src/types/types";

export function useGetActiveGroups() {
  return useQuery({
    queryKey: ["active_groups"],
    queryFn: () => tripServices.getActiveGroups(),
  });
}

export function useGetPastGroups() {
  return useQuery({
    queryKey: ["past_groups"],
    queryFn: () => tripServices.getPastGroups(),
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGroupPayload) => tripServices.createGroup(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["active_groups"] });
      queryClient.invalidateQueries({ queryKey: ["past_groups"] });
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}

export function useUpdateTripGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGroupPayload }) =>
      tripServices.updateGroup(id, payload),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["active_groups"] });
      queryClient.invalidateQueries({ queryKey: ["past_groups"] });
      queryClient.invalidateQueries({ queryKey: ["group", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["group_itinerary", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["trip_weather", variables.id] });
      toast.success(res.message || "Trip updated successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Failed to update trip");
    },
  });
}

export function useDeleteTripGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tripServices.deleteGroup(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["active_groups"] });
      queryClient.invalidateQueries({ queryKey: ["past_groups"] });
      toast.success(res.message || "Trip deleted successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Failed to delete trip");
    },
  });
}

export function useGetGroup(id: string) {
  return useQuery({
    queryKey: ["group", id],
    queryFn: () => tripServices.getGroup(id),
    enabled: !!id,
  });
}

export function useGetWeather(id: string) {
  return useQuery({
    queryKey: ["trip_weather", id],
    queryFn: () => tripServices.getWeather(id),
    enabled: !!id,
  });
}