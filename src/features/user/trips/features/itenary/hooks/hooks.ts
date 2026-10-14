import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateItineraryActivityRequestDTO, CreateItineraryDayRequestDTO } from "../interfaces/interfaces";
import { itineraryServices } from "../services/services";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiError } from "@/src/types/types";
import { GenerateAiItineraryRequestDTO, GeneratedItinerary } from "../components/AiItineraryModal";

export function useCreateItineraryDay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateItineraryDayRequestDTO }) => itineraryServices.addDay(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["group_itinerary"] });
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}

export function useSetupItinerary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => itineraryServices.setupItinerary(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["group_itinerary"] });
      toast.success(res.message || "Itinerary days initialized");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Failed to initialize itinerary");
    },
  });
}

export function useGetItinerary(id: string) {
  return useQuery({
    queryKey: ["group_itinerary", id],
    queryFn: () => itineraryServices.getItinerary(id),
    enabled: !!id,
  });
}

export function useUpdateItineraryDay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dayId, data }: { id: string; dayId: string; data: CreateItineraryDayRequestDTO }) => itineraryServices.editDay(id, dayId, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["group_itinerary"] });
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}

export function useDeleteItineraryDay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dayId }: { id: string; dayId: string;}) => itineraryServices.deleteDay(id, dayId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["group_itinerary"] });
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}

export function useAddItineraryActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dayId, data }: { id: string; dayId: string; data: CreateItineraryActivityRequestDTO }) => itineraryServices.addActivity(id, dayId, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["group_itinerary"] });
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}


export function useUpdateItineraryActivity() {
  const queryClient = useQueryClient();
  return useMutation({
      mutationFn: ({ id, dayId, data,activityId }: { id: string; dayId: string; activityId: string; data: CreateItineraryActivityRequestDTO }) => itineraryServices.editActivity(id, dayId,activityId, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["group_itinerary"] });
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}

export function useDeleteItineraryActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dayId, activityId }: { id: string; dayId: string; activityId: string;}) => itineraryServices.deleteActivity(id, dayId, activityId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["group_itinerary"] });
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}

export function useToggleItineraryActivityCompletion() {
  const queryClient = useQueryClient();
  return useMutation({
      mutationFn: ({ id, dayId, activityId, }: { id: string; dayId: string; activityId: string }) => itineraryServices.toggleComplete(id, dayId, activityId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["group_itinerary"] });
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}

export function useAiItineraryGenerate() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: GenerateAiItineraryRequestDTO }) => itineraryServices.aiGenerate(id, data),
    onSuccess: (res) => {
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}
export function useSaveGenerated() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: GeneratedItinerary }) => itineraryServices.saveGenerated(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["group_itinerary"] });
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}

export function useSwapActivity() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => itineraryServices.swapActivity(id, data),
    onSuccess: (res) => {
      toast.success(res.message || "Activity swapped");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Failed to swap activity");
    },
  });
}

export function useRegenerateDay() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => itineraryServices.regenerateDay(id, data),
    onSuccess: (res) => {
      toast.success(res.message || "Day regenerated");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Failed to regenerate day");
    },
  });
}

export function useSwapDays() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, data }: { groupId: string; data: { dayIdA: string; dayIdB: string } }) =>
      itineraryServices.swapDays(groupId, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["group_itinerary", variables.groupId] });
      toast.success(res.message || "Days swapped successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Failed to swap days");
    },
  });
}





