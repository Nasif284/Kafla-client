import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { expenseServices } from "../services/services";
import { CreateExpenseRequestDTO } from "../interface/interface";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiError } from "@/src/types/types";

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateExpenseRequestDTO }) => expenseServices.createExpense(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["group_expenses"] });
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}
export function useUpdateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, expenseId, data }: { id: string; expenseId: string; data: CreateExpenseRequestDTO }) => expenseServices.updateExpense(id, expenseId, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["group_expenses"] });
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}
export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, expenseId }: { id: string; expenseId: string;  }) => expenseServices.deleteExpense(id, expenseId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["group_expenses"] });
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}
export function useGetExpenses(id: string) {
  return useQuery({
    queryKey: ["group_expenses", id],
    queryFn: () => expenseServices.getExpenses(id),
    enabled: !!id,
  });
}

export function useGetSummary(id: string) {
  return useQuery({
    queryKey: ["expenses_summery", id],
    queryFn: () => expenseServices.getSummary(id),
    enabled: !!id,
  });
}

export function useGetBalances(id: string, mode: "ORIGINAL" | "SIMPLIFIED") {
  return useQuery({
    queryKey: ["expenses_balances", id,mode],
    queryFn: () => expenseServices.getBalances(id, mode),
    enabled: !!id,
  });
}

export function useGetReport(id: string) {
  return useQuery({
    queryKey: ["expenses_report", id],
    queryFn: () => expenseServices.getReport(id),
    enabled: !!id,
  });
}

export function useCreateSettlement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { receiverMemberId: string; amount: number; note?: string };
    }) => expenseServices.createSettlement(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["expenses_balances"] });
      queryClient.invalidateQueries({ queryKey: ["expenses_summery"] });
      queryClient.invalidateQueries({ queryKey: ["expenses_report"] });
      toast.success(res.message || "Settlement recorded successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}

