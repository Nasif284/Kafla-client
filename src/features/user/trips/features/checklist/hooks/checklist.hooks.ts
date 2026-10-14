import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checklistServices } from "../services/checklist.service";
import { EditChecklistTask } from "../interfaces/interface";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiError } from "@/src/types/types";
import { TaskFormData } from "../validators/validator";

export function useGetChecklist(id: string) {
  return useQuery({
    queryKey: ["checklist", id],
    queryFn: () => checklistServices.getChecklist(id),
  });
}
export function useEditTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data:{id:string,taskId:string,data:EditChecklistTask}) => checklistServices.editTask(data.id,data.taskId,data.data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] });
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}
export function useAddTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; data: TaskFormData }) => checklistServices.addTask(data.id, data.data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] });
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}
export function useCompleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; taskId: string }) => checklistServices.completeTask(data.id, data.taskId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] });
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}
export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; taskId: string }) => checklistServices.deleteTask(data.id, data.taskId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] });
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}
